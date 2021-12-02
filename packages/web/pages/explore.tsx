import { Box, Flex, Heading, Link, SimpleGrid, Tag, Text } from '@chakra-ui/react';
import { promises as fs } from 'fs';
import Head from 'next/head';
import Image from 'next/image';
import path from 'path';
import React from 'react';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';

export type Mapping = {
  name: string;
  population: number;
  price: number;
  limit: number;
  state: string;
};

type Details = Mapping & {
  cityId: number;
  image: string;
  minted: number;
};

export const getStaticProps = async () => {
  try {
    const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
    const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const details = mappings.map((mapping, cityId) => {
      if (!mapping) {
        return { notFound: true };
      }

      const props: Details = {
        // ...meta,
        ...mapping,
        image: `https://generator.proofofresidency.xyz/previews/${cityId}.jpg`,
        cityId,
        minted: 0
      };

      return props;
    });

    return {
      props: {
        details
      },
      revalidate: 60
    };
  } catch (e) {
    return { notFound: true };
  }
};

type ExploreProps = {
  details: Details[];
};

const ExplorePage = (props: ExploreProps) => {
  return (
    <>
      <Header />
      <Flex pt="70px" width="100%" direction="column">
        <Head>
          <title>Explore | Proof of Residency</title>
        </Head>

        <Heading size="2xl" mt={6} textAlign="center">
          Explore
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
          {props.details.map((detail, i) => (
            <Link key={detail.cityId} href={`/city/${detail.cityId}`}>
              <Flex direction="column">
                <Box>
                  <Flex mt={2} mx="auto" position="relative" height={400}>
                    <Image
                      priority={i < 6}
                      objectFit="contain"
                      layout="fill"
                      placeholder="empty"
                      src={detail.image}
                      alt={`fsd`}
                    />
                  </Flex>
                </Box>
                <Text fontWeight="bold">{detail.name}</Text>
                {/* <Text mt={2} size="md">
                  {detail.state}
                </Text> */}
                <Box mt={2}>
                  <Tag pt="3px" variant="solid" size="lg">
                    {detail.minted} of {detail.limit} minted
                  </Tag>
                </Box>
              </Flex>
            </Link>
          ))}
        </SimpleGrid>
      </Flex>
      <Footer />
    </>
  );
};

export default ExplorePage;
