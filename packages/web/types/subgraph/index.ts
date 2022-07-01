import { BigNumber } from 'ethers';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: BigNumber;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash: InputMaybe<Scalars['Bytes']>;
  number: InputMaybe<Scalars['Int']>;
  number_gte: InputMaybe<Scalars['Int']>;
};

export type Commitment = {
  __typename: 'Commitment';
  committer: Committer;
  contribution: Contribution;
  id: Scalars['ID'];
  requester: Requester;
};

export type Commitment_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  committer: InputMaybe<Scalars['String']>;
  committer_: InputMaybe<Committer_Filter>;
  committer_contains: InputMaybe<Scalars['String']>;
  committer_contains_nocase: InputMaybe<Scalars['String']>;
  committer_ends_with: InputMaybe<Scalars['String']>;
  committer_ends_with_nocase: InputMaybe<Scalars['String']>;
  committer_gt: InputMaybe<Scalars['String']>;
  committer_gte: InputMaybe<Scalars['String']>;
  committer_in: InputMaybe<Array<Scalars['String']>>;
  committer_lt: InputMaybe<Scalars['String']>;
  committer_lte: InputMaybe<Scalars['String']>;
  committer_not: InputMaybe<Scalars['String']>;
  committer_not_contains: InputMaybe<Scalars['String']>;
  committer_not_contains_nocase: InputMaybe<Scalars['String']>;
  committer_not_ends_with: InputMaybe<Scalars['String']>;
  committer_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  committer_not_in: InputMaybe<Array<Scalars['String']>>;
  committer_not_starts_with: InputMaybe<Scalars['String']>;
  committer_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  committer_starts_with: InputMaybe<Scalars['String']>;
  committer_starts_with_nocase: InputMaybe<Scalars['String']>;
  contribution: InputMaybe<Scalars['String']>;
  contribution_: InputMaybe<Contribution_Filter>;
  contribution_contains: InputMaybe<Scalars['String']>;
  contribution_contains_nocase: InputMaybe<Scalars['String']>;
  contribution_ends_with: InputMaybe<Scalars['String']>;
  contribution_ends_with_nocase: InputMaybe<Scalars['String']>;
  contribution_gt: InputMaybe<Scalars['String']>;
  contribution_gte: InputMaybe<Scalars['String']>;
  contribution_in: InputMaybe<Array<Scalars['String']>>;
  contribution_lt: InputMaybe<Scalars['String']>;
  contribution_lte: InputMaybe<Scalars['String']>;
  contribution_not: InputMaybe<Scalars['String']>;
  contribution_not_contains: InputMaybe<Scalars['String']>;
  contribution_not_contains_nocase: InputMaybe<Scalars['String']>;
  contribution_not_ends_with: InputMaybe<Scalars['String']>;
  contribution_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  contribution_not_in: InputMaybe<Array<Scalars['String']>>;
  contribution_not_starts_with: InputMaybe<Scalars['String']>;
  contribution_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  contribution_starts_with: InputMaybe<Scalars['String']>;
  contribution_starts_with_nocase: InputMaybe<Scalars['String']>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  requester: InputMaybe<Scalars['String']>;
  requester_: InputMaybe<Requester_Filter>;
  requester_contains: InputMaybe<Scalars['String']>;
  requester_contains_nocase: InputMaybe<Scalars['String']>;
  requester_ends_with: InputMaybe<Scalars['String']>;
  requester_ends_with_nocase: InputMaybe<Scalars['String']>;
  requester_gt: InputMaybe<Scalars['String']>;
  requester_gte: InputMaybe<Scalars['String']>;
  requester_in: InputMaybe<Array<Scalars['String']>>;
  requester_lt: InputMaybe<Scalars['String']>;
  requester_lte: InputMaybe<Scalars['String']>;
  requester_not: InputMaybe<Scalars['String']>;
  requester_not_contains: InputMaybe<Scalars['String']>;
  requester_not_contains_nocase: InputMaybe<Scalars['String']>;
  requester_not_ends_with: InputMaybe<Scalars['String']>;
  requester_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  requester_not_in: InputMaybe<Array<Scalars['String']>>;
  requester_not_starts_with: InputMaybe<Scalars['String']>;
  requester_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  requester_starts_with: InputMaybe<Scalars['String']>;
  requester_starts_with_nocase: InputMaybe<Scalars['String']>;
};

