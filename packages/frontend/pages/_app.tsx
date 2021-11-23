import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';

import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <DefaultSeo
        title="Proof of Residency"
        description="Proof of residency in a geographical area, on the blockchain."
        openGraph={{
          type: 'website',
          url: 'https://proofofresidency.org',
          site_name: 'Proof of Residency',
          description: 'Proof of residency in a geographical area, on the blockchain.'
        }}
      />
      {/* <ApolloProvider client={apolloClient}> */}
      <ChakraProvider resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
      {/* </ApolloProvider> */}
    </>
  );
};

export default App;
