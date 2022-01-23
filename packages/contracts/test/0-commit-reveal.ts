import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravel, timeTravelToPastValid, timeTravelToValid } from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Proof of Residency: commit/reveal scheme', () => {
  const secretCommitment = 'secret1';
  const countryCommitment = 444;
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

    await expect(proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s))
      .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
      .withArgs(requester1.address, committer.address, hash);
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for public', async () => {
      await timeTravelToValid();

      const mintedCount1 = await proofOfResidencyRequester1.getCurrentCountryCount(
        countryCommitment
      );

      expect(mintedCount1.toNumber()).to.equal(0);

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value
        })
      )
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(
          ethers.constants.AddressZero,
          requester1.address,
          ethers.BigNumber.from('444000000000000001')
        );

      const mintedCount2 = await proofOfResidencyRequester1.getCurrentCountryCount(
        countryCommitment
      );

      expect(mintedCount2.toNumber()).to.equal(1);
    });

    it('should succeed to recommit + mint after first commitment expires', async () => {
      await timeTravelToPastValid();

      const hash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment, 'secret2']
        )
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash,
        committer
      );

      await expect(proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s))
        .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
        .withArgs(requester1.address, committer.address, hash);

      const lastBlock = await ethers.provider.getBlock(ethers.provider.getBlockNumber());

      const oneWeekInSeconds = 7 * 24 * 60 * 60;

      // within 5 seconds of the expected 1 week validAt
      expect(await proofOfResidencyRequester1.getCommitmentValidAt()).to.be.closeTo(
        ethers.BigNumber.from(lastBlock.timestamp + oneWeekInSeconds),
        5000
      );

      await timeTravelToValid();

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, 'secret2', {
          value: value
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
          value: value
        })
      ).to.be.revertedWith('Cannot mint yet');
    });

    it('should fail for expired commitment', async () => {
      await timeTravelToPastValid();

      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment expired');
    });

    it('should fail for duplicate commitment (already committed to another country)', async () => {
      await timeTravelToValid();

      const hash2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment + 1, 'secret-another']
        )
      );

      const { v, r, s } = await signCommitment(
        proofOfResidencyOwner.address,
        requester1.address,
        hash2,
        committer
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash2, v, r, s)
      ).to.be.revertedWith('Address has existing commitment');
    });

    it('should fail for public (incorrect secret)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, 'incorrect secret', {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect');
    });

    it('should fail for public (incorrect city)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment + 2, secretCommitment, {
          value: value
        })
      ).to.be.revertedWith('Commitment is incorrect');
    });

    it('should fail for public (incorrect value sent)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
          value: value.sub(ethers.utils.parseEther('0.0001'))
        })
      ).to.be.revertedWith('Incorrect ETH sent');
    });
  });
});
