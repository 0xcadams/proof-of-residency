import { ProofOfResidencyNetwork } from 'src/contracts';
import { TokenFieldsFragment } from './subgraph';

export type GetTokensForOwnerResponse = (TokenFieldsFragment & {
  chain: ProofOfResidencyNetwork;
})[];

export type GetAllTokensResponse = {
  chain: ProofOfResidencyNetwork;
  id: string;
  country: number;
}[];
