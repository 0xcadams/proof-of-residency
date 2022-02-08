import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency, SomeDAOTest } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 2;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: dao dependency', () => {
  let proofOfResidencyOwner: ProofOfResidency;

  let someDaoRequester1: SomeDAOTest;
  let someDaoUnaffiliated: SomeDAOTest;

  let owner: SignerWithAddress;
  let committer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let requester1: SignerWithAddress;
  let unaffiliated: SignerWithAddress;

  beforeEach(async () => {
    [owner, committer, treasury, requester1, unaffiliated] = await ethers.getSigners();

    const ProofOfResidency = await ethers.getContractFactory('ProofOfResidency');
    proofOfResidencyOwner = await ProofOfResidency.deploy(
      committer.address,
      treasury.address,
      baseUri,
      initialPrice
    );

    const proofOfResidencyCommitter = proofOfResidencyOwner.connect(committer);
    const proofOfResidencyRequester1 = proofOfResidencyOwner.connect(requester1);

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

    const SomeDAOTest = await ethers.getContractFactory('SomeDAOTest');
    const someDaoOwner = await SomeDAOTest.deploy(proofOfResidencyOwner.address);

    someDaoRequester1 = someDaoOwner.connect(requester1);
    someDaoUnaffiliated = someDaoOwner.connect(unaffiliated);
  });

  describe('Test DAO functions correctly (happy paths)', async () => {
    it('should succeed to join DAO for a real human', async () => {
      await expect(await someDaoRequester1.joinDao()).to.be.true;
    });
  });

  describe('Test DAO functions correctly (sad paths)', async () => {
    it('should fail to join DAO for an unverified human', async () => {
      await expect(someDaoUnaffiliated.joinDao()).to.be.revertedWith('Not allowed!');
    });

    it('should fail to join DAO for a human who is pending a challenge', async () => {
      await proofOfResidencyOwner.challenge([requester1.address]);

      await expect(someDaoRequester1.joinDao()).to.be.revertedWith('Not allowed!');
    });
  });
});
