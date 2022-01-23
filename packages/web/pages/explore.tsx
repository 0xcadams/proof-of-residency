import { Box, Flex, Heading, SimpleGrid, Tag, Text } from '@chakra-ui/react';
import { promises as fs } from 'fs';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';
import React from 'react';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';
import { getMintedCount } from '../src/web/hooks/useProofOfResidency';
import { Mapping } from '../types/mapping';

type Details = Mapping & {
  cityId: number;
  image: string;
  minted: number;
};

export const getStaticProps = async () => {
  try {
    const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
    const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    const details = await Promise.all(
      mappings.map(async (mapping, cityId) => {
        if (!mapping) {
          return { notFound: true };
        }

        const mintedCount = await getMintedCount(cityId);

        const props: Details = {
          ...mapping,
          image: `/previews/${cityId}.png`,
          cityId,
          minted: mintedCount.toNumber()
        };

        return props;
      })
    );

    return {
      props: {
        details
      },
      revalidate: 600
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
        <NextSeo title={`Explore | Proof of Residency`} />

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
            <Link key={detail.cityId} href={`/city/${detail.cityId}`} passHref>
              <Flex cursor="pointer" direction="column">
                <Box>
                  <Flex mt={2} mx="auto" position="relative" height={400}>
                    <Image
                      priority={i < 6}
                      objectFit="contain"
                      layout="fill"
                      placeholder="empty"
                      src={detail.image}
                      alt={detail.name}
                    />
                  </Flex>
                </Box>
                <Text fontWeight="bold">{detail.name}</Text>
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
