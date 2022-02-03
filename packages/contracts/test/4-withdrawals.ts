import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency, FailingTreasuryTest, ReentrantTreasuryTest } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  signCommitment,
  timeTravelToEndOfTimelock,
  timeTravelToPastValid,
  timeTravelToValid
} from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: withdrawals', () => {
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
    proofOfResidencyOwner = await ProofOfResidency.deploy(
      committer.address,
      treasury.address,
      baseUri,
      initialPrice
    );

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
    it('should be able to withdraw for committer', async () => {
      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
        value: initialPrice
      });

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

      await timeTravelToEndOfTimelock();

      const originalTreasuryBalance = await treasury.getBalance();
      await proofOfResidencyCommitter.withdraw();
      expect((await treasury.getBalance()).sub(originalTreasuryBalance)).to.equal(
        initialPrice.mul(20).div(100)
      );
    });

    it('should be able to withdraw for treasury when recommit after first commitment expires', async () => {
      const commitment1 = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await proofOfResidencyRequester1.commitAddress(
        requester1.address,
        commitment1.hash,
        commitment1.v,
        commitment1.r,
        commitment1.s,
        {
          value: initialPrice
        }
      );

      await timeTravelToPastValid();

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        'secret2',

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

      await timeTravelToEndOfTimelock();

      const originalTreasuryBalance = await treasury.getBalance();
      await proofOfResidencyTreasury.withdraw();
      expect((await treasury.getBalance()).gt(originalTreasuryBalance)).to.be.true;
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail to withdraw when zero balance for committer', async () => {
      await expect(proofOfResidencyCommitter.withdraw()).to.be.revertedWith('Tax not over 0');
    });

    it('should fail to withdraw before timelock is expired', async () => {
      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
        value: initialPrice
      });

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

      await expect(proofOfResidencyCommitter.withdraw()).to.be.revertedWith('Timelocked');
    });

    it('should fail to withdraw when main project sets failing treasury', async () => {
      const FailingTreasuryTest = await ethers.getContractFactory('FailingTreasuryTest');
      failingTreasuryContract = await FailingTreasuryTest.deploy();

      const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
      // USES FAILING TREASURY CONTRACT
      proofOfResidencyOwner = await ProofOfResidency.deploy(
        committer.address,
        failingTreasuryContract.address,
        baseUri,
        initialPrice
      );

      proofOfResidencyRequester1 = proofOfResidencyOwner.connect(requester1);
      proofOfResidencyUnaffiliated = proofOfResidencyOwner.connect(unaffiliated);

      await proofOfResidencyOwner.addCommitter(unaffiliated.address);

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        unaffiliated,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
        value: initialPrice
      });

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

      await timeTravelToEndOfTimelock();

      await expect(proofOfResidencyUnaffiliated.withdraw()).to.be.revertedWith(
        'Unable to send project treasury'
      );
    });

    // TODO removed these since committers are always EOA accounts...
    //
    // it('should fail to withdraw to the failing treasury contract', async () => {
    //   // USES FAILING TREASURY CONTRACT
    //   await proofOfResidencyOwner.addCommitter(
    //     unaffiliated.address,
    //     failingTreasuryContract.address
    //   );

    //   const { hash, v, r, s } = await signCommitment(
    //     requester1.address,
    //     countryCommitment,
    //     secretCommitment,

    //     proofOfResidencyOwner.address,
    //     unaffiliated,
    //     await proofOfResidencyRequester1.nonces(requester1.address)
    //   );

    //   await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
    //     value: initialPrice
    //   });

    //   await timeTravelToValid();

    //   await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

    //   await expect(proofOfResidencyUnaffiliated.withdraw()).to.be.revertedWith(
    //     'Unable to withdraw'
    //   );

    //   // this is dumb but it's for code coverage :)
    //   await failingTreasuryContract.fallback();
    // });

    // it('should fail to withdraw to the reentrant treasury contract', async () => {
    //   // USES REENTRANT TREASURY CONTRACT
    //   await proofOfResidencyOwner.addCommitter(
    //     unaffiliated.address,
    //     reentrantTreasuryContract.address
    //   );

    //   const { hash, v, r, s } = await signCommitment(
    //     requester1.address,
    //     countryCommitment,
    //     secretCommitment,

    //     proofOfResidencyOwner.address,
    //     unaffiliated,
    //     await proofOfResidencyRequester1.nonces(requester1.address)
    //   );

    //   await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
    //     value: initialPrice
    //   });

    //   await timeTravelToValid();

    //   await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

    //   await expect(proofOfResidencyUnaffiliated.withdraw()).to.be.revertedWith(
    //     'Unable to withdraw'
    //   );
    // });
  });
});