export enum Commitment_OrderBy {
  Committer = 'committer',
  Contribution = 'contribution',
  Id = 'id',
  Requester = 'requester'
}

export type Committer = {
  __typename: 'Committer';
  commitments: Array<Commitment>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  removedAt: Scalars['BigInt'];
};

export type CommitterCommitmentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Commitment_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<Commitment_Filter>;
};

export type Committer_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  commitments_: InputMaybe<Commitment_Filter>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  isActive: InputMaybe<Scalars['Boolean']>;
  isActive_in: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not: InputMaybe<Scalars['Boolean']>;
  isActive_not_in: InputMaybe<Array<Scalars['Boolean']>>;
  removedAt: InputMaybe<Scalars['BigInt']>;
  removedAt_gt: InputMaybe<Scalars['BigInt']>;
  removedAt_gte: InputMaybe<Scalars['BigInt']>;
  removedAt_in: InputMaybe<Array<Scalars['BigInt']>>;
  removedAt_lt: InputMaybe<Scalars['BigInt']>;
  removedAt_lte: InputMaybe<Scalars['BigInt']>;
  removedAt_not: InputMaybe<Scalars['BigInt']>;
  removedAt_not_in: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Committer_OrderBy {
  Commitments = 'commitments',
  Id = 'id',
  IsActive = 'isActive',
  RemovedAt = 'removedAt'
}

export type Contribution = {
  __typename: 'Contribution';
  id: Scalars['ID'];
  value: Scalars['BigInt'];
};

export type Contribution_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  value: InputMaybe<Scalars['BigInt']>;
  value_gt: InputMaybe<Scalars['BigInt']>;
  value_gte: InputMaybe<Scalars['BigInt']>;
  value_in: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt: InputMaybe<Scalars['BigInt']>;
  value_lte: InputMaybe<Scalars['BigInt']>;
  value_not: InputMaybe<Scalars['BigInt']>;
  value_not_in: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Contribution_OrderBy {
  Id = 'id',
  Value = 'value'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename: 'Query';
  /** Access to subgraph metadata */
  _meta: Maybe<_Meta_>;
  commitment: Maybe<Commitment>;
  commitments: Array<Commitment>;
  committer: Maybe<Committer>;
  committers: Array<Committer>;
  contribution: Maybe<Contribution>;
  contributions: Array<Contribution>;
  requester: Maybe<Requester>;
  requesters: Array<Requester>;
  token: Maybe<Token>;
  tokenChallenge: Maybe<TokenChallenge>;
  tokenChallenges: Array<TokenChallenge>;
  tokens: Array<Token>;
};

export type Query_MetaArgs = {
  block: InputMaybe<Block_Height>;
};

export type QueryCommitmentArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCommitmentsArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Commitment_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Commitment_Filter>;
};

export type QueryCommitterArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCommittersArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Committer_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Committer_Filter>;
};

export type QueryContributionArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryContributionsArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Contribution_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Contribution_Filter>;
};

export type QueryRequesterArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRequestersArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Requester_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Requester_Filter>;
};

export type QueryTokenArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenChallengeArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenChallengesArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<TokenChallenge_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<TokenChallenge_Filter>;
};

export type QueryTokensArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Token_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Token_Filter>;
};

export type Requester = {
  __typename: 'Requester';
  commitments: Array<Commitment>;
  id: Scalars['ID'];
  tokenChallenge: Array<TokenChallenge>;
  tokens: Array<Token>;
};

export type RequesterCommitmentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Commitment_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<Commitment_Filter>;
};

export type RequesterTokenChallengeArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<TokenChallenge_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<TokenChallenge_Filter>;
};

export type RequesterTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Token_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<Token_Filter>;
};

export type Requester_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  commitments_: InputMaybe<Commitment_Filter>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  tokenChallenge_: InputMaybe<TokenChallenge_Filter>;
  tokens_: InputMaybe<Token_Filter>;
};

export enum Requester_OrderBy {
  Commitments = 'commitments',
  Id = 'id',
  TokenChallenge = 'tokenChallenge',
  Tokens = 'tokens'
}

