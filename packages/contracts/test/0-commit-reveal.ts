import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravel, timeTravelToPastValid, timeTravelToValid } from './util';
import { BigNumber } from 'ethers';

chai.use(chaiAsPromised);
const { expect } = chai;

const primaryLine = '370 WATER ST';
const secondaryLine = '';
const lastLine = 'SUMMERSIDE PE C1N 1C4';
const country = 'CA';
const mailingAddressId = BigNumber.from(
  '74931654352136841322477683321810728405693153704805913520852177993368555879610'
);

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

    const { hash, hashedMailingAddress, v, r, s } = await signCommitment(
      requester1.address,
      countryCommitment,
      secretCommitment,

      primaryLine,
      secondaryLine,
      lastLine,
      country,

      proofOfResidencyOwner.address,
      committer
    );

    await expect(
      proofOfResidencyRequester1.commitAddress(
        requester1.address,
        hash,
        hashedMailingAddress,
        v,
        r,
        s
      )
    )
      .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
      .withArgs(requester1.address, committer.address, mailingAddressId, hash);
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for public', async () => {
      await timeTravelToValid();

      const mintedCount1 = await proofOfResidencyRequester1.countryTokenCounts(countryCommitment);

      expect(mintedCount1.toNumber()).to.equal(0);

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: initialPrice
        })
      )
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
      await timeTravelToPastValid();

      const { hash, hashedMailingAddress, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        'secret2',

        primaryLine,
        secondaryLine,
        lastLine,
        country,

        proofOfResidencyOwner.address,
        committer
      );

      expect(await proofOfResidencyRequester1.getCommitmentPeriodIsValid()).to.be.false;

      await expect(
        proofOfResidencyRequester1.commitAddress(
          requester1.address,
          hash,
          hashedMailingAddress,
          v,
          r,
          s
        )
      )
        .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
        .withArgs(requester1.address, committer.address, mailingAddressId, hash);

      // expect the count of mailing address commitments to go up
      expect(await proofOfResidencyRequester1.mailingAddressCounts(mailingAddressId)).to.eq(
        BigNumber.from(2)
      );

      await timeTravelToValid();

      expect(await proofOfResidencyRequester1.getCommitmentPeriodIsValid()).to.be.true;

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, 'secret2', {
          value: initialPrice
        })
      )
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(
          ethers.constants.AddressZero,
          requester1.address,
          ethers.BigNumber.from('444000000000000001')
        );
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail for early minting', async () => {
      // time travel only 3 days
      await timeTravel(3);

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: initialPrice
        })
      ).to.be.revertedWith('Cannot mint yet');
    });

    it('should fail for expired commitment', async () => {
      await timeTravelToPastValid();

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: initialPrice
        })
      ).to.be.revertedWith('Expired');
    });

    it('should fail for incorrect mailing address hash', async () => {
      await timeTravelToValid();

      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment + 1,
        'secret-another',

        primaryLine,
        secondaryLine,
        lastLine,
        country,

        proofOfResidencyOwner.address,
        committer
      );

      const { hashedMailingAddress: badHashedMailingAddress } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        '999 WATER ST',
        secondaryLine,
        lastLine,
        country,

        proofOfResidencyOwner.address,
        committer
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(
          requester1.address,
          hash,
          badHashedMailingAddress,
          v,
          r,
          s
        )
      ).to.be.revertedWith('Signatory non-committer');
    });

    it('should fail for duplicate commitment (already committed to another country)', async () => {
      await timeTravelToValid();

      const { hash, hashedMailingAddress, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment + 1,
        'secret-another',

        primaryLine,
        secondaryLine,
        lastLine,
        country,

        proofOfResidencyOwner.address,
        committer
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(
          requester1.address,
          hash,
          hashedMailingAddress,
          v,
          r,
          s
        )
      ).to.be.revertedWith('Existing commitment');
    });

    it('should fail for public (incorrect secret)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, 'incorrect secret', {
          value: initialPrice
        })
      ).to.be.revertedWith('Commitment incorrec');
    });

    it('should fail for public (incorrect city)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment + 2, secretCommitment, {
          value: initialPrice
        })
      ).to.be.revertedWith('Commitment incorrec');
    });

    it('should fail for public (incorrect value sent)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: initialPrice.sub(ethers.utils.parseEther('0.0001'))
        })
      ).to.be.revertedWith('Incorrect value');
    });
  });
});
