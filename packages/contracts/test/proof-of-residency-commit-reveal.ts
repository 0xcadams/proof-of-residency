import { ethers, upgrades } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {
  ProofOfResidency,
  ProofOfResidency__factory as ProofOfResidencyFactory
} from '../../web/typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ProofOfResidencyCommitReveal', () => {
  const secretCommitment = 'secret1';
  const cityCommitment = 4;
  const value = ethers.utils.parseEther('0.2');

  let proofOfResidency: ProofOfResidency;
  let proofOfResidencyPublic: ProofOfResidency;

  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const [owner, address1] = await ethers.getSigners();
    addr1 = address1;

    // const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency', owner);
    // proofOfResidency = (await upgrades.deployProxy(ProofOfResidency, [])) as ProofOfResidency;
    // await proofOfResidency.deployed();

    const proofOfResidency = ProofOfResidencyFactory.connect(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
      owner
    );

    expect(proofOfResidency.address).to.properAddress;

    const hash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'string'],
        [addr1.address, cityCommitment, secretCommitment]
      )
    );

    await proofOfResidency.commitAddress(addr1.address, hash);

    proofOfResidencyPublic = proofOfResidency.connect(addr1);
  });

  describe('commit reveal scheme functions correctly', async () => {
    it('should succeed for public (happy path)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value
        })
      )
        .to.emit(proofOfResidencyPublic, 'Transfer')
        .withArgs('0x0000000000000000000000000000000000000000', addr1.address, 4001);
    });
    it('should initialize token uri', async () => {
      await (
        await proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value
        })
      ).wait();

      const tokenUri = await proofOfResidency.tokenURI(4001);

      expect(tokenUri).to.contain('ipfs://baf').and.to.contain('/4001');
    });

    it('should fail for duplicate commitment (already committed to another city)', async () => {
      const hash2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [addr1.address, cityCommitment + 1, 'secret-another']
        )
      );

      await expect(proofOfResidency.commitAddress(addr1.address, hash2)).to.be.revertedWith(
        'Address has already committed to another city.'
      );
    });
    it('should fail for public (incorrect secret)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, 'incorrect secret', {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect.');
    });
    it('should fail for public (incorrect city)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment + 2, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect.');
    });
    it('should fail for public (incorrect value sent)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value.sub(ethers.utils.parseEther('0.05'))
        })
      ).to.be.revertedWith('Not enough ETH sent to mint.');
    });
    it('should fail for public (incorrect secret + city)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment + 2, 'incorrect secret', {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect.');
    });
    it('should fail for public (incorrect secret + city + value sent)', async () => {
      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment + 2, 'incorrect secret', {
          value: value.sub(ethers.utils.parseEther('0.1'))
        })
      ).to.be.revertedWith('Not enough ETH sent to mint.');
    });
  });
});
