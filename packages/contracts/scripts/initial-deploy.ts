import { ethers, run } from 'hardhat';

async function main() {
  const baseUri = 'https://generator.proofofresidency.xyz/api/';
  const initialPrice = ethers.utils.parseEther('0.008');

  const committer = '0x615b1012097Db45fc4d7458125B03B148F71de97';
  const treasury = '0x5962Ba5b211D2Bff7c27988C61224671AE5E0587';

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

  const deployment = await proofOfResidencyOwner.deployed();

  console.log(`--- Deployed to the address: ${proofOfResidencyOwner.address}`);

  const chainId = await deployment.signer.getChainId();

  if (chainId !== 1337) {
    console.log(`Waiting for x seconds before verifying contract with Etherscan...`);

    await new Promise((r) => setTimeout(r, 90000));

    await run('verify:verify', {
      address: proofOfResidencyOwner.address,
      constructorArguments: [committer, treasury, baseUri, initialPrice]
    });

    console.log(`--- Verified`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
