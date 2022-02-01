import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: token challenges', () => {
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
    //
  });

  describe('PoR functions correctly (sad paths)', async () => {
    //
  });
});
