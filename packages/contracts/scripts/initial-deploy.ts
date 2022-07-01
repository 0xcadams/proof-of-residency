import { ethers, run } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  const chainId = await ethers.getDefaultProvider().network.chainId;
  const baseUri = `https://generator.proofofresidency.xyz/api/${chainId}/`;
  const initialPrice = ethers.utils.parseEther('0.008');

  const committer = '0x615b1012097Db45fc4d7458125B03B148F71de97';
  const treasury = '0x5962Ba5b211D2Bff7c27988C61224671AE5E0587';

  const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
  const proofOfResidency = await ProofOfResidency.deploy(
    committer,
    treasury,
    baseUri,
    initialPrice
  );

  console.log(
    `Transaction to deploy the Contract: ${proofOfResidency.deployTransaction.hash}. Waiting to be mined...`
  );

  const deployment = await proofOfResidency.deployed();

  console.log(`--- Deployed to the address: ${proofOfResidency.address}`);

  console.log(`Writing subgraph config...`);

  const networkName = (await deployment.provider.getNetwork()).name;

  // update the subgraph config with the latest address
  const subgraphConfig = {
    network: chainId === 1337 ? 'hardhat' : networkName,
    address: proofOfResidency.address,
    startBlock: (await proofOfResidency.deployTransaction.wait()).blockNumber
  };

  const file = path.join(
    process.cwd(),
    `../subgraph/config/${chainId !== 1337 ? subgraphConfig.network : 'hardhat'}.json`
  );
  fs.writeFileSync(file, JSON.stringify(subgraphConfig, null, 2));

  if (chainId !== 1337) {
    console.log(`Waiting for x seconds before verifying contract with Etherscan...`);

    await new Promise((r) => setTimeout(r, 90000));

    await run('verify:verify', {
      address: proofOfResidency.address,
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
