import {
  ApolloClient,
  ApolloLink,
  ApolloQueryResult,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import { withScalars } from 'apollo-link-scalars';
import { BigNumber } from 'ethers';

import { buildClientSchema, DocumentNode, IntrospectionQuery } from 'graphql';
import { ProofOfResidencyNetwork } from 'src/contracts';
import { getCountryAndTokenNumber } from 'src/web/token';
import { GetAllTokensResponse } from 'types';
import {
  GetAllTokensQueryVariables,
  GetAllTokensDocument,
  GetAllTokensQuery,
  TokenFieldsFragment,
  GetTokensByCountryQuery,
  GetTokensByCountryQueryVariables,
  GetTokensByCountryDocument,
  GetTokenByIdQuery,
  GetTokenByIdQueryVariables,
  GetTokenByIdDocument,
  GetRequesterByIdQuery,
  GetRequesterByIdQueryVariables,
  GetRequesterByIdDocument,
  GetAllRequestersDocument,
  GetAllRequestersQuery,
  GetAllRequestersQueryVariables,
  RequesterFieldsFragment
} from 'types/subgraph';
import { chainId } from 'wagmi';

import introspectionResult from '../graphql/graphql.schema.json';

const typesMap = {
  BigInt: {
    serialize: (parsed: unknown): string | null =>
      parsed instanceof BigNumber ? parsed.toString() : null,
    parseValue: (raw: unknown): BigNumber | null => {
      if (!raw) return null;

      if (typeof raw === 'string') {
        return BigNumber.from(raw);
      }

      throw new Error('Invalid BigInt passed into parse.');
    }
  }
};

const schema = buildClientSchema(introspectionResult as unknown as IntrospectionQuery);

const apolloClientForChain = (chain: string) =>
  new ApolloClient({
    link: ApolloLink.from([
      withScalars({ schema, typesMap }),
      new HttpLink({
        uri: `https://api.thegraph.com/subgraphs/name/proof-of-residency/${chain}`
      })
    ]),
    cache: new InMemoryCache({})
  });

const l1Client = apolloClientForChain(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'goerli' : 'mainnet'
);
const arbitrumClient = apolloClientForChain(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'arbitrum-rinkeby' : 'arbitrum-one'
);
const optimismClient = apolloClientForChain(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'optimism-kovan' : 'optimism'
);
const polygonClient = apolloClientForChain(
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' ? 'polygon-mumbai' : 'polygon'
);

const getClientForChain = (chain: ProofOfResidencyNetwork) =>
  chain === chainId.mainnet || chain === chainId.goerli
    ? l1Client
    : chain === chainId.arbitrum || chain === chainId.arbitrumRinkeby
    ? arbitrumClient
    : chain === chainId.optimism || chain === chainId.optimismKovan
    ? optimismClient
    : polygonClient;

type QueryHandlerProps<T, V, R = string, D = DocumentNode> = {
  document: D;
  variables: V;
  mapResponseToValue: (result: ApolloQueryResult<T>) => R;
};

const queryHandler = async <T, V, R>(props: QueryHandlerProps<T, V, R>) => {
  const [l1Response, arbitrumResponse, optimismResponse, polygonResponse] =
    await Promise.allSettled([
      l1Client.query<T, V>({
        query: props.document,
        variables: props.variables
      }),
      arbitrumClient.query<T, V>({
        query: props.document,
        variables: props.variables
      }),
      optimismClient.query<T, V>({
        query: props.document,
        variables: props.variables
      }),
      polygonClient.query<T, V>({
        query: props.document,
        variables: props.variables
      })
    ]);

  if (l1Response.status === 'rejected') {
    console.error(l1Response.reason);
  }
  if (arbitrumResponse.status === 'rejected') {
    console.error(arbitrumResponse.reason);
  }
  if (optimismResponse.status === 'rejected') {
    console.error(optimismResponse.reason);
  }
  if (polygonResponse.status === 'rejected') {
    console.error(polygonResponse.reason);
  }

  const [l1Value, arbitrumValue, optimismValue, polygonValue] = await Promise.all([
    l1Response.status === 'fulfilled' ? props.mapResponseToValue(l1Response.value) : null,
    arbitrumResponse.status === 'fulfilled'
      ? props.mapResponseToValue(arbitrumResponse.value)
      : null,
    optimismResponse.status === 'fulfilled'
      ? props.mapResponseToValue(optimismResponse.value)
      : null,
    polygonResponse.status === 'fulfilled' ? props.mapResponseToValue(polygonResponse.value) : null
  ]);

  return {
    l1: l1Value,
    arbitrum: arbitrumValue,
    optimism: optimismValue,
    polygon: polygonValue
  };
};

export const getAllTokens = async (): Promise<GetAllTokensResponse> => {
  try {
    const tokens = await queryHandler<
      GetAllTokensQuery,
      GetAllTokensQueryVariables,
      TokenFieldsFragment[]
    >({
      document: GetAllTokensDocument,
      variables: {
        first: 100,
        skip: 0
      },
      mapResponseToValue: (r) => r.data.tokens
    });

    return [
      ...(tokens.l1?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.mainnet,
        country: t.country.toNumber()
      })) ?? []),
      ...(tokens.arbitrum?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.arbitrum,
        country: t.country.toNumber()
      })) ?? []),
      ...(tokens.optimism?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.optimism,
        country: t.country.toNumber()
      })) ?? []),
      ...(tokens.polygon?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.polygon,
        country: t.country.toNumber()
      })) ?? [])
    ];
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const getCurrentMintedCount = async (countryId: BigNumber | number) => {
  try {
    const tokens = await queryHandler<
      GetTokensByCountryQuery,
      GetTokensByCountryQueryVariables,
      TokenFieldsFragment[]
    >({
      document: GetTokensByCountryDocument,
      variables: {
        country: BigNumber.from(countryId)
      },
      mapResponseToValue: (r) => r.data.tokens
    });

    return BigNumber.from(tokens.l1?.length ?? 0)
      .add(tokens.arbitrum?.length ?? 0)
      .add(tokens.optimism?.length ?? 0)
      .add(tokens.polygon?.length ?? 0);
  } catch (e) {
    console.error(e);
  }
  return BigNumber.from(0);
};

