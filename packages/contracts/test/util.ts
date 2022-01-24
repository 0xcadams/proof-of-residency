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
export const timeTravelToPastValid = async () => timeTravel(10 * 7 + 1);

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

  primaryLine: string,
  secondaryLine: string,
  lastLine: string,
  country: string,

  contractAddress: string,
  signer: SignerWithAddress
) => {
  const domain = await getEip712Domain(contractAddress, await signer.getChainId());

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

  const types = {
    Commitment: [
      { name: 'to', type: 'address' },
      { name: 'commitment', type: 'bytes32' },
      { name: 'hashedMailingAddress', type: 'bytes32' }
    ]
  };

  const signature = await signer._signTypedData(domain, types, {
    to: walletAddress,
    commitment: hash,
    hashedMailingAddress
  });

  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { hash, hashedMailingAddress, v, r, s };
};
