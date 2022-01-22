import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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

    await expect(proofOfResidencyCommitter.commitAddress(requester1.address, hash))
      .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
      .withArgs(requester1.address, hash);
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for public (happy path)', async () => {
      const mintedCount1 = await proofOfResidencyRequester1.currentCountryCount(countryCommitment);

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

      const mintedCount2 = await proofOfResidencyRequester1.currentCountryCount(countryCommitment);

      expect(mintedCount2.toNumber()).to.equal(1);
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail for duplicate commitment (already committed to another city)', async () => {
      const hash2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'string'],
          [requester1.address, countryCommitment + 1, 'secret-another']
        )
      );

      await expect(
        proofOfResidencyCommitter.commitAddress(requester1.address, hash2)
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
