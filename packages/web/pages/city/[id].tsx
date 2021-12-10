import { Box, Divider, Flex, Heading, SimpleGrid, Tag, Text, Tooltip } from '@chakra-ui/react';
import { promises as fs } from 'fs';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import numeral from 'numeral';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { Mapping } from 'types';
import Footer from '../../src/web/components/Footer';
import Header from '../../src/web/components/Header';
import { TokenOwner, getMintedCount, getOwnerOfToken } from '../../src/web/ethers';

type CityDetailsProps = Mapping & {
  cityId: number;
  image: string;
  minted: number;
  tokens: {
    tokenId: string;
    link: string;
    image: string;
    owner: TokenOwner;
  }[];
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
  const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

  return {
    paths: mappings.flatMap((mapping, cityId) => {
      const tokenCounts = [...Array(mapping.limit)].map((_, i) => i + 1);

      return tokenCounts.map((tokenCount) => {
        const params: Params = { id: cityId.toFixed(0) };

        return { params };
      });
    }),

    fallback: false
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const cityId = Number.parseInt(params?.id ?? '-1');

  if (cityId === -1) {
    return { notFound: true };
  }

  try {
    const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
    const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const mapping = mappings[cityId];

    if (!mapping) {
      return { notFound: true };
    }

    const mintedCount = await getMintedCount(cityId);

    const tokens = await Promise.all(
      [...Array(mintedCount.toNumber() ?? 0)]
        .map((_, tokenNumber) => cityId * 1e3 + (tokenNumber + 1))
        .map(async (tokenId) => {
          // const res = await fetch(
          //   `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
          // );
          // const meta: MetadataResponse = await res.json();

          const owner = await getOwnerOfToken(tokenId);

          return {
            // ...meta,
            owner,
            tokenId: tokenId.toFixed(0),
            link: `/token/${tokenId}`,
            image: `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/token/${tokenId}.png`
          };
        })
    );

    const props: CityDetailsProps = {
      ...mapping,
      cityId,
      image: `/previews/${cityId}.png`,
      minted: mintedCount?.toNumber() ?? 0,
      tokens
    };

    return {
      props,
      revalidate: 60
    };
  } catch (e) {
    return { notFound: true };
  }
};

const CityDetailsPage = (props: CityDetailsProps) => {
  const tags = [
    {
      name: 'License',
      link: 'https://creativecommons.org/publicdomain/zero/1.0/',
      content: 'CCO: No Rights Reserved'
    },
    {
      name: 'Initial Price',
      content: `${numeral(props.price).format('0.0')}Ξ`
    },

    {
      name: 'Mint Limit',
      content: `${numeral(props.limit).format('0,0')}`,
      tooltip: 'The limit on number of tokens able to be minted for this city.'
    },
    {
      name: 'Count Minted',
      content: `${numeral(props.minted).format('0,0')}`,
      tooltip: 'The number of tokens which have been claimed.'
    },
    {
      name: 'Total Population',
      content: `${numeral(props.population).format('0,0')}`,
      link: 'https://en.wikipedia.org/wiki/Metropolitan_statistical_area',
      tooltip: 'The population over 18 y.o. in the city in 2020.'
    },
    {
      name: 'Created By',
      content: 'Generative Script'
    }
  ];

  return (
    <>
      <Header />
      <Flex pt="70px" width="100%" direction="column">
        <NextSeo
          title={`${props.name} | Proof of Residency`}
          openGraph={{
            images: [
              {
                url: `https://proofofresidency.xyz${props.image}`,
                width: 1000,
                height: 1000,
                alt: props.name
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
              src={props.image}
              alt={props.name}
            />
          </Flex>
        </Box>

        <Divider />

        <Heading size="lg" mt={6} textAlign="center">
          {props.name}
        </Heading>

        <Flex
          px={4}
          columns={{ base: 1, md: 2 }}
          spacing={4}
          maxWidth={1200}
          width="100%"
          mx="auto"
          flexDirection="column"
          mt={4}
        >
          {props.state && (
            <Text mx="auto" fontSize="xl" textAlign="center" width="100%">
              {`Art inspired by ${props.state} and its cities.`}
            </Text>
          )}

          <Text mt={1} mx="auto" fontSize="md" textAlign="center" width="100%">
            Designs for every minted NFT vary.
          </Text>

          <SimpleGrid
            mx={{ base: 2, sm: 'auto' }}
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
                        <Tag mt={1} pt="3px" variant="solid" size="lg">
                          {tag.content}
                        </Tag>
                      </Link>
                    </Box>
                  ) : (
                    <Box mt={1}>
                      <Tag pt="3px" variant="solid" size="lg">
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
              <Heading textAlign="center" mt={4} size="lg">
                Minted Tokens
              </Heading>

              <SimpleGrid
                mx="auto"
                align="center"
                width="100%"
                maxWidth={1200}
                mt={4}
                mb={8}
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
              >
                {props.tokens.map((token, i) => (
                  <Link key={token.tokenId} href={token.link} passHref>
                    <Flex cursor="pointer" direction="column">
                      <Box>
                        <Flex mt={2} mx="auto" position="relative" height={400}>
                          <Image
                            priority={i < 6}
                            objectFit="contain"
                            layout="fill"
                            placeholder="empty"
                            src={token.image}
                            alt={token.tokenId}
                          />
                        </Flex>
                      </Box>
                      <Text mt={2} fontWeight="bold">
                        Token #{token.tokenId}
                      </Text>
                      <Box mt={2}>
                        <Tag pt="3px" variant="solid" size="lg">
                          Owned by: {token.owner.content}
                        </Tag>
                      </Box>
                    </Flex>
                  </Link>
                ))}
              </SimpleGrid>
            </>
          )}
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

export default CityDetailsPage;
