import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import { withScalars } from 'apollo-link-scalars';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { trackEvent } from 'src/web/mixpanel';
import introspectionResult from '../src/graphql/generated/graphql.schema.json';

import { BigNumber } from 'ethers';
import { buildClientSchema, IntrospectionQuery } from 'graphql';
import theme from '../src/web/theme';

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';

import { rainbowTheme } from 'src/web/rainbowTheme';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { allChains } from 'src/contracts';

const { chains, provider } = configureChains(allChains, [
  infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID }),
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider()
]);

const { connectors } = getDefaultWallets({
  appName: 'Proof of Residency',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

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
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={rainbowTheme}>
            <ApolloProvider client={client}>
              <Component {...pageProps} />
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
};

export default App;
