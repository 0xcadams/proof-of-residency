import { ContractTransaction, ethers } from 'ethers';
import { ProofOfResidency__factory as ProofOfResidencyFactory } from '../../../typechain-types';

if (!process.env.PRIVATE_KEY || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error(
    'Must define process.env.PRIVATE_KEY and process.env.NEXT_PUBLIC_CONTRACT_ADDRESS'
  );
}

const provider = new ethers.providers.JsonRpcProvider();
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const connectedWallet = wallet.connect(provider);

const proofOfResidency = ProofOfResidencyFactory.connect(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  connectedWallet
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
