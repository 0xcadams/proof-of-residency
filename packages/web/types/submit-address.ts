export type SubmitAddressPayload = {
  walletAddress: string;
};

export type SubmitAddressRequest = {
  payload: SubmitAddressPayload;
  signature: string;

  lobAddressId: string;

  latitude: number;
  longitude: number;

  name: string;

  primaryLine: string;
  secondaryLine: string;
  city: string;
  state: string;
};

export type SubmitAddressResponse = {
  city: string;
};
