import { BigNumber } from 'ethers';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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

export type Block_Height = {
  readonly hash: InputMaybe<Scalars['Bytes']>;
  readonly number: InputMaybe<Scalars['Int']>;
  readonly number_gte: InputMaybe<Scalars['Int']>;
};

export type Commitment = {
  readonly __typename: 'Commitment';
  readonly committer: Committer;
  readonly contribution: Contribution;
  readonly id: Scalars['ID'];
  readonly requester: Requester;
};

export type Commitment_Filter = {
  readonly committer: InputMaybe<Scalars['String']>;
  readonly committer_contains: InputMaybe<Scalars['String']>;
  readonly committer_ends_with: InputMaybe<Scalars['String']>;
  readonly committer_gt: InputMaybe<Scalars['String']>;
  readonly committer_gte: InputMaybe<Scalars['String']>;
  readonly committer_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly committer_lt: InputMaybe<Scalars['String']>;
  readonly committer_lte: InputMaybe<Scalars['String']>;
  readonly committer_not: InputMaybe<Scalars['String']>;
  readonly committer_not_contains: InputMaybe<Scalars['String']>;
  readonly committer_not_ends_with: InputMaybe<Scalars['String']>;
  readonly committer_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly committer_not_starts_with: InputMaybe<Scalars['String']>;
  readonly committer_starts_with: InputMaybe<Scalars['String']>;
  readonly contribution: InputMaybe<Scalars['String']>;
  readonly contribution_contains: InputMaybe<Scalars['String']>;
  readonly contribution_ends_with: InputMaybe<Scalars['String']>;
  readonly contribution_gt: InputMaybe<Scalars['String']>;
  readonly contribution_gte: InputMaybe<Scalars['String']>;
  readonly contribution_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contribution_lt: InputMaybe<Scalars['String']>;
  readonly contribution_lte: InputMaybe<Scalars['String']>;
  readonly contribution_not: InputMaybe<Scalars['String']>;
  readonly contribution_not_contains: InputMaybe<Scalars['String']>;
  readonly contribution_not_ends_with: InputMaybe<Scalars['String']>;
  readonly contribution_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly contribution_not_starts_with: InputMaybe<Scalars['String']>;
  readonly contribution_starts_with: InputMaybe<Scalars['String']>;
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly requester: InputMaybe<Scalars['String']>;
  readonly requester_contains: InputMaybe<Scalars['String']>;
  readonly requester_ends_with: InputMaybe<Scalars['String']>;
  readonly requester_gt: InputMaybe<Scalars['String']>;
  readonly requester_gte: InputMaybe<Scalars['String']>;
  readonly requester_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly requester_lt: InputMaybe<Scalars['String']>;
  readonly requester_lte: InputMaybe<Scalars['String']>;
  readonly requester_not: InputMaybe<Scalars['String']>;
  readonly requester_not_contains: InputMaybe<Scalars['String']>;
  readonly requester_not_ends_with: InputMaybe<Scalars['String']>;
  readonly requester_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly requester_not_starts_with: InputMaybe<Scalars['String']>;
  readonly requester_starts_with: InputMaybe<Scalars['String']>;
};

export enum Commitment_OrderBy {
  Committer = 'committer',
  Contribution = 'contribution',
  Id = 'id',
  Requester = 'requester'
}

export type Committer = {
  readonly __typename: 'Committer';
  readonly commitments: ReadonlyArray<Commitment>;
  readonly id: Scalars['ID'];
  readonly isActive: Scalars['Boolean'];
  readonly removedAt: Scalars['BigInt'];
};

export type CommitterCommitmentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy: InputMaybe<Commitment_OrderBy>;
  orderDirection: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where: InputMaybe<Commitment_Filter>;
};

export type Committer_Filter = {
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly isActive: InputMaybe<Scalars['Boolean']>;
  readonly isActive_in: InputMaybe<ReadonlyArray<Scalars['Boolean']>>;
  readonly isActive_not: InputMaybe<Scalars['Boolean']>;
  readonly isActive_not_in: InputMaybe<ReadonlyArray<Scalars['Boolean']>>;
  readonly removedAt: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_gt: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_gte: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly removedAt_lt: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_lte: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_not: InputMaybe<Scalars['BigInt']>;
  readonly removedAt_not_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
};

