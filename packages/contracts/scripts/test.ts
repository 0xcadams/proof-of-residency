import { ethers } from 'hardhat';
import BIP32Factory from 'bip32';

import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export const timeTravel = async (days: number) => {
  // skip forward x days
  await ethers.provider.send('evm_increaseTime', [days * 24 * 60 * 60]);
  await ethers.provider.send('evm_mine', []);
};

// 1 week
export const timeTravelToValid = async () => timeTravel(7);

async function main() {
  const [owner] = await ethers.getSigners();

  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');

  const proofOfResidency = await ProofOfResidency.attach(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  ).connect(owner);

  await timeTravelToValid();

  // const mnemonic = 'melody lift steak split round mutual venture abandon link arm jump winter';
  // const password = 'sandy1';

  // const hashedPassword = ethers.utils.keccak256(
  //   ethers.utils.toUtf8Bytes(`${owner.address}${password}`)
  // );

  // const seedBuffer = await bip39.mnemonicToSeed(mnemonic, hashedPassword);
  // const node = bip32.fromSeed(seedBuffer);

  // const transaction = await proofOfResidency.mint(1, node?.publicKey?.toString('hex') ?? '', {
  //   value: ethers.utils.parseEther('0.008')
  // });

  // console.log(`--- Transaction: ${transaction.hash}`);
  // console.log(transaction);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
