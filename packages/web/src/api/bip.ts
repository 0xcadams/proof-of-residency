import * as bip39 from 'bip39';
import { HDNode } from '@ethersproject/hdnode';

export type PublicPrivateKey = {
  mnemonic: string;

  publicKey: string;
};

export const generatePublicPrivateKey = async (password: string): Promise<PublicPrivateKey> => {
  const mnemonic: string = bip39.generateMnemonic();

  return recreatePublicPrivateKey(mnemonic, password);
};

export const recreatePublicPrivateKey = async (
  mnemonic: string,
  password: string
): Promise<PublicPrivateKey> => {
  const node = HDNode.fromMnemonic(mnemonic, password);

  if (!node.publicKey) {
    throw new Error('No private key generated!');
  }

  return {
    mnemonic: mnemonic,
    publicKey: node.publicKey
  };
};
