import { NextApiRequest, NextApiResponse } from 'next';
import { getTokensForOwner } from 'src/api/subgraph';

import { GetTokensForOwnerResponse } from '../../../types';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetTokensForOwnerResponse | null>
) => {
  try {
    const method = req.method;

    if (method === 'GET') {
      const { owner } = req.query;

      const tokens = await getTokensForOwner(String(owner));

      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

      return res.status(200).json({
        ...tokens
      });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
