import { BigNumber, ethers } from 'ethers';
import { ProofOfResidency__factory as ProofOfResidencyFactory } from '../../types';

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error('Must define process.env.NEXT_PUBLIC_CONTRACT_ADDRESS');
}

const provider = ethers.getDefaultProvider(
  process.env.VERCEL_ENV === 'production' ? 'goerli' : 'goerli',
  {
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }
);

const proofOfResidency = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  provider
);

export const getCurrentNetwork = (): string => {
  return provider.network.name;
};

export const getMintedCount = async (cityId: number): Promise<BigNumber> => {
  try {
    return proofOfResidency.currentCityMintedCount(cityId);
  } catch (e) {
    return BigNumber.from(0);
  }
};

export type TokenOwner = { content: string; link: string | null };

export const getOwnerOfToken = async (tokenId: number): Promise<TokenOwner> => {
  const count = await proofOfResidency.currentCityMintedCount(Math.round(tokenId / 1e3));

  try {
    if (count.toNumber() >= tokenId % 1000) {
      const owner = await proofOfResidency.ownerOf(tokenId);

      return {
        content: owner?.slice(0, 8) || 'None',
        link: owner ? `https://etherscan.io/address/${owner}` : null
      };
    }
  } catch (e) {}

  return {
    content: 'None',
    link: null
  };
};
