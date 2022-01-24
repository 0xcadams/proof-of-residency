import { ethers } from 'ethers';

if (!process.env.PRIVATE_KEY || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error(
    'Must define process.env.PRIVATE_KEY and process.env.NEXT_PUBLIC_CONTRACT_ADDRESS'
  );
}

const provider = ethers.getDefaultProvider(
  process.env.VERCEL_ENV === 'production' ? 'rinkeby' : 'http://localhost:8545',
  {
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  }
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// const proofOfResidency = ProofOfResidencyFactory.connect(
//   process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
//   wallet
// );

const getEip712Domain = async (contractAddress: string, chainId: number) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: contractAddress
});

const mailingAddressTypes = {
  MailingAddress: [
    { name: 'primaryLine', type: 'string' },
    { name: 'secondaryLine', type: 'string' },
    { name: 'lastLine', type: 'string' },
    { name: 'country', type: 'string' }
  ]
};

export const signAddressEip712 = async (
  primaryLine: string,
  secondaryLine: string,
  lastLine: string,
  country: string
) => {
  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const signature = await wallet._signTypedData(domain, mailingAddressTypes, {
    primaryLine,
    secondaryLine,
    lastLine,
    country
  });

  return signature;
};

export const hashAndSignCommitmentEip712 = async (
  walletAddress: string,
  countryId: number,
  publicKey: string,

  primaryLine: string,
  secondaryLine: string,
  lastLine: string,
  country: string
) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'string'],
      [walletAddress, countryId, publicKey]
    )
  );

  const hashedMailingAddress = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'string', 'string', 'string'],
      [primaryLine, secondaryLine, lastLine, country]
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
      { name: 'hashedMailingAddress', type: 'bytes32' }
    ]
  };

  const signature = await wallet._signTypedData(domain, types, {
    to: walletAddress,
    commitment: hash,
    hashedMailingAddress
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { commitment: hash, hashedMailingAddress, v, r, s };
};

export const validateSignature = async (payload: string, signature: string): Promise<string> => {
  const address = ethers.utils.verifyMessage(payload, signature);

  return address;
};

export const validateMailingAddressSignature = async (
  primaryLine: string,
  secondaryLine: string,
  lastLine: string,
  country: string,
  signature: string
): Promise<string> => {
  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const address = ethers.utils.verifyTypedData(
    domain,
    mailingAddressTypes,
    {
      primaryLine,
      secondaryLine,
      lastLine,
      country
    },
    signature
  );

  return address;
};

export const getCurrentWalletAddress = (): string => {
  return wallet.address;
};