export type Subscription = {
  __typename: 'Subscription';
  /** Access to subgraph metadata */
  _meta: Maybe<_Meta_>;
  commitment: Maybe<Commitment>;
  commitments: Array<Commitment>;
  committer: Maybe<Committer>;
  committers: Array<Committer>;
  contribution: Maybe<Contribution>;
  contributions: Array<Contribution>;
  requester: Maybe<Requester>;
  requesters: Array<Requester>;
  token: Maybe<Token>;
  tokenChallenge: Maybe<TokenChallenge>;
  tokenChallenges: Array<TokenChallenge>;
  tokens: Array<Token>;
};

export type Subscription_MetaArgs = {
  block: InputMaybe<Block_Height>;
};

export type SubscriptionCommitmentArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCommitmentsArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Commitment_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Commitment_Filter>;
};

export type SubscriptionCommitterArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCommittersArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Committer_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Committer_Filter>;
};

export type SubscriptionContributionArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionContributionsArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Contribution_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Contribution_Filter>;
};

export type SubscriptionRequesterArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRequestersArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Requester_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Requester_Filter>;
};

export type SubscriptionTokenArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenChallengeArgs = {
  block: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenChallengesArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<TokenChallenge_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<TokenChallenge_Filter>;
};

export type SubscriptionTokensArgs = {
  block: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Token_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where: InputMaybe<Token_Filter>;
};

export type Token = {
  __typename: 'Token';
  country: Scalars['BigInt'];
  id: Scalars['ID'];
  mintTime: Scalars['BigInt'];
  owner: Requester;
  tokenURI: Scalars['String'];
};

export type TokenChallenge = {
  __typename: 'TokenChallenge';
  id: Scalars['ID'];
  owner: Requester;
  token: Token;
};

export type TokenChallenge_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  owner: InputMaybe<Scalars['String']>;
  owner_: InputMaybe<Requester_Filter>;
  owner_contains: InputMaybe<Scalars['String']>;
  owner_contains_nocase: InputMaybe<Scalars['String']>;
  owner_ends_with: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase: InputMaybe<Scalars['String']>;
  owner_gt: InputMaybe<Scalars['String']>;
  owner_gte: InputMaybe<Scalars['String']>;
  owner_in: InputMaybe<Array<Scalars['String']>>;
  owner_lt: InputMaybe<Scalars['String']>;
  owner_lte: InputMaybe<Scalars['String']>;
  owner_not: InputMaybe<Scalars['String']>;
  owner_not_contains: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase: InputMaybe<Scalars['String']>;
  owner_not_ends_with: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  owner_not_in: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  owner_starts_with: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase: InputMaybe<Scalars['String']>;
  token: InputMaybe<Scalars['String']>;
  token_: InputMaybe<Token_Filter>;
  token_contains: InputMaybe<Scalars['String']>;
  token_contains_nocase: InputMaybe<Scalars['String']>;
  token_ends_with: InputMaybe<Scalars['String']>;
  token_ends_with_nocase: InputMaybe<Scalars['String']>;
  token_gt: InputMaybe<Scalars['String']>;
  token_gte: InputMaybe<Scalars['String']>;
  token_in: InputMaybe<Array<Scalars['String']>>;
  token_lt: InputMaybe<Scalars['String']>;
  token_lte: InputMaybe<Scalars['String']>;
  token_not: InputMaybe<Scalars['String']>;
  token_not_contains: InputMaybe<Scalars['String']>;
  token_not_contains_nocase: InputMaybe<Scalars['String']>;
  token_not_ends_with: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  token_not_in: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  token_starts_with: InputMaybe<Scalars['String']>;
  token_starts_with_nocase: InputMaybe<Scalars['String']>;
};