export enum Committer_OrderBy {
  Commitments = 'commitments',
  Id = 'id',
  IsActive = 'isActive',
  RemovedAt = 'removedAt'
}

export type Contribution = {
  readonly __typename: 'Contribution';
  readonly id: Scalars['ID'];
  readonly value: Scalars['BigInt'];
};

export type Contribution_Filter = {
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly value: InputMaybe<Scalars['BigInt']>;
  readonly value_gt: InputMaybe<Scalars['BigInt']>;
  readonly value_gte: InputMaybe<Scalars['BigInt']>;
  readonly value_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly value_lt: InputMaybe<Scalars['BigInt']>;
  readonly value_lte: InputMaybe<Scalars['BigInt']>;
  readonly value_not: InputMaybe<Scalars['BigInt']>;
  readonly value_not_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
};

export enum Contribution_OrderBy {
  Id = 'id',
  Value = 'value'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  readonly __typename: 'Query';
  /** Access to subgraph metadata */
  readonly _meta: Maybe<_Meta_>;
  readonly commitment: Maybe<Commitment>;
  readonly commitments: ReadonlyArray<Commitment>;
  readonly committer: Maybe<Committer>;
  readonly committers: ReadonlyArray<Committer>;
  readonly contribution: Maybe<Contribution>;
  readonly contributions: ReadonlyArray<Contribution>;
  readonly requester: Maybe<Requester>;
  readonly requesters: ReadonlyArray<Requester>;
  readonly token: Maybe<Token>;
  readonly tokenChallenge: Maybe<TokenChallenge>;
  readonly tokenChallenges: ReadonlyArray<TokenChallenge>;
  readonly tokens: ReadonlyArray<Token>;
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
  readonly __typename: 'Requester';
  readonly commitments: ReadonlyArray<Commitment>;
  readonly id: Scalars['ID'];
  readonly tokenChallenge: ReadonlyArray<TokenChallenge>;
  readonly tokens: ReadonlyArray<Token>;
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
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
};

export enum Requester_OrderBy {
  Commitments = 'commitments',
  Id = 'id',
  TokenChallenge = 'tokenChallenge',
  Tokens = 'tokens'
}

export type Subscription = {
  readonly __typename: 'Subscription';
  /** Access to subgraph metadata */
  readonly _meta: Maybe<_Meta_>;
  readonly commitment: Maybe<Commitment>;
  readonly commitments: ReadonlyArray<Commitment>;
  readonly committer: Maybe<Committer>;
  readonly committers: ReadonlyArray<Committer>;
  readonly contribution: Maybe<Contribution>;
  readonly contributions: ReadonlyArray<Contribution>;
  readonly requester: Maybe<Requester>;
  readonly requesters: ReadonlyArray<Requester>;
  readonly token: Maybe<Token>;
  readonly tokenChallenge: Maybe<TokenChallenge>;
  readonly tokenChallenges: ReadonlyArray<TokenChallenge>;
  readonly tokens: ReadonlyArray<Token>;
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
  readonly __typename: 'Token';
  readonly id: Scalars['ID'];
  readonly mintTime: Scalars['BigInt'];
  readonly owner: Requester;
  readonly tokenURI: Scalars['String'];
};

export type TokenChallenge = {
  readonly __typename: 'TokenChallenge';
  readonly id: Scalars['ID'];
  readonly owner: Requester;
  readonly token: Token;
};

export type TokenChallenge_Filter = {
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly owner: InputMaybe<Scalars['String']>;
  readonly owner_contains: InputMaybe<Scalars['String']>;
  readonly owner_ends_with: InputMaybe<Scalars['String']>;
  readonly owner_gt: InputMaybe<Scalars['String']>;
  readonly owner_gte: InputMaybe<Scalars['String']>;
  readonly owner_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_lt: InputMaybe<Scalars['String']>;
  readonly owner_lte: InputMaybe<Scalars['String']>;
  readonly owner_not: InputMaybe<Scalars['String']>;
  readonly owner_not_contains: InputMaybe<Scalars['String']>;
  readonly owner_not_ends_with: InputMaybe<Scalars['String']>;
  readonly owner_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_not_starts_with: InputMaybe<Scalars['String']>;
  readonly owner_starts_with: InputMaybe<Scalars['String']>;
  readonly token: InputMaybe<Scalars['String']>;
  readonly token_contains: InputMaybe<Scalars['String']>;
  readonly token_ends_with: InputMaybe<Scalars['String']>;
  readonly token_gt: InputMaybe<Scalars['String']>;
  readonly token_gte: InputMaybe<Scalars['String']>;
  readonly token_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly token_lt: InputMaybe<Scalars['String']>;
  readonly token_lte: InputMaybe<Scalars['String']>;
  readonly token_not: InputMaybe<Scalars['String']>;
  readonly token_not_contains: InputMaybe<Scalars['String']>;
  readonly token_not_ends_with: InputMaybe<Scalars['String']>;
  readonly token_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly token_not_starts_with: InputMaybe<Scalars['String']>;
  readonly token_starts_with: InputMaybe<Scalars['String']>;
};

