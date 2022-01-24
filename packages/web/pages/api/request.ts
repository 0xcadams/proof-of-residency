import { NextApiRequest, NextApiResponse } from 'next';
import { generatePublicPrivateKey } from 'src/api/bip';
import {
  getCurrentWalletAddress,
  hashAndSignCommitmentEip712,
  validateMailingAddressSignature,
  validateSignature
} from 'src/api/ethers';

import iso from 'iso-3166-1';

import { SubmitAddressResponse, SubmitAddressRequest } from '../../types';
import { sendLetter } from 'src/api/lob';

const handler = async (req: NextApiRequest, res: NextApiResponse<SubmitAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: SubmitAddressRequest = req.body;

    if (method === 'POST') {
      if (!body.addressSignature || !body.passwordSignature) {
        return res.status(500).end('Signatures must be supplied');
      }

      const signaturePasswordAddress = await validateSignature(
        JSON.stringify(body.passwordPayload, null, 2),
        body.passwordSignature
      );

      // ensure that the address was sent from this backend
      const signatureMailAddress = await validateMailingAddressSignature(
        body.addressPayload.primaryLine,
        body.addressPayload.secondaryLine,
        body.addressPayload.lastLine,
        body.addressPayload.country,
        body.addressSignature
      );

      if (signatureMailAddress !== getCurrentWalletAddress()) {
        return res.status(500).end('Mailing address signature was incorrect');
      }

      const countryIso = iso.whereAlpha2(body.addressPayload.country);

      if (!countryIso) {
        return res.status(500).end('Country code was incorrect');
      }

      // TODO
      // const distance = haversine(
      //   props.geolocation,
      //   {
      //     latitude: result.data.components.latitude,
      //     longitude: result.data.components.longitude
      //   },
      //   { unit: 'meter' }
      // );

      // if (distance <= 2000) {

      // }

      const keygen = await generatePublicPrivateKey(body.passwordPayload.hashedPassword);

      const countryId = Number(countryIso.numeric);
      const countryName = countryIso.country;

      const { commitment, hashedMailingAddress, v, r, s } = await hashAndSignCommitmentEip712(
        signaturePasswordAddress,
        countryId,
        keygen.publicKey.toString('hex'),
        body.addressPayload.primaryLine,
        body.addressPayload.secondaryLine,
        body.addressPayload.lastLine,
        body.addressPayload.country
      );

      // TODO add Lob sending and limit to only one letter per address
      await sendLetter(
        body.name,
        body.addressPayload.primaryLine,
        body.addressPayload.secondaryLine,
        body.addressPayload.lastLine,
        body.addressPayload.country,

        keygen.mnemonic,

        signaturePasswordAddress
      );

      return res.status(200).json({
        v,
        r,
        s,
        country: countryName,
        commitment,
        hashedMailingAddress
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
