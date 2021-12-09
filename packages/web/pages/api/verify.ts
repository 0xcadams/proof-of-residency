import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsAddress, VerifyUsAddressResponse } from 'src/api/lob';
import { VerifyAddressRequest } from 'types';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<VerifyUsAddressResponse | null>
) => {
  try {
    const method = req.method;
    const body: VerifyAddressRequest = req.body;

    if (method === 'POST') {
      const verifyResult = await verifyUsAddress(
        body.primaryLine,
        body.city,
        body.state,
        body.zipCode
      );
      return res.status(200).json(verifyResult);
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
