/* global describe, it */
import expect from 'expect.js';
import { generatePublicPrivateKey, recreatePublicPrivateKey } from '../src/api/bip';

describe('BIP Generation', () => {
  it('generates a repeatable bip32 key', async () => {
    const node = await generatePublicPrivateKey('password');
    const recreated = await recreatePublicPrivateKey(node.mnemonic, 'password');

    expect(node.publicKey).to.equal(recreated.publicKey);
  });

  it('generates a different bip32 key with a different password', async () => {
    const node = await generatePublicPrivateKey('password');
    const recreated = await recreatePublicPrivateKey(node.mnemonic, 'password');
    const recreated2 = await recreatePublicPrivateKey(node.mnemonic, 'password2');

    expect(recreated2.publicKey).to.not.equal(recreated.publicKey);
    expect(recreated2.publicKey).to.not.equal(recreated.publicKey);
  });

  it('generates a different bip32 key every time', async () => {
    const node = await generatePublicPrivateKey('password');
    const node2 = await generatePublicPrivateKey('password');

    expect(node.publicKey).to.not.equal(node2.publicKey);
  });
});
