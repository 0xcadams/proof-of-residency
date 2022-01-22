import { ContractTransaction, ethers } from 'ethers';
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

export const commitAddress = async (
  address: string,
  city: number,
  secret: string
): Promise<ContractTransaction> => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(['address', 'uint256', 'string'], [address, city, secret])
  );

  return proofOfResidency.commitAddress(address, hash);
};

export const validateSignature = async (payload: string, signature: string): Promise<string> => {
  const address = ethers.utils.verifyMessage(payload, signature);

  return address;
};
