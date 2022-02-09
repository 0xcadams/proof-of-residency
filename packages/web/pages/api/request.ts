import { NextApiRequest, NextApiResponse } from 'next';
import { generatePublicPrivateKey } from 'src/api/bip';

import {
  getCurrentWalletAddress,
  getNonceForAddress,
  hashAndSignCommitmentEip712,
  validateMailingAddressSignature,
  validatePasswordSignature
} from 'src/api/ethers';

import { SubmitAddressResponse, SubmitAddressRequest } from '../../types';
import { sendLetter } from 'src/api/lob';
import { createClient } from 'redis';
import { ethers } from 'ethers';
import { getIsoCountryForAlpha2 } from 'src/web/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<SubmitAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: SubmitAddressRequest = req.body;

    if (method === 'POST') {
      if (!body.addressSignature || !body.passwordSignature) {
        return res.status(500).end('Signatures must be supplied');
      }

      const client = createClient({
        url: process.env.REDIS_URL
      });

      await client.connect();

      const getRedis = async (key: string): Promise<number | null> => {
        const value = await client.get(key);

        return value ? Number(value) : null;
      };

      const setRedis = async (key: string, value: number) => {
        await client.set(key, value, { PX: 3 * 1e9 });
      };

      if (!process.env.HASHED_ADDRESS_SALT) {
        return res
          .status(500)
          .end('Cannot securely store hashed addresses! Contact the committer.');
      }

      const hashedMailingAddress = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['string', 'string', 'string', 'string', 'string', 'string', 'string'],
          [
            body.addressPayload.addressLine1,
            body.addressPayload.addressLine2,
            body.addressPayload.city,
            body.addressPayload.state,
            body.addressPayload.postal,
            body.addressPayload.country,
            process.env.HASHED_ADDRESS_SALT
          ]
        )
      );

      if (body.addressPayload.deliverability !== 'deliverable') {
        return res.status(400).end('Must request a valid deliverable address');
      }

      const lastRequestHashedMailingAddress = await getRedis(hashedMailingAddress);
      const lastRequestAddressSig = await getRedis(body.addressSignature);
      // const lastRequestIp =
      //   typeof req.headers['x-forwarded-for'] === 'string' &&
      //   (await getRedis(req.headers['x-forwarded-for']));

      if (lastRequestAddressSig) {
        return res.status(400).end('Must request an address verification again');
      }
      // if (lastRequestIp && Date.now() - lastRequestIp <= 60000) {
      //   return res.status(429).end('Slow it down, cowboy!!');
      // }

      const requesterAddress = await validatePasswordSignature(
        body.passwordPayload.hashedPassword,
        body.passwordPayload.walletAddress,
        body.passwordPayload.nonce,
        body.passwordSignature
      );

      // ensure that the address was sent from this backend
      const signatureMailAddress = await validateMailingAddressSignature(
        body.addressPayload,
        body.addressSignature
      );

      if (signatureMailAddress !== getCurrentWalletAddress()) {
        return res.status(500).end('Mailing address signature was incorrect');
      }

      const countryIso = getIsoCountryForAlpha2(body.addressPayload.country);

      if (!countryIso) {
        return res.status(500).end('Country code was incorrect');
      }

      const keygen = await generatePublicPrivateKey(body.passwordPayload.hashedPassword);

      const countryId = Number(countryIso.numeric);
      const countryName = countryIso.country;

      const nonce = await getNonceForAddress(requesterAddress);

      const { commitment, v, r, s } = await hashAndSignCommitmentEip712(
        requesterAddress,
        countryId,
        keygen.publicKey,
        nonce
      );

      // require that the address hasn't been requested for 4 weeks
      if (
        lastRequestHashedMailingAddress &&
        Date.now() - lastRequestHashedMailingAddress <= 2.419 * 1e9
      ) {
        return res.status(429).end('Too many requests for this address!');
      }

      await sendLetter(
        body.addressPayload,
        keygen.mnemonic,
        ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['string', 'string'],
            [requesterAddress, process.env.HASHED_ADDRESS_SALT]
          )
        )
      );

      await setRedis(hashedMailingAddress, Date.now());
      await setRedis(body.addressSignature, Date.now());
      // if (typeof req.headers['x-forwarded-for'] === 'string') {
      //   await setRedis(req.headers['x-forwarded-for'], Date.now());
      // }

      return res.status(200).json({
        v,
        r,
        s,
        country: countryName,
        commitment
      });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
