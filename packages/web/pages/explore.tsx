import { Box, Flex, Heading, SimpleGrid, Tag, Tooltip } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Footer from '../src/web/components/Footer';

// imports from API
import { getAllTokens } from 'src/api/subgraph';

import { CountryIso, getAllCountries } from 'src/web/token';
import { getPopulationForAlpha3 } from 'src/web/populations';
import Header from 'src/web/components/Header';
import { FaInfoCircle } from 'react-icons/fa';

type Details = {
  country: CountryIso;
  image: string;
  minted: number;
  population: number;
};

export const getStaticProps = async () => {
  try {
    const allTokens = await getAllTokens();

    const details = await Promise.all(
      getAllCountries().map(async (country) => {
        const population = getPopulationForAlpha3(country.alpha3);

        const mintedCount = allTokens.filter((t) => t.country === Number(country.numeric)).length;

        const props: Details = {
          image: `/previews/${Number(country.numeric)}.png`,
          country,
          population: population ?? 0,
          minted: mintedCount
        };

        return props;
      })
    );

    const detailsSorted = details.sort((a, b) => b.population - a.population);

    return {
      props: {
        details: detailsSorted
      },
      revalidate: 600
    };
  } catch (e) {
    console.error(e);
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

        <Heading fontSize="6xl" mt={6} textAlign="center">
          Explore
        </Heading>

        <SimpleGrid
          mx="auto"
          width="100%"
          maxWidth={1200}
          mt={6}
          mb={8}
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
        >
          {props.details.map((detail, i) => (
            <Link key={detail.country.alpha3} href={`/country/${detail.country.alpha3}`} passHref>
              <Flex cursor="pointer" direction="column">
                <Box>
                  <Flex mt={2} mx="auto" position="relative" height={400}>
                    <Image
                      priority={i < 6}
                      objectFit="contain"
                      layout="fill"
                      placeholder="empty"
                      src={detail.image}
                      alt={detail.country.country}
                    />
                  </Flex>
                </Box>
                <Box textAlign="center">
                  <Heading fontSize="2xl">{detail.country.country}</Heading>
                  <Box mt={3}>
                    <Tooltip label="The amount of NFTs which have been minted across all supported chains">
                      <Tag variant="solid" size="lg">
                        {detail.minted}
                        {' total minted'}
                        <Box as={FaInfoCircle} ml={1} />
                      </Tag>
                    </Tooltip>
                  </Box>
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
