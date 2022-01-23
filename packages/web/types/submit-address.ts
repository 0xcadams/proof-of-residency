export type AddressComponents = {
  primaryLine: string;
  secondaryLine: string;
  lastLine: string;
  country: string;
};

export type SubmitAddressPayload = {
  address: AddressComponents;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  hashedPassword: string;
};

export type SubmitAddressRequest = {
  payload: SubmitAddressPayload;
  signature: string;

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
};
