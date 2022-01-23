import { NextApiRequest, NextApiResponse } from 'next';
import { generatePublicPrivateKey } from 'src/api/bip';
import { hashAndSignEip712, validateSignature } from 'src/api/ethers';

import iso from 'iso-3166-1';

import { SubmitAddressResponse, SubmitAddressRequest } from '../../types';

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

      const countryIso = iso.whereAlpha2(body.payload.address.country);

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

      const keygen = await generatePublicPrivateKey(body.payload.hashedPassword);

      const countryId = Number(countryIso.numeric);
      const countryName = countryIso.country;

      const { commitment, v, r, s } = await hashAndSignEip712(
        signatureAddress,
        countryId,
        keygen.publicKey.toString('hex')
      );

      console.log(`Mnemonic: ${keygen.mnemonic}`);

      // body.payload.addressId
      // TODO add Lob sending and limit to only one letter per address

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
