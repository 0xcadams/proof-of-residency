import { ethers, upgrades } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { promises as fs } from 'fs';
import path from 'path';

import { ProofOfResidency } from '../../web/typechain-types';

chai.use(chaiAsPromised);
const { expect } = chai;

type Mapping = {
  name: string;
  population: number;
  price: number;
  limit: number;
  state: string;
};

describe('ProofOfResidency', () => {
  let proofOfResidency: ProofOfResidency;
  let mappings: Mapping[];

  beforeEach(async () => {
    const mappingFile = path.join(process.cwd(), '../web/sources/mappings.json');
    mappings = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const [owner] = await ethers.getSigners();

    const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency', owner);
    proofOfResidency = (await upgrades.deployProxy(ProofOfResidency, [])) as ProofOfResidency;
    await proofOfResidency.deployed();

    expect(proofOfResidency.address).to.properAddress;
  });

  describe('values match mappings.json', async () => {
    it('should match mint limit', async () => {
      let index = 0;
      for (const mapping of mappings) {
        const count = await proofOfResidency.cityMintLimit(index);
        expect(count, `${mapping.name} incorrect at index ${index}`).to.eq(mapping.limit);
        index++;
      }
    });
    it('should match required value', async () => {
      let index = 0;
      for (const mapping of mappings) {
        const count = await proofOfResidency.cityValue(index);
        expect(count, `${mapping.name} incorrect at index ${index}`).to.eq(
          ethers.utils.parseEther(mapping.price.toString())
        );
        index++;
      }
    });
  });
});
