import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Tag,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import numeral from 'numeral';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import {
  getCurrentMintedCount,
  getCurrentMintedCountForChain,
  getOwnerOfToken,
  TokenOwner
} from 'src/api/subgraph';
import { getChainForChainId, PROOF_OF_RESIDENCY_CHAINS } from 'src/contracts';
import Header from 'src/web/components/Header';
import { getPopulationForAlpha3 } from 'src/web/populations';
import {
  CountryIso,
  getAllCountries,
  getCountryAndTokenNumber,
  getIsoCountryForAlpha3,
  getTokenIdsForCountryAndCount
} from 'src/web/token';
import { MetadataResponse } from 'types';
import Footer from '../../src/web/components/Footer';

type CountryDetailsProps = CountryIso & {
  countryId: number;
  image: string;
  imageLarge: string;
  minted: number;
  population: number;
  tokens: {
    tokenId: string;
    tokenNumber: string;
    link: string;
    image: string;
    owner: TokenOwner;
    chain: string;
  }[];
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllCountries().map((country) => {
      const params: Params = { id: country.alpha3 };

      return { params };
    }),

    fallback: false
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const countryAlpha3 = params?.id ?? '';

  if (!countryAlpha3) {
    console.error('No id passed');
    return { notFound: true };
  }

  try {
    const isoCountry = getIsoCountryForAlpha3(countryAlpha3);

    if (!isoCountry) {
      console.error('No ISO country found');
      return { notFound: true };
    }

    const countryId = Number(isoCountry.numeric);

    const mintedCountTotal = await getCurrentMintedCount(countryId);

    const mintedCountries = await Promise.all(
      PROOF_OF_RESIDENCY_CHAINS.map(async (chain) => {
        const mintedCount = await getCurrentMintedCountForChain(countryId, chain);

        return { chain, mintedCount };
      })
    );

    const tokens = await Promise.all(
      mintedCountries.flatMap(({ chain, mintedCount }) => {
        return getTokenIdsForCountryAndCount(countryId, mintedCount.toNumber() ?? 0).map(
          async (tokenId) => {
            const res = await fetch(
              `https://generator.proofofresidency.xyz/api/${chain}/${tokenId}`
              // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
            );
            const meta: MetadataResponse = await res.json();

            const owner = await getOwnerOfToken(tokenId, chain);

            const { tokenNumber } = getCountryAndTokenNumber(tokenId);

            return {
              ...meta,
              owner,
              tokenId: tokenId,
              tokenNumber: tokenNumber.toString(),
              link: `/token/${chain}/${tokenId}`,
              image: `https://generator.proofofresidency.xyz/token/${chain}/${tokenId}.png`,
              chain: getChainForChainId(chain)?.name ?? ''
              // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/token/${tokenId}.png`
            };
          }
        );
      })
    );

    const population = getPopulationForAlpha3(isoCountry.alpha3);

    const props: CountryDetailsProps = {
      ...isoCountry,
      countryId,
      population: population ?? 0,
      image: `/previews/${countryId}.png`,
      imageLarge: `/previews-large/${countryId}.png`,
      minted: mintedCountTotal?.toNumber() ?? 0,
      tokens
    };

    return {
      props,
      revalidate: 300
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
};

const CountryDetailsPage = (props: CountryDetailsProps) => {
  const tags = [
    {
      name: 'Count Minted',
      content: `${numeral(props.minted).format('0,0')}`,
      tooltip: 'The number of tokens which have been minted across all supported chains.'
    },
    {
      name: 'ISO-3166 ID',
      content: props.alpha3,
      tooltip: 'The ISO-3166 identifier for the country.'
    },
    ...[
      props.population !== 0
        ? {
            name: '2020 Population',
            content: `${numeral(props.population).format('0.0a')}`,
            tooltip: 'The total population count in 2020.'
          }
        : {}
    ],
    {
      name: 'License',
      link: 'https://creativecommons.org/publicdomain/zero/1.0/',
      content: 'CCO: No Rights Reserved'
    }
  ];

  return (
    <>
      <Header />
      <Flex pt="70px" width="100%" direction="column">
        <NextSeo
          title={`${props.country} | Proof of Residency`}
          openGraph={{
            images: [
              {
                url: `https://proofofresidency.xyz${props.image}`,
                width: 1800,
                height: 1800,
                alt: props.country
              }
            ]
          }}
        />
        <Box>
          <Flex mx="auto" position="relative" height={600}>
            <Image
              priority
              objectFit="contain"
              layout="fill"
              placeholder="empty"
              src={props.imageLarge}
              alt={props.country}
            />
          </Flex>
        </Box>

        <Divider />

        <Heading fontSize="5xl" mt={6} textAlign="center">
          {props.country}
        </Heading>

        <Grid px={4} maxWidth={1200} width="100%" mx="auto" flexDirection="column" mt={4}>
          {props.country && (
            <Text maxWidth={600} mx="auto" fontSize="xl" textAlign="center" width="100%">
              {`Art inspired by ${props.country} and its water bodies.`}
            </Text>
          )}

          <Text maxWidth={600} mt={1} mx="auto" fontSize="md" textAlign="center" width="100%">
            Designs for every minted NFT vary.
          </Text>

          <SimpleGrid
            mx={{ base: 4, sm: 'auto' }}
            mt={8}
            mb={8}
            spacingX={10}
            spacingY={4}
            columns={{ base: 1, sm: 2 }}
          >
            {tags.map((tag) => (
              <Flex key={tag.name} direction="column">
                <Text fontWeight="bold" fontSize="lg">
                  {tag.name}
                </Text>
                <Tooltip label={tag.tooltip}>
                  {tag.link ? (
                    <Box cursor="pointer">
                      <Link href={tag.link} passHref>
                        <Tag mt={1} variant="solid" size="lg">
                          {tag.content}
                        </Tag>
                      </Link>
                    </Box>
                  ) : (
                    <Box mt={1}>
                      <Tag variant="solid" size="lg">
                        {tag.content}
                      </Tag>
                    </Box>
                  )}
                </Tooltip>
              </Flex>
            ))}
          </SimpleGrid>

          {props.tokens.length > 0 && (
            <>
              <Divider />
              <Heading textAlign="center" mt={4} fontSize="3xl">
                Minted Tokens
              </Heading>

              <SimpleGrid
                mx="auto"
                alignItems="center"
                width="100%"
                maxWidth={1200}
                mt={4}
                mb={8}
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
              >
                {props.tokens.map((token, i) => (
                  <Link key={token.tokenId} href={token.link} passHref>
                    <Flex align="center" cursor="pointer" direction="column">
                      <Box>
                        <Flex mt={2} mx="auto" position="relative" width={400} height={400}>
                          <Image
                            objectFit="contain"
                            layout="fill"
                            placeholder="empty"
                            src={token.image}
                            alt={token.tokenNumber}
                          />
                        </Flex>
                      </Box>
                      <Heading mt={2} fontSize="2xl">
                        {token.chain}: #{token.tokenNumber}
                      </Heading>
                      <Box mt={2}>
                        <Tag variant="solid" size="md">
                          Owner: {token.owner.content}
                        </Tag>
                      </Box>
                    </Flex>
                  </Link>
                ))}
              </SimpleGrid>
            </>
          )}
        </Grid>
      </Flex>
      <Footer />
    </>
  );
};

export default CountryDetailsPage;
