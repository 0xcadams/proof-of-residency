import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency, FailingTreasuryTest, ReentrantTreasuryTest } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';

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

  let failingTreasuryContract: FailingTreasuryTest;
  let reentrantTreasuryContract: ReentrantTreasuryTest;

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

    const FailingTreasuryTest = await ethers.getContractFactory('FailingTreasuryTest');
    failingTreasuryContract = await FailingTreasuryTest.deploy();

    const ReentrantTreasuryTest = await ethers.getContractFactory('ReentrantTreasuryTest');
    reentrantTreasuryContract = await ReentrantTreasuryTest.deploy(proofOfResidencyOwner.address);

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

      await proofOfResidencyOwner.addCommitter(unaffiliated.address, unaffiliated.address);

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        unaffiliated
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s);

      await timeTravelToValid();

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

    it('should set price for owner', async () => {
      await proofOfResidencyOwner.setPrice(value.add(100));

      expect(await proofOfResidencyUnaffiliated.mintPrice()).to.equal(value.add(100));
    });

    it('should remove committer for owner', async () => {
      await expect(proofOfResidencyOwner.removeCommitter(committer.address))
        .to.emit(proofOfResidencyOwner, 'CommitterRemoved')
        .withArgs(committer.address);
    });

    it('should be able to withdraw for committer', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, secretCommitment]
        )
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        committer
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s);

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
        value: value
      });

      const originalTreasuryBalance = await treasury.getBalance();

      await proofOfResidencyCommitter.withdraw(value);

      expect((await treasury.getBalance()).sub(originalTreasuryBalance)).to.equal(value);
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail to withdraw when zero balance for committer', async () => {
      await expect(proofOfResidencyCommitter.withdraw(value)).to.be.revertedWith(
        'Withdrawal amount not available'
      );
    });

    it('should fail to withdraw too large balance for committer', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, secretCommitment]
        )
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        committer
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s);

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
        value: value
      });

      await expect(proofOfResidencyCommitter.withdraw(value.add(1))).to.be.revertedWith(
        'Withdrawal amount not available'
      );
    });

    it('should fail to withdraw to the failing treasury contract', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, secretCommitment]
        )
      );

      // USES FAILING TREASURY CONTRACT
      await proofOfResidencyOwner.addCommitter(
        unaffiliated.address,
        failingTreasuryContract.address
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        unaffiliated
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s);

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
        value: value
      });

      await expect(proofOfResidencyUnaffiliated.withdraw(value)).to.be.revertedWith(
        'Unable to withdraw'
      );

      // this is dumb but it's for code coverage :)
      await failingTreasuryContract.fallback();
    });

    it('should fail to withdraw to the reentrant treasury contract', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, secretCommitment]
        )
      );

      // USES REENTRANT TREASURY CONTRACT
      await proofOfResidencyOwner.addCommitter(
        unaffiliated.address,
        reentrantTreasuryContract.address
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        unaffiliated
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s);

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
        value: value
      });

      await expect(proofOfResidencyUnaffiliated.withdraw(value.div(2))).to.be.revertedWith(
        'Unable to withdraw'
      );
    });

    it('should fail for public (no committing role)', async () => {
      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [proofOfResidencyRequester1.address, countryCommitment, secretCommitment]
        )
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        unaffiliated
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(proofOfResidencyRequester1.address, hash, v, r, s)
      ).to.be.revertedWith('Signatory is not a committer');
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

    it('should fail to remove committer for public (no owner role)', async () => {
      await expect(
        proofOfResidencyRequester1.removeCommitter(committer.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should fail to set price for public (no pausing role)', async () => {
      await expect(proofOfResidencyRequester1.setPrice(value.add(100))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
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
        proofOfResidencyRequester1.addCommitter(requester1.address, requester1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
