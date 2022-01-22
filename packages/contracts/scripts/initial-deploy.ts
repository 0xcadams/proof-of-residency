import { ethers } from 'hardhat';

async function main() {
  const gnosis = '0x16Fbd8615EFc888Ffa70579E885feD853Ed94273';
  const committer = '0x615b1012097Db45fc4d7458125B03B148F71de97';

  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
  const proofOfResidencyOwner = await ProofOfResidency.deploy(committer, gnosis);

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
