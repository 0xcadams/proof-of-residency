import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export type PublicPrivateKey = {
  mnemonic: string;

  publicKey: Buffer;
  privateKey: Buffer;
};

export const generatePublicPrivateKey = async (password: string): Promise<PublicPrivateKey> => {
  const mnemonic = bip39.generateMnemonic();

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic, password);

  const node = bip32.fromSeed(seedBuffer);

  if (!node.privateKey) {
    throw new Error('No private key generated!');
  }

  return {
    mnemonic: mnemonic,
    publicKey: node.publicKey,
    privateKey: node.privateKey
  };
};

export const recreatePublicPrivateKey = async (
  mnemonic: string,
  password: string
): Promise<PublicPrivateKey> => {
  const seedBuffer = await bip39.mnemonicToSeed(mnemonic, password);

  const node = bip32.fromSeed(seedBuffer);

  if (!node.privateKey) {
    throw new Error('No private key generated!');
  }

  return {
    mnemonic: mnemonic,
    publicKey: node.publicKey,
    privateKey: node.privateKey
  };
};
