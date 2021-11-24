import { NextApiRequest, NextApiResponse } from 'next';

import { generatePublicPrivateKey } from '../../src/api/services/bip';

export type SubmitAddressRequest = {
  primaryLine: string;
  city: string;
  state: string;
  zipCode: string;

  password: string;
};

export type SubmitAddressResponse = {
  publicKey: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<SubmitAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: SubmitAddressRequest = req.body;

    if (method === 'POST') {
      if (!body.password) {
        return res.status(500).end('Password must be supplied');
      }

      const publicPrivateKey = await generatePublicPrivateKey(body.password);

      return res.status(200).json({ publicKey: publicPrivateKey.publicKey.toString('hex') });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
