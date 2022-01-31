import { ethers } from 'hardhat';

async function main() {
  const baseUri = 'https://generator.proofofresidency.xyz/';
  const initialPrice = ethers.utils.parseEther('0.008');

  // change these
  const committer = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const treasury = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
  const proofOfResidencyOwner = await ProofOfResidency.deploy(
    committer,
    treasury,
    baseUri,
    initialPrice
  );

  console.log(
    `Transaction to deploy the Contract: ${proofOfResidencyOwner.deployTransaction.hash}. Waiting to be mined...`
  );

  await proofOfResidencyOwner.deployed();

  console.log(`--- Deployed to the address: ${proofOfResidencyOwner.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
