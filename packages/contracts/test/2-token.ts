import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Proof of Residency: token', () => {
  const secretCommitment = 'secret1';
  const countryCommitment = 411;
  const value = ethers.utils.parseEther('0.008');
  const tokenId = ethers.BigNumber.from('411000000000000001');

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

    await expect(proofOfResidencyCommitter.commitAddress(requester1.address, hash, v, r, s))
      .to.emit(proofOfResidencyCommitter, 'CommitmentCreated')
      .withArgs(requester1.address, committer.address, hash);

    await timeTravelToValid();

    await expect(
      proofOfResidencyRequester1.mint(countryCommitment, secretCommitment, {
        value: value
      })
    ).to.emit(proofOfResidencyRequester1, 'Transfer');
  });

  describe('PoR functions correctly (happy paths)', async () => {
    it('should succeed to burn token', async () => {
      await expect(proofOfResidencyRequester1.burn(tokenId))
        .to.emit(proofOfResidencyRequester1, 'Transfer')
        .withArgs(requester1.address, ethers.constants.AddressZero, tokenId);
    });
  });

  describe('PoR functions correctly (sad paths)', async () => {
    it('should fail to transfer token to another address', async () => {
      await expect(
        proofOfResidencyRequester1.transferFrom(requester1.address, unaffiliated.address, tokenId)
      ).to.be.revertedWith('ERC721ReadOnly: transferFrom not allowed');
    });

    it('should fail to safe transfer token to another address', async () => {
      await expect(
        proofOfResidencyRequester1['safeTransferFrom(address,address,uint256)'](
          requester1.address,
          unaffiliated.address,
          tokenId
        )
      ).to.be.revertedWith('ERC721ReadOnly: safeTransferFrom not allowed');
    });

    it('should fail to safe transfer token to another address', async () => {
      await expect(
        proofOfResidencyRequester1['safeTransferFrom(address,address,uint256,bytes)'](
          requester1.address,
          unaffiliated.address,
          tokenId,
          ethers.utils.randomBytes(4)
        )
      ).to.be.revertedWith('ERC721ReadOnly: safeTransferFrom not allowed');
    });
  });
});
