import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/shadows-into-light';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import React from 'react';
import theme from '../src/theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <DefaultSeo
        title="Proof of Residency"
        description="NFT collection inspired by cartography."
        openGraph={{
          type: 'website',
          url: 'https://proofofresidency.xyz',
          site_name: 'Proof of Residency',
          description: 'NFT collection inspired by cartography.',
          images: [
            {
              url: 'https://proofofresidency.xyz/logo-og.png',
              width: 1200,
              height: 630,
              alt: 'Proof of Residency Logo'
            }
          ]
        }}
      />
      {/* <ApolloProvider client={apolloClient}> */}
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      {/* </ApolloProvider> */}
    </>
  );
};

export default App;
