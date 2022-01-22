import { ethers } from 'hardhat';

async function main() {
  const [me] = await ethers.getSigners();

  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');

  const paused = await ProofOfResidency.attach(
    '0x25C4B1508B5E6987266bE89409303Ba12f9c637e'
  ).connect(me);

  // .console.log(`--- Paused: ${paused.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
