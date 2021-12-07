import { upgrades, ethers } from 'hardhat';

async function main() {
  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');

  // If we had initializer arguments, they would be passed in here
  const contract = await upgrades.deployProxy(ProofOfResidency, []);

  console.log(
    `The transaction that was sent to the network to deploy the Contract: ${contract.deployTransaction.hash}. Waiting to be mined...`
  );

  await contract.deployed();

  console.log(`--- Deployed to the address: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
