import { BigNumber } from 'ethers';
import { VerifyIntlAddressResponse, VerifyUsAddressResponse } from './verify-address';

export type AddressComponents = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city?: string;
  state?: string;
  postal?: string;
  country: string;

  deliverability:
    | VerifyUsAddressResponse['deliverability']
    | VerifyIntlAddressResponse['deliverability'];

  nonce: BigNumber;
};

export type SubmitAddressPasswordPayload = {
  hashedPassword: string;
  walletAddress: string;
  nonce: BigNumber;
};

export type SubmitAddressRequest = {
  passwordPayload: SubmitAddressPasswordPayload;
  passwordSignature: string;

  addressPayload: AddressComponents;
  addressSignature: string;
};

export type SubmitAddressResponse = {
  v: number;
  r: string;
  s: string;

  country: string;
  commitment: string;

  expectedDeliveryDateFormatted: string;
  expectedDaysUntilDelivery: number;
};
