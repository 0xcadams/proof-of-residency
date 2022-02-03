import { ethers } from 'hardhat';

async function main() {
  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');

  const proofOfResidency = await ProofOfResidency.attach(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  );

  console.log(`--- Result: ${proofOfResidency.ownerOf('840000000000000001')}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
