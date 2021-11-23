import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Counter__factory as CounterFactory, Counter } from '../typechain-types';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Counter', () => {
  let counter: Counter;

  beforeEach(async () => {
    // 1
    const signers = await ethers.getSigners();

    // 2
    const counterFactory = (await ethers.getContractFactory(
      'Counter',
      signers[0]
    )) as CounterFactory;
    counter = await counterFactory.deploy();
    await counter.deployed();
    const initialCount = await counter.getCount();

    // 3
    expect(initialCount).to.eq(0);
    expect(counter.address).to.properAddress;
  });

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await counter.countUp();
      const count = await counter.getCount();
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
