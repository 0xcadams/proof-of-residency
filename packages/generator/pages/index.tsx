import Head from 'next/head';
import React from 'react';

const IndexPage = () => (
  <>
    <Head>
      <title>{`Proof of Residency`}</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b69ccb" />
      <meta name="msapplication-TileColor" content="#eaddf9" />
      <meta name="theme-color" content="#eaddf9" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <div>Hi! 👋</div>
  </>
);

export default IndexPage;
