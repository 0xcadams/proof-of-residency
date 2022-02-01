import { BigNumber } from 'ethers';

export type AddressComponents = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city?: string;
  state?: string;
  postal?: string;
  country: string;

  nonce: BigNumber;
};

export type SubmitAddressPasswordPayload = {
  hashedPassword: string;
  nonce: BigNumber;
};

export type SubmitAddressRequest = {
  passwordPayload: SubmitAddressPasswordPayload;
  passwordSignature: string;

  addressPayload: AddressComponents;
  addressSignature: string;

  latitude: number;
  longitude: number;
};

export type SubmitAddressResponse = {
  v: number;
  r: string;
  s: string;

  country: string;
  commitment: string;
};