export enum TokenChallenge_OrderBy {
  Id = 'id',
  Owner = 'owner',
  Token = 'token'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block: InputMaybe<BlockChangedFilter>;
  country: InputMaybe<Scalars['BigInt']>;
  country_gt: InputMaybe<Scalars['BigInt']>;
  country_gte: InputMaybe<Scalars['BigInt']>;
  country_in: InputMaybe<Array<Scalars['BigInt']>>;
  country_lt: InputMaybe<Scalars['BigInt']>;
  country_lte: InputMaybe<Scalars['BigInt']>;
  country_not: InputMaybe<Scalars['BigInt']>;
  country_not_in: InputMaybe<Array<Scalars['BigInt']>>;
  id: InputMaybe<Scalars['ID']>;
  id_gt: InputMaybe<Scalars['ID']>;
  id_gte: InputMaybe<Scalars['ID']>;
  id_in: InputMaybe<Array<Scalars['ID']>>;
  id_lt: InputMaybe<Scalars['ID']>;
  id_lte: InputMaybe<Scalars['ID']>;
  id_not: InputMaybe<Scalars['ID']>;
  id_not_in: InputMaybe<Array<Scalars['ID']>>;
  mintTime: InputMaybe<Scalars['BigInt']>;
  mintTime_gt: InputMaybe<Scalars['BigInt']>;
  mintTime_gte: InputMaybe<Scalars['BigInt']>;
  mintTime_in: InputMaybe<Array<Scalars['BigInt']>>;
  mintTime_lt: InputMaybe<Scalars['BigInt']>;
  mintTime_lte: InputMaybe<Scalars['BigInt']>;
  mintTime_not: InputMaybe<Scalars['BigInt']>;
  mintTime_not_in: InputMaybe<Array<Scalars['BigInt']>>;
  owner: InputMaybe<Scalars['String']>;
  owner_: InputMaybe<Requester_Filter>;
  owner_contains: InputMaybe<Scalars['String']>;
  owner_contains_nocase: InputMaybe<Scalars['String']>;
  owner_ends_with: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase: InputMaybe<Scalars['String']>;
  owner_gt: InputMaybe<Scalars['String']>;
  owner_gte: InputMaybe<Scalars['String']>;
  owner_in: InputMaybe<Array<Scalars['String']>>;
  owner_lt: InputMaybe<Scalars['String']>;
  owner_lte: InputMaybe<Scalars['String']>;
  owner_not: InputMaybe<Scalars['String']>;
  owner_not_contains: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase: InputMaybe<Scalars['String']>;
  owner_not_ends_with: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  owner_not_in: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  owner_starts_with: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase: InputMaybe<Scalars['String']>;
  tokenURI: InputMaybe<Scalars['String']>;
  tokenURI_contains: InputMaybe<Scalars['String']>;
  tokenURI_contains_nocase: InputMaybe<Scalars['String']>;
  tokenURI_ends_with: InputMaybe<Scalars['String']>;
  tokenURI_ends_with_nocase: InputMaybe<Scalars['String']>;
  tokenURI_gt: InputMaybe<Scalars['String']>;
  tokenURI_gte: InputMaybe<Scalars['String']>;
  tokenURI_in: InputMaybe<Array<Scalars['String']>>;
  tokenURI_lt: InputMaybe<Scalars['String']>;
  tokenURI_lte: InputMaybe<Scalars['String']>;
  tokenURI_not: InputMaybe<Scalars['String']>;
  tokenURI_not_contains: InputMaybe<Scalars['String']>;
  tokenURI_not_contains_nocase: InputMaybe<Scalars['String']>;
  tokenURI_not_ends_with: InputMaybe<Scalars['String']>;
  tokenURI_not_ends_with_nocase: InputMaybe<Scalars['String']>;
  tokenURI_not_in: InputMaybe<Array<Scalars['String']>>;
  tokenURI_not_starts_with: InputMaybe<Scalars['String']>;
  tokenURI_not_starts_with_nocase: InputMaybe<Scalars['String']>;
  tokenURI_starts_with: InputMaybe<Scalars['String']>;
  tokenURI_starts_with_nocase: InputMaybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Country = 'country',
  Id = 'id',
  MintTime = 'mintTime',
  Owner = 'owner',
  TokenUri = 'tokenURI'
}

