import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';
import { BigNumber } from 'ethers';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: permissions', () => {
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
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed for assigning permissions to random person', async () => {
      await proofOfResidencyOwner.addCommitter(unaffiliated.address, unaffiliated.address);

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

      await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment))
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
      await proofOfResidencyOwner.setPrice(initialPrice.add(100));

      expect(await proofOfResidencyUnaffiliated.reservePrice()).to.equal(initialPrice.add(100));
    });

    it('should set base URL for owner', async () => {
      await proofOfResidencyOwner.setBaseURI('somebaseuri/');

      expect(await proofOfResidencyUnaffiliated.contractURI()).to.equal('somebaseuri/contract');
    });

    it('should set treasury for owner', async () => {
      await proofOfResidencyOwner.setProjectTreasury(unaffiliated.address);

      expect(await proofOfResidencyUnaffiliated.projectTreasury()).to.equal(unaffiliated.address);
    });

    it('should remove committer for owner', async () => {
      await expect(proofOfResidencyOwner.removeCommitter(committer.address))
        .to.emit(proofOfResidencyOwner, 'CommitterRemoved')
        .withArgs(committer.address, 0);
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail for public (no committing role)', async () => {
      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        unaffiliated,
        await proofOfResidencyRequester1.nonces(requester1.address)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(
          proofOfResidencyRequester1.address,
          hash,
          v,
          r,
          s,
          {
            value: initialPrice
          }
        )
      ).to.be.revertedWith('Signatory non-committer');
    });

    it('should fail with incorrect nonce', async () => {
      const { hash, v, r, s } = await signCommitment(
        requester1.address,
        countryCommitment,
        secretCommitment,

        proofOfResidencyOwner.address,
        committer,
        BigNumber.from(100)
      );

      await expect(
        proofOfResidencyRequester1.commitAddress(requester1.address, hash, v, r, s, {
          value: initialPrice
        })
      ).to.be.revertedWith('Signatory non-committer');
    });

    it('should fail for public (never committed)', async () => {
      await expect(
        proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)
      ).to.be.revertedWith('Commitment incorrect');
    });

    it('should fail to burn tokens for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.burnTokens([committer.address])).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail to challenge token for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.challenge([committer.address])).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail to remove committer for public (no owner role)', async () => {
      await expect(
        proofOfResidencyRequester1.removeCommitter(committer.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should fail to set treasury for public (no owner role)', async () => {
      await expect(
        proofOfResidencyRequester1.setProjectTreasury(committer.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should fail to set base URL for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.setBaseURI('somebaseuri')).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail to set price for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.setPrice(initialPrice.add(100))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.pause()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail for public (no owner role)', async () => {
      await expect(proofOfResidencyRequester1.unpause()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('should fail for public (no owner role)', async () => {
      await expect(
        proofOfResidencyRequester1.addCommitter(requester1.address, requester1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
