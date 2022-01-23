import { ethers } from 'ethers';
import { ProofOfResidency__factory as ProofOfResidencyFactory } from '../../types';

if (!process.env.PRIVATE_KEY || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error(
    'Must define process.env.PRIVATE_KEY and process.env.NEXT_PUBLIC_CONTRACT_ADDRESS'
  );
}

const provider = ethers.getDefaultProvider(
  process.env.VERCEL_ENV === 'production' ? 'rinkeby' : 'rinkeby',
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

export const hashAndSignEip712 = async (
  walletAddress: string,
  country: number,
  publicKey: string
) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'string'],
      [walletAddress, country, publicKey]
    )
  );

  const domain = await getEip712Domain(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    await wallet.getChainId()
  );

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' }
    ]
  };

  const signature = await wallet._signTypedData(domain, types, {
    to: walletAddress,
    commitment: hash
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { v, r, s };
};

export const validateSignature = async (payload: string, signature: string): Promise<string> => {
  const address = ethers.utils.verifyMessage(payload, signature);

  return address;
};
