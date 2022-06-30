import { chain, chainId } from 'wagmi';

export type ProofOfResidencyNetwork = Exclude<keyof typeof chainId, 'kovan' | 'ropsten'>;

export const allChains =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? [chain.mainnet, chain.optimism, chain.arbitrum, chain.polygon]
    : [
        chain.goerli,
        chain.rinkeby,
        chain.arbitrumRinkeby,
        chain.optimismKovan,
        chain.polygonMumbai
      ];

export const PROOF_OF_RESIDENCY_CHAINS = Object.keys(chainId)
  .filter((e) => e !== 'kovan' && e !== 'ropsten')
  .filter((e) => allChains.some((chain) => chain.network === e))
  .map((e) => e as ProofOfResidencyNetwork);

export const isValidProofOfResidencyNetwork = (value: ProofOfResidencyNetwork) => {
  return PROOF_OF_RESIDENCY_CHAINS.includes(value);
};

export const getContractAddressForChain = (chain: ProofOfResidencyNetwork) =>
  chain === 'mainnet'
    ? '0x99C5B95408981C391cf6F1766d9B79f8E84ba0c8'
    : chain === 'arbitrum'
    ? '0x6f668f1892c62860c295B052739B3290fa4661B4'
    : chain === 'optimism'
    ? '0x6f668f1892c62860c295b052739b3290fa4661b4'
    : chain === 'polygon'
    ? '0xdB1fc2dd95Bf9374729a85A97F06421D99A917B9'
    : chain === 'goerli'
    ? '0x2D058D72fB57e3CA8DFb7cCc3f107c6Da840418A'
    : chain === 'rinkeby'
    ? '0xDe1eAc02F7967f73479c2c4ef4CAbF8274d3857f'
    : chain === 'arbitrumRinkeby'
    ? '0xeB528308c07AedEb22353ff4ae70143D5C27f677'
    : chain === 'optimismKovan'
    ? '0x6f668f1892c62860c295B052739B3290fa4661B4'
    : chain === 'polygonMumbai'
    ? '0x6f668f1892c62860c295b052739b3290fa4661b4'
    : process.env.NEXT_PUBLIC_LOCALHOST_CONTRACT_ADDRESS
    ? process.env.NEXT_PUBLIC_LOCALHOST_CONTRACT_ADDRESS
    : '0x6f668f1892c62860c295B052739B3290fa4661B4';
