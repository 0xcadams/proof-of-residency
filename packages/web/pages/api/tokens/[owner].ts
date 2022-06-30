import { NextApiRequest, NextApiResponse } from 'next';

import { getTokensForOwner } from 'src/api/ethers';

import { GetTokensResponse } from '../../../types';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetTokensResponse | null>) => {
  try {
    const method = req.method;

    if (method === 'GET') {
      const { owner } = req.query;

      const tokens = await getTokensForOwner(String(owner));

      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

      return res.status(200).json({
        l1: tokens.l1.eq('0') ? '' : tokens.l1.toString(),
        arbitrum: tokens.arbitrum.eq('0') ? '' : tokens.arbitrum.toString(),
        optimism: tokens.optimism.eq('0') ? '' : tokens.optimism.toString(),
        polygon: tokens.polygon.eq('0') ? '' : tokens.polygon.toString()
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
