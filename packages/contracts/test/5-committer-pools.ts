import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency, FailingTreasuryTest, ReentrantTreasuryTest } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToEndOfTimelock, timeTravelToValid } from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: committer pools', () => {
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
    it('should be able to add a committer to the pool who can withdraw', async () => {
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

      const originalTreasuryBalance = await treasury.getBalance();
      const originalBalance = await requester2.getBalance();

      await proofOfResidencyUnaffiliated.withdraw();

      expect((await treasury.getBalance()).sub(originalTreasuryBalance)).to.equal(
        initialPrice.mul(20).div(100)
      );
      expect((await unaffiliated.getBalance()).gt(originalBalance)).to.be.true;
    });

    it('should be able to add many committers to the pool and choose one randomly', async () => {
      const signers = (await ethers.getSigners()).slice(10, 18);

      for (const signer of signers) {
        await expect(proofOfResidencyOwner.addCommitter(signer.address))
          .to.emit(proofOfResidencyOwner, 'CommitterAdded')
          .withArgs(signer.address);
      }

      // yes math.random is bad in tests but I think it's fun
      const randomSigner = signers[Math.floor(Math.random() * (signers.length - 1))];

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        randomSigner,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
        value: initialPrice
      });

      await timeTravelToValid();

      await proofOfResidencyRequester1.mint(countryCommitment, secretCommitment);

      await timeTravelToEndOfTimelock();

      // should add to the signer's balance
      const originalRandomSignerBalance = await randomSigner.getBalance();
      await proofOfResidencyOwner.connect(randomSigner).withdraw();
      expect((await randomSigner.getBalance()).gt(originalRandomSignerBalance)).to.be.true;
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    //
  });
});
