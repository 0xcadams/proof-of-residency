import { NextApiRequest, NextApiResponse } from 'next';

import { MetadataResponse, getMetadata, contractMetadata } from '../../../src/metadata';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<MetadataResponse | typeof contractMetadata>
) => {
  try {
    const method = req.method;

    if (method === 'GET') {
      const { id, chainId } = req.query;

      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=259200');

      const metadataOutput =
        id === 'contract'
          ? contractMetadata
          : await getMetadata(chainId?.toString() ?? '0', id?.toString() ?? '0');

      return res.status(200).json(metadataOutput);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export default handler;
