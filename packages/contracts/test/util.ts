import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

const timeTravelInDays = async (days: number) => {
  // skip forward x days
  await ethers.provider.send('evm_increaseTime', [days * 24 * 60 * 60]);
  await ethers.provider.send('evm_mine', []);
};

const timeTravelInWeeks = async (weeks: number) => timeTravelInDays(7 * weeks);

// 3 days
export const timeTravelToBeforeValid = async () => timeTravelInDays(3);

// 1 week
export const timeTravelToValid = async () => timeTravelInWeeks(1);

// 6 weeks and 1 day
export const timeTravelToPastValid = async () => timeTravelInDays(7 * 6 + 1);

// 8 weeks
export const timeTravelToEndOfTimelock = async () => timeTravelInWeeks(8);

export const getEip712Domain = async (contractAddress: string, chainId: number) => ({
  name: 'Proof of Residency Protocol',
  version: '1',
  chainId,
  verifyingContract: contractAddress
});

export const signCommitment = async (
  walletAddress: string,
  countryId: number,
  publicKey: string,

  contractAddress: string,
  signer: SignerWithAddress,

  nonce: BigNumber
) => {
  const domain = await getEip712Domain(contractAddress, await signer.getChainId());

  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'string', 'uint256'],
      [walletAddress, countryId, publicKey, nonce]
    )
  );

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' },
      { name: 'nonce', type: 'uint256' }
    ]
  };

  const signature = await signer._signTypedData(domain, types, {
    to: walletAddress,
    commitment: hash,
    nonce
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { hash, v, r, s };
};
