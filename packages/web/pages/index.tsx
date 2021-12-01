import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import WA from '../public/washington.png';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 500 });

  return (
    <>
      <Header showAction />

      <Flex minHeight="90vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="2xl" textAlign="center">
          NFT art inspired by cartography.
        </Heading>

        <Box>
          <Flex mt={2} mx="auto" position="relative" height={frameHeight}>
            <Image
              objectFit="contain"
              layout="fill"
              placeholder="blur"
              src={WA}
              alt="Washington proof of residency image"
            />
          </Flex>
        </Box>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={800}>
          <Text fontSize="2xl" mt={10} textAlign="center">
            Proof of Residency is an NFT project based on maps.
          </Text>
          <Text fontSize="lg" mt={6} textAlign="center">
            Minting is limited to one NFT per mailing address and can only be performed after
            physical mail is received, as an experiment into city-based limits on token supply.
          </Text>
          <Text fontSize="lg" mt={3} textAlign="center">
            Generative design draws upon real-world maps of hydrography and roads, with a provably
            unique "seed" per NFT stored immutably on the Ethereum blockchain. This token can be
            used as an NFT lego for other decentralized apps and serves as the first NFT to be built
            on privacy-preserving residency verification. All of our non-art code is open-source on
            Github.
          </Text>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default IndexPage;
