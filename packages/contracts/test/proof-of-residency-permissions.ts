import { ethers, upgrades } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ProofOfResidencyPermissions', () => {
  const secretCommitment = 'secret1';
  const cityCommitment = 30;
  const value = ethers.utils.parseEther('0.4');

  let proofOfResidency: ProofOfResidency;

  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const [owner, address1] = await ethers.getSigners();
    addr1 = address1;

    const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency', owner);
    proofOfResidency = (await upgrades.deployProxy(ProofOfResidency, [])) as ProofOfResidency;
    await proofOfResidency.deployed();

    expect(proofOfResidency.address).to.properAddress;
  });

  describe('commit reveal scheme has correct permissions', async () => {
    it('should fail for public (no committing role)', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [addr1.address, cityCommitment, secretCommitment]
        )
      );

      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await expect(proofOfResidencyPublic.commitAddress(addr1.address, hash)).to.be.revertedWith(
        'AccessControl'
      );
    });

    it('should fail for public (never committed)', async () => {
      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect.');
    });

    it('should fail for public (never committed)', async () => {
      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect.');
    });
  });

  describe('pausing/unpausing has correct permissions', async () => {
    it('should pause/unpause for correct role (happy path)', async () => {
      expect(await proofOfResidency.paused()).to.be.equal(false);

      await proofOfResidency.pause();
      expect(await proofOfResidency.paused()).to.be.equal(true);

      await proofOfResidency.unpause();
      expect(await proofOfResidency.paused()).to.be.equal(false);
    });

    it('should fail for public (no pausing role)', async () => {
      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await expect(proofOfResidencyPublic.pause()).to.be.revertedWith('AccessControl');
    });

    it('should fail for public (no unpausing role)', async () => {
      await proofOfResidency.pause();

      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await expect(proofOfResidencyPublic.unpause()).to.be.revertedWith('AccessControl');
    });
  });

  describe('commit reveal scheme role can be assigned permissions', async () => {
    it('should succeed for assigning permissions (happy path)', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [addr1.address, cityCommitment, secretCommitment]
        )
      );

      await proofOfResidency.grantCommitterRole(addr1.address);

      const proofOfResidencyPublic = proofOfResidency.connect(addr1);

      await proofOfResidencyPublic.commitAddress(addr1.address, hash);

      await expect(
        proofOfResidencyPublic.safeMint(cityCommitment, secretCommitment, {
          value: value
        })
      )
        .to.emit(proofOfResidencyPublic, 'Transfer')
        .withArgs('0x0000000000000000000000000000000000000000', addr1.address, 30001);
    });
  });
});
