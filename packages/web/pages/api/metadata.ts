import { NextApiRequest, NextApiResponse } from 'next';

const contractMetadata = {
  name: 'Proof of Residency',
  description:
    'Proof of Residency is an NFT generative art project based on maps; every design is created from content stored immutably on the Ethereum blockchain. Minting is limited to one NFT per mailing address and can only be completed after physical mail is received, as a first-ever experiment into city-based limits on token supply. Designs are inspired by real-world maps of hydrography and transportation networks.',
  image: 'https://proofofresidency.xyz/logo-dark.png',
  external_link: 'https://proofofresidency.xyz'
} as const;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<typeof contractMetadata | null>
) => {
  try {
    const method = req.method;

    if (method === 'GET') {
      return res.status(200).json(contractMetadata);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
