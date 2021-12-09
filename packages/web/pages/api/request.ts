import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import path from 'path';
import { promises as fs } from 'fs';

import { generatePublicPrivateKey } from '../../src/api/services/bip';
import { commitAddress, validateSignature } from '../../src/api/services/ethers';
import { findMappingIndexForPoint } from '../../src/api/services/city';

export type SubmitAddressPayload = {
  walletAddress: string;

  latitude: number;
  longitude: number;

  name: string;

  primaryLine: string;
  secondaryLine: string;
  city: string;
  state: string;

  lobAddressId: string;
};

export type SubmitAddressRequest = {
  payload: SubmitAddressPayload;

  signature: string;
};

export type SubmitAddressResponse = {
  city: string;
};

type Mapping = {
  name: string;
  population: number;
  price: number;
  limit: number;
  state: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SubmitAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: SubmitAddressRequest = req.body;

    if (method === 'POST') {
      if (!body.signature) {
        return res.status(500).end('Signature must be supplied');
      }

      const signatureAddress = await validateSignature(
        JSON.stringify(body.payload, null, 2),
        body.signature
      );

      if (signatureAddress !== body.payload.walletAddress) {
        return res.status(500).end('Signature address does not match input address.');
      }

      const signatureHash = ethers.utils.keccak256(body.signature);

      const keygen = await generatePublicPrivateKey(signatureHash);

      const city = findMappingIndexForPoint(body.payload.latitude, body.payload.longitude);

      if (city === -1) {
        return res.status(404).end('City does not exist for latitude and longitude.');
      }

      const commitment = await commitAddress(
        signatureAddress,
        city,
        keygen.privateKey.toString('hex')
      );

      const commitmentTransaction = await commitment.wait();

      // if there is no commitment event, return an error and do not send a letter
      if (!commitmentTransaction.events?.some((e) => e.event === 'Commitment')) {
        return res.status(400).end('The transaction could not be successfully submitted.');
      }

      // TODO add Lob sending

      const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
      const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

      return res.status(200).json({
        city: mappings?.[city]?.name ?? ''
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
