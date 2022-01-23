import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

export const timeTravel = async (days: number) => {
  // skip forward x days
  await ethers.provider.send('evm_increaseTime', [days * 24 * 60 * 60]);
  await ethers.provider.send('evm_mine', []);
};

// 1 week
export const timeTravelToValid = async () => timeTravel(7);

// 10 weeks
export const timeTravelToPastValid = async () => timeTravel(10 * 7);

export const getEip712Domain = async (contractAddress: string, chainId: number) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: contractAddress
});

export const signCommitment = async (
  contractAddress: string,
  toAddress: string,
  commitment: string,
  signer: SignerWithAddress
) => {
  const domain = await getEip712Domain(contractAddress, await signer.getChainId());

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' }
    ]
  };

  const signature = await signer._signTypedData(domain, types, {
    to: toAddress,
    commitment
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { v, r, s };
};
