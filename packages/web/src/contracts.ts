import { chain, chainId } from 'wagmi';

export type ProofOfResidencyNetwork = Exclude<
  typeof chainId[keyof typeof chainId],
  'kovan' | 'ropsten'
>;

export const allChains =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? ([chain.mainnet, chain.optimism, chain.arbitrum, chain.polygon] as const)
    : ([chain.goerli, chain.arbitrumRinkeby, chain.optimismKovan, chain.polygonMumbai] as const);

export const PROOF_OF_RESIDENCY_CHAINS = allChains.map((e) => e.id as ProofOfResidencyNetwork);

export const getChainForChainId = (id: number) =>
  allChains.find((chain) => chain.id === id) ?? null;

export const isValidProofOfResidencyNetwork = (value: ProofOfResidencyNetwork) => {
  return PROOF_OF_RESIDENCY_CHAINS.includes(value);
};

export const getContractAddressForChain = (chainId: ProofOfResidencyNetwork) =>
  chainId === chain.mainnet.id
    ? '0x99C5B95408981C391cf6F1766d9B79f8E84ba0c8'
    : chainId === chain.arbitrum.id
    ? '0x6f668f1892c62860c295B052739B3290fa4661B4'
    : chainId === chain.optimism.id
    ? '0x6f668f1892c62860c295b052739b3290fa4661b4'
    : chainId === chain.polygon.id
    ? '0xdB1fc2dd95Bf9374729a85A97F06421D99A917B9'
    : chainId === chain.goerli.id
    ? '0x2D058D72fB57e3CA8DFb7cCc3f107c6Da840418A'
    : chainId === chain.rinkeby.id
    ? '0xDe1eAc02F7967f73479c2c4ef4CAbF8274d3857f'
    : chainId === chain.arbitrumRinkeby.id
    ? '0xeB528308c07AedEb22353ff4ae70143D5C27f677'
    : chainId === chain.optimismKovan.id
    ? '0x6f668f1892c62860c295B052739B3290fa4661B4'
    : chainId === chain.polygonMumbai.id
    ? '0x6f668f1892c62860c295b052739b3290fa4661b4'
    : process.env.NEXT_PUBLIC_LOCALHOST_CONTRACT_ADDRESS
    ? process.env.NEXT_PUBLIC_LOCALHOST_CONTRACT_ADDRESS
    : '0x6f668f1892c62860c295B052739B3290fa4661B4';

export const shortenEthereumAddress = (address: string | null | undefined) =>
  address?.replace(address?.slice(6, 38), '...') || 'None';
