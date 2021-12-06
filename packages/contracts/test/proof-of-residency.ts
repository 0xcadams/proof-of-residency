import { ethers, network } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  ProofOfResidency__factory as ProofOfResidencyFactory,
  ProofOfResidency
} from '../../web/typechain-types';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('ProofOfResidency', () => {
  let proofOfResidency: ProofOfResidency;

  beforeEach(async () => {
    // 1
    const signers = await ethers.getSigners();

    // 2
    const proofOfResidencyFactory = (await ethers.getContractFactory(
      'ProofOfResidency',
      signers[0]
    )) as ProofOfResidencyFactory;
    proofOfResidency = await proofOfResidencyFactory.deploy();
    await proofOfResidency.deployed();
    const initialCount = await proofOfResidency.getCount();

    // 3
    expect(initialCount).to.eq(0);
    expect(proofOfResidency.address).to.properAddress;
  });

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await proofOfResidency.safeMint();
      const count = await proofOfResidency.getCount();
      expect(count).to.eq(1);
    });
  });

  describe('count down', async () => {
    // 5
    it('should fail due to underflow exception', () => {
      return expect(counter.countDown()).to.eventually.be.rejectedWith(Error);
    });

    it('should count down', async () => {
      await counter.countUp();

      await counter.countDown();
      const count = await counter.getCount();
      expect(count).to.eq(0);
    });
  });
});
