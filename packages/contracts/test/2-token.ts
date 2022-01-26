import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ProofOfResidency } from '../../web/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { signCommitment, timeTravelToValid } from './util';
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
const countryCommitment = 411;
const initialPrice = ethers.utils.parseEther('0.008');
const tokenId = ethers.BigNumber.from('411000000000000001');

describe('Proof of Residency: token', () => {
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

    await proofOfResidencyCommitter.commitAddress(
      requester1.address,
      hash,
      hashedMailingAddress,
      v,
      r,
      s,
      {
        value: initialPrice
      }
    );

    await timeTravelToValid();

    await expect(proofOfResidencyRequester1.mint(countryCommitment, secretCommitment)).to.emit(
      proofOfResidencyRequester1,
      'Transfer'
    );
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
      ).to.be.revertedWith('ERC721NonTransferable: transferFrom not allowed');
    });

    it('should fail to safe transfer token to another address', async () => {
      await expect(
        proofOfResidencyRequester1['safeTransferFrom(address,address,uint256)'](
          requester1.address,
          unaffiliated.address,
          tokenId
        )
      ).to.be.revertedWith('ERC721NonTransferable: safeTransferFrom not allowed');
    });

    it('should fail to safe transfer token to another address', async () => {
      await expect(
        proofOfResidencyRequester1['safeTransferFrom(address,address,uint256,bytes)'](
          requester1.address,
          unaffiliated.address,
          tokenId,
          ethers.utils.randomBytes(4)
        )
      ).to.be.revertedWith('ERC721NonTransferable: safeTransferFrom not allowed');
    });
  });
});
