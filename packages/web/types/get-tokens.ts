import { TokenFieldsFragment } from './subgraph';

export type GetTokensForOwnerResponse = {
  l1: TokenFieldsFragment[] | null;
  arbitrum: TokenFieldsFragment[] | null;
  optimism: TokenFieldsFragment[] | null;
  polygon: TokenFieldsFragment[] | null;
};

export type GetAllTokensResponse = {
  chain: number;
  id: string;
}[];
