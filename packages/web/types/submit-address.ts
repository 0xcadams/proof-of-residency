export type SubmitAddressPayload = {
  walletAddress: string;
};

export type SubmitAddressRequest = {
  payload: SubmitAddressPayload;
  signature: string;

  lobAddressId: string;

  latitude: number;
  longitude: number;
};

export type SubmitAddressResponse = {
  v: number;
  r: string;
  s: string;

  country: string;
};
