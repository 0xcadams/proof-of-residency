import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { utils } from 'ethers';
import { HumanDAO, ProofOfResidency__factory as ProofOfResidencyFactory } from '../typechain-types';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Proof of Residency: DAO Example Test', () => {
  let humanDaoRequester1: HumanDAO;
  let humanDaoUnaffiliated: HumanDAO;

  let owner: SignerWithAddress;
  let committer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let requester1: SignerWithAddress;
  let unaffiliated: SignerWithAddress;

  beforeEach(async () => {
    [owner, committer, treasury, requester1, unaffiliated] = await ethers.getSigners();

    const mockProofOfResidency = await waffle.deployMockContract(
      owner,
      ProofOfResidencyFactory.abi
    );

    await mockProofOfResidency.mock.balanceOf
      .withArgs(requester1.address)
      .returns(utils.parseEther('1'));

    await mockProofOfResidency.mock.tokenChallengeExists
      .withArgs(requester1.address)
      .returns(false);

    await mockProofOfResidency.mock.balanceOf
      .withArgs(unaffiliated.address)
      .returns(utils.parseEther('0'));

    await mockProofOfResidency.mock.tokenChallengeExists
      .withArgs(unaffiliated.address)
      .returns(false);

    const HumanDAO = await ethers.getContractFactory('HumanDAO');
    const humanDaoOwner = await HumanDAO.deploy(mockProofOfResidency.address);

    humanDaoRequester1 = humanDaoOwner.connect(requester1);
    humanDaoUnaffiliated = humanDaoOwner.connect(unaffiliated);
  });

  describe('Test HumanDAO functions correctly (happy paths)', async () => {
    it('should succeed to join DAO for a real human', async () => {
      await expect(await humanDaoRequester1.joinDao()).to.be.true;
    });
  });

  describe('Test DAO functions correctly (sad paths)', async () => {
    it('should fail to join DAO for an unverified human', async () => {
      await expect(humanDaoUnaffiliated.joinDao()).to.be.revertedWith('Not allowed!');
    });
  });
});
