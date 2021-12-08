import { BigNumber, ethers } from 'ethers';
import { ProofOfResidency__factory as ProofOfResidencyFactory } from '../typechain-types';

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error('Must define process.env.NEXT_PUBLIC_CONTRACT_ADDRESS');
}

const provider = new ethers.providers.JsonRpcProvider();

const proofOfResidency = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  provider
);

export const getMintedCount = async (cityId: number): Promise<BigNumber> => {
  return proofOfResidency.currentCityMintedCount(cityId);
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
