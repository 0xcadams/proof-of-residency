/* global describe, it */
import expect from 'expect.js';
import { generatePublicPrivateKey, recreatePublicPrivateKey } from '../src/api/services/bip';

describe('BIP Generation', () => {
  it('generates a repeatable bip32 key', async () => {
    const node = await generatePublicPrivateKey('password');
    const recreated = await recreatePublicPrivateKey(node.mnemonic, 'password');

    expect(node.publicKey.toString('hex')).to.equal(recreated.publicKey.toString('hex'));
    expect(node.privateKey.toString('hex')).to.equal(recreated.privateKey.toString('hex'));
  });

  it('generates a different bip32 key with a different password', async () => {
    const node = await generatePublicPrivateKey('password');
    const recreated = await recreatePublicPrivateKey(node.mnemonic, 'password');
    const recreated2 = await recreatePublicPrivateKey(node.mnemonic, 'password2');

    expect(recreated2.privateKey.toString('hex')).to.not.equal(
      recreated.privateKey.toString('hex')
    );
    expect(recreated2.privateKey.toString('hex')).to.not.equal(
      recreated.privateKey.toString('hex')
    );
  });

  it('generates a different bip32 key every time', async () => {
    const node = await generatePublicPrivateKey('password');
    const node2 = await generatePublicPrivateKey('password');

    expect(node.publicKey.toString('hex')).to.not.equal(node2.publicKey.toString('hex'));
    expect(node.privateKey.toString('hex')).to.not.equal(node2.privateKey.toString('hex'));
  });
});