export enum TokenChallenge_OrderBy {
  Id = 'id',
  Owner = 'owner',
  Token = 'token'
}

export type Token_Filter = {
  readonly id: InputMaybe<Scalars['ID']>;
  readonly id_gt: InputMaybe<Scalars['ID']>;
  readonly id_gte: InputMaybe<Scalars['ID']>;
  readonly id_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly id_lt: InputMaybe<Scalars['ID']>;
  readonly id_lte: InputMaybe<Scalars['ID']>;
  readonly id_not: InputMaybe<Scalars['ID']>;
  readonly id_not_in: InputMaybe<ReadonlyArray<Scalars['ID']>>;
  readonly mintTime: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_gt: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_gte: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly mintTime_lt: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_lte: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_not: InputMaybe<Scalars['BigInt']>;
  readonly mintTime_not_in: InputMaybe<ReadonlyArray<Scalars['BigInt']>>;
  readonly owner: InputMaybe<Scalars['String']>;
  readonly owner_contains: InputMaybe<Scalars['String']>;
  readonly owner_ends_with: InputMaybe<Scalars['String']>;
  readonly owner_gt: InputMaybe<Scalars['String']>;
  readonly owner_gte: InputMaybe<Scalars['String']>;
  readonly owner_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_lt: InputMaybe<Scalars['String']>;
  readonly owner_lte: InputMaybe<Scalars['String']>;
  readonly owner_not: InputMaybe<Scalars['String']>;
  readonly owner_not_contains: InputMaybe<Scalars['String']>;
  readonly owner_not_ends_with: InputMaybe<Scalars['String']>;
  readonly owner_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly owner_not_starts_with: InputMaybe<Scalars['String']>;
  readonly owner_starts_with: InputMaybe<Scalars['String']>;
  readonly tokenURI: InputMaybe<Scalars['String']>;
  readonly tokenURI_contains: InputMaybe<Scalars['String']>;
  readonly tokenURI_ends_with: InputMaybe<Scalars['String']>;
  readonly tokenURI_gt: InputMaybe<Scalars['String']>;
  readonly tokenURI_gte: InputMaybe<Scalars['String']>;
  readonly tokenURI_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_lt: InputMaybe<Scalars['String']>;
  readonly tokenURI_lte: InputMaybe<Scalars['String']>;
  readonly tokenURI_not: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_contains: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_ends_with: InputMaybe<Scalars['String']>;
  readonly tokenURI_not_in: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly tokenURI_not_starts_with: InputMaybe<Scalars['String']>;
  readonly tokenURI_starts_with: InputMaybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Id = 'id',
  MintTime = 'mintTime',
  Owner = 'owner',
  TokenUri = 'tokenURI'
}

export type _Block_ = {
  readonly __typename: '_Block_';
  /** The hash of the block */
  readonly hash: Maybe<Scalars['Bytes']>;
  /** The block number */
  readonly number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  readonly __typename: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  readonly block: _Block_;
  /** The deployment ID */
  readonly deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  readonly hasIndexingErrors: Scalars['Boolean'];
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
  readonly __typename: 'Query';
  readonly committers: ReadonlyArray<{
    readonly __typename: 'Committer';
    readonly id: string;
    readonly isActive: boolean;
    readonly removedAt: BigNumber;
    readonly commitments: ReadonlyArray<{
      readonly __typename: 'Commitment';
      readonly id: string;
      readonly contribution: {
        readonly __typename: 'Contribution';
        readonly id: string;
        readonly value: BigNumber;
      };
    }>;
  }>;
};

