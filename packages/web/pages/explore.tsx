import { Box, Flex, Heading, SimpleGrid, Tag, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

// imports from API
import { getCurrentMintedCount } from 'src/api/ethers';

import { getAllCountries } from 'src/web/token';
import { Country } from 'iso-3166-1/dist/iso-3166';
import { getPopulationForAlpha3 } from 'src/web/populations';

type Details = {
  country: Country;
  image: string;
  minted: number;
  population: number;
};

export const getStaticProps = async () => {
  try {
    const details = await Promise.all(
      getAllCountries().map(async (country) => {
        const mintedCount = await getCurrentMintedCount(Number(country.numeric));

        const population = getPopulationForAlpha3(country.alpha3);

        const props: Details = {
          image: `/previews/${Number(country.numeric)}.png`,
          country,
          population: population ?? 0,
          minted: mintedCount.toNumber()
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
                <Text fontWeight="bold">{detail.country.country}</Text>
                <Box mt={2}>
                  <Tag pt="3px" variant="solid" size="lg">
                    {detail.minted} minted
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
