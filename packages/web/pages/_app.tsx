import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/shadows-into-light';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { trackEvent } from 'src/web/mixpanel';
import { UseWalletProvider } from 'use-wallet';

import theme from '../src/web/theme';

// mainnet, rinkeby, local
const chainId =
  process.env.VERCEL_ENV === 'production' ? 4 : process.env.VERCEL_ENV === 'preview' ? 4 : 1337;

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
          <Component {...pageProps} />
        </UseWalletProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