export type GetRequesterByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetRequesterByIdQuery = {
  readonly __typename: 'Query';
  readonly requester: {
    readonly __typename: 'Requester';
    readonly id: string;
    readonly commitments: ReadonlyArray<{
      readonly __typename: 'Commitment';
      readonly id: string;
      readonly contribution: {
        readonly __typename: 'Contribution';
        readonly id: string;
        readonly value: BigNumber;
      };
    }>;
    readonly tokens: ReadonlyArray<{
      readonly __typename: 'Token';
      readonly id: string;
      readonly mintTime: BigNumber;
      readonly tokenURI: string;
    }>;
    readonly tokenChallenge: ReadonlyArray<{
      readonly __typename: 'TokenChallenge';
      readonly id: string;
    }>;
  } | null;
};

export type GetTokenByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetTokenByIdQuery = {
  readonly __typename: 'Query';
  readonly token: {
    readonly __typename: 'Token';
    readonly id: string;
    readonly mintTime: BigNumber;
    readonly tokenURI: string;
  } | null;
};

export type CommitmentFieldsFragment = {
  readonly __typename: 'Commitment';
  readonly id: string;
  readonly contribution: {
    readonly __typename: 'Contribution';
    readonly id: string;
    readonly value: BigNumber;
  };
};

export type TokenFieldsFragment = {
  readonly __typename: 'Token';
  readonly id: string;
  readonly mintTime: BigNumber;
  readonly tokenURI: string;
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
export const TokenFieldsFragmentDoc = gql`
  fragment TokenFields on Token {
    id
    mintTime
    tokenURI
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

/**
 * __useGetCommittersQuery__
 *
 * To run a query within a React component, call `useGetCommittersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommittersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommittersQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetCommittersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCommittersQuery, GetCommittersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCommittersQuery, GetCommittersQueryVariables>(
    GetCommittersDocument,
    options
  );
}
export function useGetCommittersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommittersQuery, GetCommittersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCommittersQuery, GetCommittersQueryVariables>(
    GetCommittersDocument,
    options
  );
}
export type GetCommittersQueryHookResult = ReturnType<typeof useGetCommittersQuery>;
export type GetCommittersLazyQueryHookResult = ReturnType<typeof useGetCommittersLazyQuery>;
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

/**
 * __useGetRequesterByIdQuery__
 *
 * To run a query within a React component, call `useGetRequesterByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRequesterByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRequesterByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRequesterByIdQuery(
  baseOptions: Apollo.QueryHookOptions<GetRequesterByIdQuery, GetRequesterByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRequesterByIdQuery, GetRequesterByIdQueryVariables>(
    GetRequesterByIdDocument,
    options
  );
}
export function useGetRequesterByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRequesterByIdQuery, GetRequesterByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRequesterByIdQuery, GetRequesterByIdQueryVariables>(
    GetRequesterByIdDocument,
    options
  );
}
export type GetRequesterByIdQueryHookResult = ReturnType<typeof useGetRequesterByIdQuery>;
export type GetRequesterByIdLazyQueryHookResult = ReturnType<typeof useGetRequesterByIdLazyQuery>;
export type GetRequesterByIdQueryResult = Apollo.QueryResult<
  GetRequesterByIdQuery,
  GetRequesterByIdQueryVariables
>;
export const GetTokenByIdDocument = gql`
  query GetTokenById($id: ID!) {
    token(id: $id) {
      ...TokenFields
    }
  }
  ${TokenFieldsFragmentDoc}
`;

/**
 * __useGetTokenByIdQuery__
 *
 * To run a query within a React component, call `useGetTokenByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTokenByIdQuery(
  baseOptions: Apollo.QueryHookOptions<GetTokenByIdQuery, GetTokenByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTokenByIdQuery, GetTokenByIdQueryVariables>(
    GetTokenByIdDocument,
    options
  );
}
export function useGetTokenByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTokenByIdQuery, GetTokenByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTokenByIdQuery, GetTokenByIdQueryVariables>(
    GetTokenByIdDocument,
    options
  );
}
export type GetTokenByIdQueryHookResult = ReturnType<typeof useGetTokenByIdQuery>;
export type GetTokenByIdLazyQueryHookResult = ReturnType<typeof useGetTokenByIdLazyQuery>;
export type GetTokenByIdQueryResult = Apollo.QueryResult<
  GetTokenByIdQuery,
  GetTokenByIdQueryVariables
>;
