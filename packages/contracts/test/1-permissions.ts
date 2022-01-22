import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Proof of Residency: permissions', () => {
  const secretCommitment = 'secret1';
  const countryCommitment = 411;
  const value = ethers.utils.parseEther('0.008');

  let proofOfResidencyOwner: ProofOfResidency;
  let proofOfResidencyCommitter: ProofOfResidency;
  let proofOfResidencyTreasury: ProofOfResidency;
  let proofOfResidencyRequester1: ProofOfResidency;
  let proofOfResidencyRequester2: ProofOfResidency;
  let proofOfResidencyUnaffiliated: ProofOfResidency;

  let owner: SignerWithAddress;
  let committer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let requester1: SignerWithAddress;
  let requester2: SignerWithAddress;
  let unaffiliated: SignerWithAddress;

  beforeEach(async () => {
    [owner, committer, treasury, requester1, requester2, unaffiliated] = await ethers.getSigners();

    const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
    proofOfResidencyOwner = await ProofOfResidency.deploy(committer.address, treasury.address);

    proofOfResidencyCommitter = proofOfResidencyOwner.connect(committer);
    proofOfResidencyTreasury = proofOfResidencyOwner.connect(treasury);

    proofOfResidencyRequester1 = proofOfResidencyOwner.connect(requester1);
    proofOfResidencyRequester2 = proofOfResidencyOwner.connect(requester2);

    proofOfResidencyUnaffiliated = proofOfResidencyOwner.connect(unaffiliated);
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for assigning permissions to random person', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, secretCommitment]
        )
      );

      await proofOfResidencyOwner.setCommitter(unaffiliated.address);

      await proofOfResidencyUnaffiliated.commitAddress(requester1.address, hash);

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value
        })
      )
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(
          ethers.constants.AddressZero,
          requester1.address,
          ethers.BigNumber.from('411000000000000001')
        );
    });

    it('should pause/unpause for owner', async () => {
      expect(await proofOfResidencyOwner.paused()).to.be.equal(false);

      await proofOfResidencyOwner.pause();
      expect(await proofOfResidencyOwner.paused()).to.be.equal(true);

      await proofOfResidencyOwner.unpause();
      expect(await proofOfResidencyOwner.paused()).to.be.equal(false);
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail for public (no committing role)', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [proofOfResidencyRequester1.address, countryCommitment, secretCommitment]
        )
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(proofOfResidencyRequester1.address, hash)
      ).to.be.revertedWith('Caller is not the committer');
    });

    it('should fail for public (never committed)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect');
    });

    it('should fail for public (never committed)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect');
    });

    it('should fail for public (no pausing role)', async () => {
      await expect(proofOfResidencyRequester1.pause()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail for public (no unpausing role)', async () => {
      await expect(proofOfResidencyRequester1.unpause()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail for public (no pausing role)', async () => {
      await expect(
        proofOfResidencyRequester1.setCommitter(proofOfResidencyRequester1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
