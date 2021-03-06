import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { FailingTreasuryTest, ProofOfResidency, ReentrantTreasuryTest } from '../../web/types';
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
const countryCommitment = 2;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: token challenges', () => {
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

    proofOfResidencyCommitter = proofOfResidencyOwner.connect(committer);
    proofOfResidencyTreasury = proofOfResidencyOwner.connect(treasury);

    proofOfResidencyRequester1 = proofOfResidencyOwner.connect(requester1);
    proofOfResidencyRequester2 = proofOfResidencyOwner.connect(requester2);

    proofOfResidencyUnaffiliated = proofOfResidencyOwner.connect(unaffiliated);

    const FailingTreasuryTest = await ethers.getContractFactory('FailingTreasuryTest');
    failingTreasuryContract = await FailingTreasuryTest.deploy();

    const ReentrantTreasuryTest = await ethers.getContractFactory('ReentrantTreasuryTest');
    reentrantTreasuryContract = await ReentrantTreasuryTest.deploy(proofOfResidencyOwner.address);

    const { hash, v, r, s } = await signCommitment(
      requester1.address,
      countryCommitment,
      secretCommitment,

      proofOfResidencyOwner.address,
      committer,
      await proofOfResidencyRequester1.nonces(requester1.address)
    );

    await expect(
      proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
        value: initialPrice
      })
    ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

    await timeTravelToValid();

    await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)).to.emit(
      proofOfResidencyRequester1,
      'Transfer'
    );
  });

  describe('PORP functions correctly (happy paths)', async () => {
    it('should succeed to challenge a singular address and burn their tokens on expiration', async () => {
      const tokenId = ethers.BigNumber.from('2000000000000001');

      await expect(await proofOfResidencyOwner.tokenChallengeExists(requester1.address)).to.be
        .false;
      await expect(await proofOfResidencyOwner.tokenChallengeExpired(requester1.address)).to.be
        .false;

      await expect(proofOfResidencyOwner.challenge([requester1.address]))
        .to.emit(proofOfResidencyOwner, 'TokenChallenged')
        .withArgs(requester1.address, tokenId);

      await expect(await proofOfResidencyOwner.tokenChallengeExists(requester1.address)).to.be.true;
      await expect(await proofOfResidencyOwner.tokenChallengeExpired(requester1.address)).to.be
        .false;

      await timeTravelToPastValid();

      await expect(await proofOfResidencyOwner.tokenChallengeExists(requester1.address)).to.be.true;
      await expect(await proofOfResidencyOwner.tokenChallengeExpired(requester1.address)).to.be
        .true;

      await expect(proofOfResidencyOwner.burnFailedChallenges([requester1.address]))
        .to.emit(proofOfResidencyOwner, 'Transfer')
        .withArgs(requester1.address, ethers.constants.AddressZero, tokenId);
    });

    it('should succeed to challenge a singular address and respond to the challenge successfully', async () => {
      const tokenId = ethers.BigNumber.from('2000000000000001');

      await expect(proofOfResidencyOwner.challenge([requester1.address])).to.emit(
        proofOfResidencyOwner,
        'TokenChallenged'
      );

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

      await timeTravelToValid();

      await expect(
        proofOfResidencyRequester1.respondToChallenge(tokenId, countryCommitment, secretCommitment)
      )
        .to.emit(proofOfResidencyRequester1, 'TokenChallengeCompleted')
        .withArgs(requester1.address, tokenId);

      await expect(
        proofOfResidencyOwner.burnFailedChallenges([requester1.address])
      ).to.be.revertedWith('Challenge not expired');
    });

    it('should succeed to challenge a singular address and add to the committer contributions on burn', async () => {
      await proofOfResidencyOwner.challenge([requester1.address]);

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

      await timeTravelToPastValid();

      await expect(proofOfResidencyOwner.burnFailedChallenges([requester1.address])).to.emit(
        proofOfResidencyOwner,
        'Transfer'
      );

      await timeTravelToEndOfTimelock();

      // check that the committer is paid for the commitment they made even if burned
      const originalBalance = await committer.getBalance();
      await proofOfResidencyCommitter.withdraw();
      expect((await committer.getBalance()).gt(originalBalance)).to.be.true;
    });
  });

  describe('PORP functions correctly (sad paths)', async () => {
    it('should fail to challenge a nonexistent address', async () => {
      await expect(
        proofOfResidencyOwner.challenge([requester1.address, unaffiliated.address])
      ).to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
    });

    it('should fail to withdraw committer contributions on burn when timelock not expired', async () => {
      await proofOfResidencyOwner.challenge([requester1.address]);

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

      await timeTravelToPastValid();

      await expect(proofOfResidencyOwner.burnFailedChallenges([requester1.address])).to.emit(
        proofOfResidencyOwner,
        'Transfer'
      );

      await expect(proofOfResidencyCommitter.withdraw()).to.be.revertedWith('Timelocked');
    });

    it('should fail to respond to a challenge when the sender is a reentrant contract', async () => {
      const tokenId = ethers.BigNumber.from('2000000000000001');

      await expect(proofOfResidencyOwner.challenge([requester1.address])).to.emit(
        proofOfResidencyOwner,
        'TokenChallenged'
      );

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.emit(proofOfResidencyCommitter, 'CommitmentCreated');

      await timeTravelToValid();

      // use reentrant contract here
      await expect(
        reentrantTreasuryContract.respondToChallenge(tokenId, countryCommitment, secretCommitment)
      ).to.be.revertedWith('Commitment incorrect');
    });

    it('should fail to respond to a challenge with the wrong country', async () => {
      const badTokenId = ethers.BigNumber.from('3000000000000001');

      await proofOfResidencyOwner.challenge([requester1.address]);

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

      await expect(
        proofOfResidencyRequester1.respondToChallenge(
          badTokenId,
          countryCommitment,
          secretCommitment
        )
      ).to.be.revertedWith('Country not valid');
    });
  });
});
