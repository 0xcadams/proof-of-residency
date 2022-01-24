export type AddressComponents = {
  primaryLine: string;
  secondaryLine: string;
  lastLine: string;
  country: string;
};

export type SubmitAddressPasswordPayload = {
  hashedPassword: string;
};

export type SubmitAddressRequest = {
  passwordPayload: SubmitAddressPasswordPayload;
  passwordSignature: string;

  addressPayload: AddressComponents;
  addressSignature: string;

  name: string;

  latitude: number;
  longitude: number;
};

export type SubmitAddressResponse = {
  v: number;
  r: string;
  s: string;

  country: string;
  commitment: string;
  hashedMailingAddress: string;
};
