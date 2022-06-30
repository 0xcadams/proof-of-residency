export type GetTokensForOwnerResponse = {
  l1: string;
  arbitrum: string;
  optimism: string;
  polygon: string;
};

export type GetAllTokensResponse = {
  chain: number;
  id: string;
}[];
