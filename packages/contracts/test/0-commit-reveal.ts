import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  signCommitment,
  timeTravelToBeforeValid,
  timeTravelToPastValid,
  timeTravelToValid
} from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 444;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: commit/reveal scheme', () => {
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
    )
      .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
      .withArgs(requester1.address, committer.address, hash);
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for public', async () => {
      await timeTravelToValid();

      const mintedCount1 = await proofOfResidencyRequester1.countryTokenCounts(countryCommitment);

      expect(mintedCount1.toNumber()).to.equal(0);

      await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment))
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(
          ethers.constants.AddressZero,
          requester1.address,
          ethers.BigNumber.from('444000000000000001')
        );

      const mintedCount2 = await proofOfResidencyRequester1.countryTokenCounts(countryCommitment);

      expect(mintedCount2.toNumber()).to.equal(1);
    });

    it('should succeed to recommit + mint after first commitment expires', async () => {
      expect(await proofOfResidencyRequester1.commitmentPeriodIsValid()).to.be.false;
      expect(await proofOfResidencyRequester1.commitmentPeriodIsUpcoming()).to.be.true;

      await timeTravelToPastValid();

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        'secret2',

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      expect(await proofOfResidencyRequester1.commitmentPeriodIsValid()).to.be.false;
      expect(await proofOfResidencyRequester1.commitmentPeriodIsUpcoming()).to.be.false;

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      )
        .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
        .withArgs(requester1.address, committer.address, hash);

      await timeTravelToValid();

      expect(await proofOfResidencyRequester1.commitmentPeriodIsValid()).to.be.true;
      expect(await proofOfResidencyRequester1.commitmentPeriodIsUpcoming()).to.be.false;

      await expect(proofOfResidencyRequester1.mint(countryCommitment, 'secret2'))
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(
          ethers.constants.AddressZero,
          requester1.address,
          ethers.BigNumber.from('444000000000000001')
        );
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail to mint when a committer is removed', async () => {
      await timeTravelToValid();

      await expect(proofOfResidencyOwner.removeCommitter(committer.address, true))
        .to.emit(proofOfResidencyOwner, 'CommitterRemoved')
        .withArgs(committer.address, 0, true);

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)
      ).to.be.revertedWith('Signatory removed');
    });

    it('should fail for early minting', async () => {
      await timeTravelToBeforeValid();

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)
      ).to.be.revertedWith('Commitment period invalid');
    });

    it('should fail for expired commitment', async () => {
      await timeTravelToPastValid();

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)
      ).to.be.revertedWith('Commitment period invalid');
    });

    it('should fail to commit without enough ETH', async () => {
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
          value: initialPrice.sub(1)
        })
      ).to.be.revertedWith('Incorrect value');
    });

    it('should fail to try to mint twice with the same commitment after burning original', async () => {
      await timeTravelToValid();

      await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)).to.emit(
        proofOfResidencyRequester1,
        'Transfer'
      );

      await expect(
        proofOfResidencyRequester1.burn(ethers.BigNumber.from('444000000000000001'))
      ).to.emit(proofOfResidencyRequester1, 'Transfer');

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)
      ).to.be.revertedWith('Commitment incorrect');
    });

    it('should fail to try to mint twice with a new commitment (but still have existing token)', async () => {
      await timeTravelToValid();

      await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)).to.emit(
        proofOfResidencyRequester1,
        'Transfer'
      );

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        'commitment222',

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
        proofOfResidencyRequester1.mint(countryCommitment, 'commitment222')
      ).to.be.revertedWith('Already owns token');
    });

    it('should fail for duplicate immediate commitment (already committed to another country)', async () => {
      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment + 1,
        'secret-another',

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.be.revertedWith('Existing commitment');
    });

    it('should fail for duplicate commitment while valid (already committed to another country)', async () => {
      await timeTravelToValid();

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment + 1,
        'secret-another',

        proofOfResidencyOwner.address,
        committer,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.be.revertedWith('Existing commitment');
    });

    it('should fail for public (incorrect secret)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, 'incorrect secret')
      ).to.be.revertedWith('Commitment incorrect');
    });

    it('should fail for public (incorrect city)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment + 2, secretCommitment)
      ).to.be.revertedWith('Commitment incorrect');
    });
  });
});
