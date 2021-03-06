import { BigNumber, ethers } from 'ethers';
import { getContractAddressForChain, ProofOfResidencyNetwork } from 'src/contracts';
import { AddressComponents, ProofOfResidency__factory as ProofOfResidencyFactory } from 'types';
import { chainId } from 'wagmi';

if (!process.env.PRIVATE_KEY) {
  throw new Error('Must define process.env.PRIVATE_KEY');
}

const l1Provider = new ethers.providers.InfuraProvider(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'goerli' : 'homestead',
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
);
const arbitrumProvider = new ethers.providers.InfuraProvider(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'arbitrum-rinkeby' : 'arbitrum',
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
);
const optimismProvider = new ethers.providers.InfuraProvider(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'optimism-kovan' : 'optimism',
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
);
const polygonProvider = new ethers.providers.InfuraProvider(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'maticmum' : 'matic',
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
);

const offchainWallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const proofOfResidencyL1 = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
    ? getContractAddressForChain(chainId.goerli)
    : getContractAddressForChain(chainId.mainnet),
  l1Provider
);
const proofOfResidencyArbitrum = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
    ? getContractAddressForChain(chainId.arbitrumRinkeby)
    : getContractAddressForChain(chainId.arbitrum),
  arbitrumProvider
);
const proofOfResidencyOptimism = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
    ? getContractAddressForChain(chainId.optimismKovan)
    : getContractAddressForChain(chainId.optimism),
  optimismProvider
);
const proofOfResidencyPolygon = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
    ? getContractAddressForChain(chainId.polygonMumbai)
    : getContractAddressForChain(chainId.polygon),
  polygonProvider
);

const getProofOfResidencyForChain = (chain: ProofOfResidencyNetwork) =>
  chain === chainId.mainnet || chain === chainId.goerli
    ? proofOfResidencyL1
    : chain === chainId.arbitrum || chain === chainId.arbitrumRinkeby
    ? proofOfResidencyArbitrum
    : chain === chainId.optimism || chain === chainId.optimismKovan
    ? proofOfResidencyOptimism
    : proofOfResidencyPolygon;

const getEip712Domain = (chainId: ProofOfResidencyNetwork) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: getContractAddressForChain(chainId)
});

export const hashAndSignCommitmentEip712 = async (
  walletAddress: string,
  countryId: number,
  publicKey: string,

  nonce: BigNumber,
  chain: ProofOfResidencyNetwork
) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'string', 'uint256'],
      [walletAddress, countryId, publicKey, nonce]
    )
  );

  const domain = getEip712Domain(chain);

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' },
      { name: 'nonce', type: 'uint256' }
    ]
  };

  const signature = await offchainWallet._signTypedData(domain, types, {
    to: walletAddress,
    commitment: hash,
    nonce
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { commitment: hash, v, r, s };
};

const mailingAddressTypes = {
  MailingAddress: [
    { name: 'name', type: 'string' },
    { name: 'addressLine1', type: 'string' },
    { name: 'addressLine2', type: 'string' },
    { name: 'city', type: 'string' },
    { name: 'state', type: 'string' },
    { name: 'postal', type: 'string' },
    { name: 'country', type: 'string' },
    { name: 'deliverability', type: 'string' },
    { name: 'expiration', type: 'uint256' }
  ]
};

export const signAddressEip712 = async (
  address: AddressComponents,
  chain: ProofOfResidencyNetwork
) => {
  const domain = getEip712Domain(chain);

  const signature = await offchainWallet._signTypedData(domain, mailingAddressTypes, address);

  return signature;
};

export const validateMailingAddressSignature = async (
  payload: AddressComponents,
  signature: string,
  chain: ProofOfResidencyNetwork
): Promise<string> => {
  const domain = getEip712Domain(chain);

  const address = ethers.utils.verifyTypedData(domain, mailingAddressTypes, payload, signature);

  return address;
};

const passwordTypes = {
  Password: [
    { name: 'password', type: 'string' },
    { name: 'walletAddress', type: 'string' },
    { name: 'nonce', type: 'uint256' }
  ]
};

export const validatePasswordSignature = async (
  password: string,
  walletAddress: string,
  nonce: BigNumber,
  signature: string,
  chain: ProofOfResidencyNetwork
): Promise<string> => {
  const domain = getEip712Domain(chain);

  const address = ethers.utils.verifyTypedData(
    domain,
    passwordTypes,
    {
      password,
      walletAddress,
      nonce
    },
    signature
  );

  return address;
};

export const getCurrentWalletAddress = (): string => {
  return offchainWallet.address;
};

export const getNonceForAddress = async (address: string, chain: ProofOfResidencyNetwork) => {
  const proofOfResidency = getProofOfResidencyForChain(chain);

  return proofOfResidency.nonces(address);
};

export const getEns = async (address: string) => {
  const name = await l1Provider.lookupAddress(address);
  let avatar: string | null = name ? `https://metadata.ens.domains/mainnet/avatar/${name}` : null;

  return {
    name,
    avatar
  };
};
