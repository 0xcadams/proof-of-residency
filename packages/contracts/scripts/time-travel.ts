import { ethers } from 'hardhat';

export const timeTravel = async (days: number) => {
  // skip forward x days
  await ethers.provider.send('evm_increaseTime', [days * 24 * 60 * 60]);
  await ethers.provider.send('evm_mine', []);
};

// 1 week
export const timeTravelToValid = async () => timeTravel(7);

async function main() {
  // const [owner] = await ethers.getSigners();

  // const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');

  // const proofOfResidency = await ProofOfResidency.attach(
  //   '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  // ).connect(owner);

  await timeTravelToValid();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
