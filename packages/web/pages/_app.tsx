import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/shadows-into-light';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import React from 'react';
import { UseWalletProvider } from 'use-wallet';

import theme from '../src/web/theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <DefaultSeo
        title="Proof of Residency"
        description="Rep your city with NFT art."
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
      />
      <ChakraProvider resetCSS theme={theme}>
        <UseWalletProvider connectors={{}}>
          <Component {...pageProps} />
        </UseWalletProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
