import { ethers, upgrades } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { promises as fs } from 'fs';
import path from 'path';

import { ProofOfResidency } from '../../web/typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const mappingFile = path.join(process.cwd(), '../web/sources/mappings.json');
    mappings = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const [owner, address1] = await ethers.getSigners();
    addr1 = address1;

    const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency', owner);
    proofOfResidency = (await upgrades.deployProxy(ProofOfResidency, [])) as ProofOfResidency;
    await proofOfResidency.deployed();

    expect(proofOfResidency.address).to.properAddress;
  });

  describe('commit reveal scheme functions correctly', async () => {
    it('should match required value', async () => {
      const secret = 'secret1';
      const city = 0;

      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [addr1.address, city, secret]
        )
      );

      await proofOfResidency.commitAddress(addr1.address, hash);

      const proofOfResidency2 = proofOfResidency.connect(addr1);

      await expect(
        proofOfResidency2.safeMint(city, secret, {
          value: ethers.utils.parseEther('0.4')
        })
      )
        .to.emit(proofOfResidency2, 'Transfer')
        .withArgs('0x0000000000000000000000000000000000000000', addr1.address, 1);
    });
  });
});
