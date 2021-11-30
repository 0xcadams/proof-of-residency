import { Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import Logo from '../public/washington.png';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 400, md: 600 });

  return (
    <>
      <Header showAction />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} textAlign="center">
          Inspired by the physical studies of hydrography and transportation.
        </Heading>

        <Flex position="relative" height={frameHeight}>
          <Flex maxWidth={1000}>
            <Image
              objectFit="contain"
              layout="fill"
              placeholder="blur"
              src={Logo}
              alt="Washington proof of residency image"
            />
          </Flex>
        </Flex>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={800}>
          <Text fontSize="lg" mt={10} textAlign="center">
            Proof of Residency is a study of the physical blended with the virtual - positioned at
            the nexus of the two. Generative design draws upon real-world constructs and content
            stored immutably on the Ethereum blockchain. Minting can only be performed by residents
            of the geographical location, as an experiment into physical address-based limits on
            token supply. Further, this token can be used as an NFT lego for other decentralized
            apps to validate residency in an area.
          </Text>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default IndexPage;