export const getCurrentMintedCountForChain = async (
  countryId: BigNumber | number,
  chain: ProofOfResidencyNetwork
) => {
  try {
    const response = await getClientForChain(chain).query<
      GetTokensByCountryQuery,
      GetTokensByCountryQueryVariables
    >({
      query: GetTokensByCountryDocument,
      variables: {
        country: BigNumber.from(countryId)
      }
    });

    return BigNumber.from(response?.data?.tokens?.length ?? 0);
  } catch (e) {
    console.error(e);
  }

  return BigNumber.from(0);
};

export type TokenOwner = { content: string; link: string | null };

export const getOwnerOfToken = async (
  tokenId: string | BigNumber,
  chain: ProofOfResidencyNetwork
): Promise<TokenOwner> => {
  try {
    const { countryId, tokenNumber } = getCountryAndTokenNumber(tokenId.toString());

    const count = await getCurrentMintedCount(countryId);

    if (count.gte(tokenNumber)) {
      const response = await getClientForChain(chain).query<
        GetTokenByIdQuery,
        GetTokenByIdQueryVariables
      >({
        query: GetTokenByIdDocument,
        variables: {
          id: tokenId.toString()
        }
      });

      const owner = response?.data?.token?.owner?.id ?? null;

      return {
        content: owner?.replace(owner?.slice(6, 38), '...') || 'None',
        link: owner
          ? chain === chainId.arbitrum
            ? `https://arbiscan.io/address/${owner}`
            : chain === chainId.optimism
            ? `https://optimistic.etherscan.io/address/${owner}`
            : chain === chainId.polygon
            ? `https://polygonscan.io/address/${owner}`
            : `https://etherscan.io/address/${owner}`
          : null
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    content: 'None',
    link: null
  };
};

export const getTokensForOwner = async (owner: string) => {
  try {
    const tokens = await queryHandler<
      GetRequesterByIdQuery,
      GetRequesterByIdQueryVariables,
      TokenFieldsFragment[]
    >({
      document: GetRequesterByIdDocument,
      variables: {
        id: owner.toLowerCase()
      },
      mapResponseToValue: (r) =>
        r.data.requester?.tokens?.map((t) => ({ ...t, id: BigNumber.from(t.id).toString() })) ?? []
    });

    return tokens;
  } catch (e) {
    console.error(e);
  }
  return {
    l1: [],
    arbitrum: [],
    optimism: [],
    polygon: []
  };
};

export type GetAllTokenOwnersResponse = (RequesterFieldsFragment & {
  chain: number;
})[];

export const getAllTokenOwners = async (): Promise<GetAllTokenOwnersResponse> => {
  try {
    const tokens = await queryHandler<
      GetAllRequestersQuery,
      GetAllRequestersQueryVariables,
      RequesterFieldsFragment[]
    >({
      document: GetAllRequestersDocument,
      variables: {},
      mapResponseToValue: (r) => r.data.requesters
    });

    return [
      ...(tokens.l1?.map((t) => ({
        ...t,
        chain: chainId.mainnet
      })) ?? []),
      ...(tokens.arbitrum?.map((t) => ({
        ...t,
        chain: chainId.arbitrum
      })) ?? []),
      ...(tokens.optimism?.map((t) => ({
        ...t,
        chain: chainId.optimism
      })) ?? []),
      ...(tokens.polygon?.map((t) => ({
        ...t,
        chain: chainId.polygon
      })) ?? [])
    ];
  } catch (e) {
    console.error(e);
  }
  return [];
};
