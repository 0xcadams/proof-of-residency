import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';

const analyticsWriteKey = process.env.ANALYTICS_WRITE_KEY;
const inclinedEnv = process.env.INCLINED_ENV;

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b69ccb" />
          <meta name="msapplication-TileColor" content="#eaddf9" />
          <meta name="theme-color" content="#eaddf9" />
        </Head>
        <body>
          {/* Make Color mode persist when you refresh the page. */}
          <ColorModeScript initialColorMode="dark" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
