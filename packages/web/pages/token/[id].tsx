import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Skeleton,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react';
import { promises as fs } from 'fs';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import numeral from 'numeral';

import Footer from '../../src/components/Footer';
import Header from '../../src/components/Header';

export type Attribute = {
  trait_type:
    | 'State'
    | 'City'
    | 'Country'
    | 'State Iterations'
    | 'State Color'
    | 'Outline Color'
    | 'Background'
    | 'Type'
    | 'Type Iterations';
  value: string | number;
  display_type?: 'date';
};

export type MetadataResponse = {
  description: string;
  external_url: string;
  background_color: string;
  image: string;
  name: string;
  tags: string[];
  attributes: Attribute[];
};

export type Mapping = {
  name: string;
  population: number;
  price: number;
  limit: number;
  state: string;
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
        const params: Params = { id: (cityId * 1e3 + tokenCount).toFixed(0) };

        return { params };
      });
    }),

    fallback: false
  };
};

type DetailsProps = Mapping &
  MetadataResponse & {
    tokenId: number;
  };

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const tokenId = Number.parseInt(params?.id ?? '-1');

  if (tokenId === -1 || !process.env.NEXT_PUBLIC_CID_METADATA) {
    return { notFound: true };
  }

  try {
    const res = await fetch(
      `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
    );
    const meta: MetadataResponse = await res.json();

    const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
    const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const mapping = mappings.find((p) => meta.attributes.some((a) => a.value === p.name)) ?? null;

    if (!mapping) {
      return { notFound: true };
    }

    const props: DetailsProps = {
      ...meta,
      ...mapping,
      image: `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/${tokenId}.html`,
      tokenId
    };

    return {
      props
    };
  } catch (e) {
    return { notFound: true };
  }
};

const NftDetailsPage = (props: DetailsProps) => {
  // const mintRatio = 1 / 79693;

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
    ...(props.population
      ? [
          {
            name: 'Total Population',
            content: `${numeral(props.population).format('0,0')}`,
            link: 'https://en.wikipedia.org/wiki/Metropolitan_statistical_area',
            tooltip: 'The population over 18 y.o. in the city in 2020.'
          }
        ]
      : []),
    ...(props.limit
      ? [
          {
            name: 'Mint Limit',
            content: `${numeral(props.limit).format('0,0')}`,
            tooltip: 'The limit on number of tokens able to be minted for this city.'
          }
        ]
      : []),
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

        {typeof window === 'undefined' ? (
          <Skeleton height={450} width="100%" />
        ) : (
          <iframe
            sandbox="allow-scripts allow-downloads"
            allowFullScreen={false}
            allow="xr-spatial-tracking"
            src={props.image}
            style={{ height: 450, width: '100%' }}
          />
        )}

        <Divider mx={4} />

        <Heading size="lg" mt={6} textAlign="center">
          {props.name}
        </Heading>

        <SimpleGrid
          px={4}
          columns={{ base: 1, md: 2 }}
          spacing={4}
          maxWidth={1200}
          width="100%"
          alignContent="center"
          mx="auto"
          mt={4}
        >
          <Flex direction="column" mt={2} flex={1}>
            {props.description && (
              <Text fontSize="lg" width="100%">
                {props.description}
              </Text>
            )}
            <SimpleGrid mt={8} mb={8} columns={2} spacing={4}>
              {tags.map((tag) => (
                <Flex key={tag.name} direction="column">
                  <Text fontWeight="bold" fontSize="lg">
                    {tag.name}
                  </Text>
                  <Tooltip label={tag.tooltip}>
                    {tag.link ? (
                      <Link mt={2} href={tag.link} isExternal>
                        <Tag pt="3px" variant="solid" size="lg">
                          {tag.content}
                        </Tag>
                      </Link>
                    ) : (
                      <Box mt={2}>
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

          <Flex flex={1}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Feature</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.attributes.map((attribute) => (
                  <Tr key={attribute.trait_type}>
                    <Td>{attribute.trait_type}</Td>
                    <Td>{attribute.value}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </SimpleGrid>
      </Flex>
      <Footer />
    </>
  );
};

export default NftDetailsPage;
