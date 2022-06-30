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
import { GetAllTokensResponse } from 'types';
import {
  GetAllTokensQueryVariables,
  GetAllTokensDocument,
  GetAllTokensQuery,
  TokenFieldsFragment
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
        chain: chainId.mainnet
      })) ?? []),
      ...(tokens.arbitrum?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.arbitrum
      })) ?? []),
      ...(tokens.optimism?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.optimism
      })) ?? []),
      ...(tokens.polygon?.map((t) => ({
        id: BigNumber.from(t.id).toString(),
        chain: chainId.polygon
      })) ?? [])
    ];
  } catch (e) {
    console.error(e);
  }
  return [];
};
