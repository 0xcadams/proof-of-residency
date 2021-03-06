import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

const baseUri = 'https://generator.proofofresidency.xyz/';

const secretCommitment = 'secret1';
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');

describe('Proof of Residency: edge cases', () => {
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

  describe('PORP functions correctly (happy paths)', async () => {
    it('should initialize token uri', async () => {
      await timeTravelToValid();

      await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)).to.emit(
        proofOfResidencyRequester1,
        'Transfer'
      );

      const tokenUri = await proofOfResidencyUnaffiliated.tokenURI(
        ethers.BigNumber.from('444000000000000001')
      );

      expect(tokenUri)
        .to.contain('https://generator.proofofresidency.xyz')
        .and.to.contain('/444000000000000001');
    });

    it('should initialize contract metadata uri', async () => {
      const contractURI = await proofOfResidencyUnaffiliated.contractURI();

      expect(contractURI)
        .to.contain('https://generator.proofofresidency.xyz')
        .and.to.contain('/contract');
    });

    it('should support erc721 interface ID', async () => {
      const supportsErc721 = await proofOfResidencyUnaffiliated.supportsInterface('0x80ac58cd');

      expect(supportsErc721).to.be.true;
    });
  });
});
