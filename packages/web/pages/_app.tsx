import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/shadows-into-light';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { trackEvent } from 'src/web/mixpanel';
import { UseWalletProvider } from 'use-wallet';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { withScalars } from 'apollo-link-scalars';
import introspectionResult from '../src/graphql/generated/graphql.schema.json';

import theme from '../src/web/theme';
import { BigNumber } from 'ethers';
import { buildClientSchema, IntrospectionQuery } from 'graphql';

const chainId =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 42161
    : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? 421611
    : 1337;

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

const client = new ApolloClient({
  link: ApolloLink.from([
    withScalars({ schema, typesMap }),
    new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT })
  ]),
  cache: new InMemoryCache()
});

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    trackEvent('Page view', { url: router.route });

    const handleRouteChange = (url: string) => {
      trackEvent('Page view', { url: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <DefaultSeo
        title="Proof of Residency"
        description="A proof of personhood protocol built on physical mail."
        openGraph={{
          type: 'website',
          url: 'https://proofofresidency.xyz',
          // eslint-disable-next-line camelcase
          site_name: 'Proof of Residency',
          images: [
            {
              url: 'https://proofofresidency.xyz/logo-og.png',
              width: 1200,
              height: 630,
              alt: 'Proof of Residency Logo'
            }
          ]
        }}
        twitter={{
          site: '@proofofres',
          cardType: 'summary_large_image'
        }}
      />
      <ChakraProvider resetCSS theme={theme}>
        <UseWalletProvider
          connectors={{
            // TODO add to this
            injected: {
              chainId: [chainId]
            }
          }}
        >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </UseWalletProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