export type _Block_ = {
  __typename: '_Block_';
  /** The hash of the block */
  hash: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetCommittersQueryVariables = Exact<{
  first: InputMaybe<Scalars['Int']>;
}>;

export type GetCommittersQuery = {
  __typename: 'Query';
  committers: Array<{
    __typename: 'Committer';
    id: string;
    isActive: boolean;
    removedAt: BigNumber;
    commitments: Array<{
      __typename: 'Commitment';
      id: string;
      contribution: { __typename: 'Contribution'; id: string; value: BigNumber };
    }>;
  }>;
};

export type GetRequesterByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetRequesterByIdQuery = {
  __typename: 'Query';
  requester: {
    __typename: 'Requester';
    id: string;
    commitments: Array<{
      __typename: 'Commitment';
      id: string;
      contribution: { __typename: 'Contribution'; id: string; value: BigNumber };
    }>;
    tokens: Array<{
      __typename: 'Token';
      id: string;
      mintTime: BigNumber;
      tokenURI: string;
      country: BigNumber;
    }>;
    tokenChallenge: Array<{ __typename: 'TokenChallenge'; id: string }>;
  } | null;
};

export type GetTokenByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetTokenByIdQuery = {
  __typename: 'Query';
  token: {
    __typename: 'Token';
    id: string;
    mintTime: BigNumber;
    tokenURI: string;
    country: BigNumber;
    owner: { __typename: 'Requester'; id: string };
  } | null;
};

export type GetAllTokensQueryVariables = Exact<{
  first: InputMaybe<Scalars['Int']>;
  skip: InputMaybe<Scalars['Int']>;
}>;

export type GetAllTokensQuery = {
  __typename: 'Query';
  tokens: Array<{
    __typename: 'Token';
    id: string;
    mintTime: BigNumber;
    tokenURI: string;
    country: BigNumber;
  }>;
};

export type GetTokensByCountryQueryVariables = Exact<{
  country: Scalars['BigInt'];
}>;

export type GetTokensByCountryQuery = {
  __typename: 'Query';
  tokens: Array<{
    __typename: 'Token';
    id: string;
    mintTime: BigNumber;
    tokenURI: string;
    country: BigNumber;
  }>;
};

export type CommitmentFieldsFragment = {
  __typename: 'Commitment';
  id: string;
  contribution: { __typename: 'Contribution'; id: string; value: BigNumber };
};

export type RequesterFieldsFragment = { __typename: 'Requester'; id: string };

export type TokenFieldsFragment = {
  __typename: 'Token';
  id: string;
  mintTime: BigNumber;
  tokenURI: string;
  country: BigNumber;
};

export const CommitmentFieldsFragmentDoc = gql`
  fragment CommitmentFields on Commitment {
    id
    contribution {
      id
      value
    }
  }
`;
export const RequesterFieldsFragmentDoc = gql`
  fragment RequesterFields on Requester {
    id
  }
`;
export const TokenFieldsFragmentDoc = gql`
  fragment TokenFields on Token {
    id
    mintTime
    tokenURI
    country
  }
`;
export const GetCommittersDocument = gql`
  query GetCommitters($first: Int) {
    committers(first: $first) {
      id
      isActive
      removedAt
      commitments {
        ...CommitmentFields
      }
    }
  }
  ${CommitmentFieldsFragmentDoc}
`;
export type GetCommittersQueryResult = Apollo.QueryResult<
  GetCommittersQuery,
  GetCommittersQueryVariables
>;
export const GetRequesterByIdDocument = gql`
  query GetRequesterById($id: ID!) {
    requester(id: $id) {
      id
      commitments {
        ...CommitmentFields
      }
      tokens {
        ...TokenFields
      }
      tokenChallenge {
        id
      }
    }
  }
  ${CommitmentFieldsFragmentDoc}
  ${TokenFieldsFragmentDoc}
`;
export type GetRequesterByIdQueryResult = Apollo.QueryResult<
  GetRequesterByIdQuery,
  GetRequesterByIdQueryVariables
>;
export const GetTokenByIdDocument = gql`
  query GetTokenById($id: ID!) {
    token(id: $id) {
      ...TokenFields
      owner {
        ...RequesterFields
      }
    }
  }
  ${TokenFieldsFragmentDoc}
  ${RequesterFieldsFragmentDoc}
`;
export type GetTokenByIdQueryResult = Apollo.QueryResult<
  GetTokenByIdQuery,
  GetTokenByIdQueryVariables
>;
export const GetAllTokensDocument = gql`
  query GetAllTokens($first: Int, $skip: Int) {
    tokens(first: $first, skip: $skip) {
      ...TokenFields
    }
  }
  ${TokenFieldsFragmentDoc}
`;
export type GetAllTokensQueryResult = Apollo.QueryResult<
  GetAllTokensQuery,
  GetAllTokensQueryVariables
>;
export const GetTokensByCountryDocument = gql`
  query GetTokensByCountry($country: BigInt!) {
    tokens(where: { country: $country }) {
      ...TokenFields
    }
  }
  ${TokenFieldsFragmentDoc}
`;
export type GetTokensByCountryQueryResult = Apollo.QueryResult<
  GetTokensByCountryQuery,
  GetTokensByCountryQueryVariables
>;
