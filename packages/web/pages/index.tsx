import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import WA from '../public/washington.png';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 500 });

  return (
    <>
      <Header />

      <Flex minHeight="90vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="2xl" textAlign="center">
          NFT art inspired by cartography.
        </Heading>

        <Box>
          <Flex mt={2} mx="auto" position="relative" height={frameHeight}>
            <Image
              objectFit="contain"
              layout="fill"
              placeholder="empty"
              src={WA}
              alt="Washington proof of residency image"
            />
          </Flex>
        </Box>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={800}>
          <Text fontSize="2xl" mt={10} textAlign="center">
            Proof of Residency is an NFT design project based on maps.
          </Text>
          <Text fontSize="lg" mt={6} textAlign="center">
            Minting is limited to one NFT per mailing address and can only be completed after
            physical mail is received, as a first-ever experiment into city-based limits on token
            supply. Each US city has a mint cap based on population size; e.g. Boston is capped at
            50.
          </Text>
          <Text fontSize="lg" mt={3} textAlign="center">
            {`Generative design draws upon real-world maps of hydrography and roads, with a provably
            unique "seed" per NFT stored immutably on the Ethereum blockchain. This is the first
            token to limit issuance based on privacy-preserving residency verification. All of our
            non-artistic code is open-source on Github, for future projects to build upon.`}
          </Text>
          <Text fontSize="md" mt={6} textAlign="center">
            We dedicate 15% of the revenue from this project to be donated to the Make-A-Wish
            Foundation.
          </Text>
          <Text fontWeight="bold" fontSize="md" mt={1} textAlign="center">
            Launching February 1st, 2022 at 9am PST.
          </Text>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default IndexPage;
