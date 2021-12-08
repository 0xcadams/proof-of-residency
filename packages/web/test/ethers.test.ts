/* global describe, it */
import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig({ path: '../../.env' });

import expect from 'expect.js';
import { commitAddress } from '../src/api/services/ethers';

describe('ethers interactions', () => {
  it('commits an address', async () => {
    const transaction = await commitAddress(
      '0x70997980c51812dc3a017c7d01b50e0d17dc79c8',
      2,
      'some-secret'
    );

    const receipt = await transaction.wait();

    expect(receipt.events?.[0]?.event).to.equal('Commitment');
  });
});
