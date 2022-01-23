import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import path from 'path';
import { generatePublicPrivateKey } from 'src/api/bip';
import { findMappingIndexForPoint } from 'src/api/city';
import { hashAndSignEip712, validateSignature } from 'src/api/ethers';

import { SubmitAddressResponse, SubmitAddressRequest, Mapping } from '../../types';

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

      const country = findMappingIndexForPoint(body.latitude, body.longitude);

      if (country === -1) {
        return res.status(404).end('City does not exist for latitude and longitude.');
      }

      const { v, r, s } = await hashAndSignEip712(
        signatureAddress,
        country,
        keygen.publicKey.toString('hex')
      );

      console.log(`Mnemonic: ${keygen.mnemonic}`);

      // TODO add Lob sending

      const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
      const mappings: Mapping[] = JSON.parse(
        (await fs.readFileSync(mappingFile, 'utf8')).toString()
      );

      return res.status(200).json({
        v,
        r,
        s,
        country: mappings?.[country]?.name ?? ''
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
