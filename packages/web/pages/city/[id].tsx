import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Tag,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { promises as fs } from 'fs';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import numeral from 'numeral';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import Footer from '../../src/components/Footer';
import Header from '../../src/components/Header';

export type Mapping = {
  name: string;
  population: number;
  price: number;
  limit: number;
  state: string;
};

type CityDetailsProps = Mapping & {
  cityId: number;
  image: string;
  minted: number;
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

    if (!mapping || !process.env.NEXT_PUBLIC_CID_CONTENT) {
      return { notFound: true };
    }

    const props: CityDetailsProps = {
      ...mapping,
      cityId,
      image: `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/previews/${cityId}.png`,
      minted: 0
    };

    return {
      props
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
    // {
    //   name: 'Owned By',
    //   content: 'None' TODO
    // }
  ];

  return (
    <>
      <Header />
      <Flex pt="70px" width="100%" direction="column">
        <Head>
          <title>{props.name} | Proof of Residency</title>
        </Head>
        <Box>
          <Flex mx="auto" position="relative" height={500}>
            <Image
              priority
              objectFit="contain"
              layout="fill"
              placeholder="empty"
              src={props.image}
              alt={`fsd`}
            />
          </Flex>
        </Box>

        <Divider mx={4} />

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
                    <Link mt={1} href={tag.link} isExternal>
                      <Tag pt="3px" variant="solid" size="lg">
                        {tag.content}
                      </Tag>
                    </Link>
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
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

export default CityDetailsPage;
