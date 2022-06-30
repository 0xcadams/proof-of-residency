import { NextApiRequest, NextApiResponse } from 'next';

import { getAllTokens } from 'src/api/subgraph';

import { GetAllTokensResponse } from '../../../types';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetAllTokensResponse | null>) => {
  try {
    const method = req.method;

    if (method === 'GET') {
      const tokens = await getAllTokens();

      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

      return res.status(200).json(tokens);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
