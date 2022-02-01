import { BigNumber, ethers } from 'ethers';
import { getCountryAndTokenNumber } from 'src/web/token';
import { AddressComponents, ProofOfResidency__factory as ProofOfResidencyFactory } from 'types';

if (!process.env.PRIVATE_KEY || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error(
    'Must define process.env.PRIVATE_KEY and process.env.NEXT_PUBLIC_CONTRACT_ADDRESS'
  );
}

const provider = ethers.getDefaultProvider(
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? 'rinkeby'
    : 'http://localhost:8545',
  {
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const proofOfResidency = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  wallet
);

const getEip712Domain = async (contractAddress: string, chainId: number) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: contractAddress
});

export const hashAndSignCommitmentEip712 = async (
  walletAddress: string,
  countryId: number,
  publicKey: string,

  nonce: BigNumber
) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'string', 'uint256'],
      [walletAddress, countryId, publicKey, nonce]
    )
  );

  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' },
      { name: 'nonce', type: 'uint256' }
    ]
  };

  const signature = await wallet._signTypedData(domain, types, {
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
    { name: 'nonce', type: 'uint256' }
  ]
};

export const signAddressEip712 = async (address: AddressComponents) => {
  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const signature = await wallet._signTypedData(domain, mailingAddressTypes, address);

  return signature;
};

export const validateMailingAddressSignature = async (
  payload: AddressComponents,
  signature: string
): Promise<string> => {
  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const address = ethers.utils.verifyTypedData(domain, mailingAddressTypes, payload, signature);

  return address;
};

const passwordTypes = {
  Password: [
    { name: 'password', type: 'string' },
    { name: 'nonce', type: 'uint256' }
  ]
};

export const validatePasswordSignature = async (
  password: string,
  nonce: BigNumber,
  signature: string
): Promise<string> => {
  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const address = ethers.utils.verifyTypedData(
    domain,
    passwordTypes,
    {
      password,
      nonce
    },
    signature
  );

  return address;
};

export const getCurrentWalletAddress = (): string => {
  return wallet.address;
};

export const getCurrentMintedCount = async (countryId: BigNumber | number) => {
  return proofOfResidency.countryTokenCounts(countryId);
};

export const getNonceForAddress = async (address: string) => {
  return proofOfResidency.nonces(address);
};

export type TokenOwner = { content: string; link: string | null };

export const getOwnerOfToken = async (tokenId: string | BigNumber): Promise<TokenOwner> => {
  try {
    const { countryId, tokenNumber } = getCountryAndTokenNumber(tokenId);

    const count = await getCurrentMintedCount(countryId);

    if (count.gte(tokenNumber)) {
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
