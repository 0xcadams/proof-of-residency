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

export const getStaticPaths: GetStaticPaths = async () => {
  const mappingFile = path.join(process.cwd(), 'sources/mapping.json');
  const mappings: { name: string; paths: string[] }[] = JSON.parse(
    (await fs.readFile(mappingFile, 'utf8')).toString()
  );

  const locPaths: string[][] = [];

  const tokenIds = [...Array(2)].map((_, i) => i);

  mappings.forEach((mapping, index) =>
    mapping.paths.forEach((path, pathIndex) => {
      locPaths.push([index.toString(), pathIndex.toString()]);
    })
  );

  return {
    paths: tokenIds.flatMap((t, tokenId) =>
      locPaths.map((locPath) => ({
        params: { id: tokenId.toString(), loc: locPath }
      }))
    ),

    fallback: 'blocking'
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
  loc: string[];
}

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const stateId = Number.parseInt(params?.loc?.[0]?.toString() ?? '0');

  const cityId = Number.parseInt(params?.loc?.[1]?.toString() ?? '-1');

  const tokenId = Number.parseInt(params?.id ?? '12');

  const res = await fetch(
    `https://generator.proofofresidency.xyz/api/${tokenId}/${stateId}/${cityId}`
  );
  const meta: MetadataResponse = await res.json();

  const populationFile = path.join(process.cwd(), 'sources/population.json');
  const populations: { name: string; population: number }[] = JSON.parse(
    (await fs.readFile(populationFile, 'utf8')).toString()
  );

  const theoreticalLimit =
    populations.find((p) => meta.attributes.some((a) => a.value === p.name))?.population ?? null;

  return {
    props: {
      ...meta,
      stateId,
      cityId,
      tokenId,
      theoreticalLimit
    },
    revalidate: 60
  };
};

const NftDetailsPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const tags = [
    {
      name: 'License',
      link: 'https://creativecommons.org/publicdomain/zero/1.0/',
      content: 'CCO: No Rights Reserved'
    },
    {
      name: 'Initial Price',
      content: '0.1Ξ'
    },
    {
      name: 'Created By',
      content: 'Generative Script'
    },
    ...(props.theoreticalLimit
      ? [
          {
            name: 'Theoretical Mint Limit',
            content: `${numeral(props.theoreticalLimit).format('0,0')}`,
            link: 'https://en.wikipedia.org/wiki/Metropolitan_statistical_area',
            tooltip: 'The population over 18 y.o. in the city in 2020.'
          },
          {
            name: 'Likely Mint Limit',
            content: `${numeral(props.theoreticalLimit * 0.028).format('0,0')}`,
            link: 'https://www.finder.com/nft-statistics',
            tooltip:
              'The population over 18 y.o. in the city in 2020, who has historically bought/sold an NFT.'
          }
        ]
      : [])
    // {
    //   name: 'Owned By',
    //   content: 'None'
    // }
  ];

  return (
    <>
      <Header showAction />
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
