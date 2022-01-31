import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 500 });

  return (
    <>
      <Header />

      <Flex minHeight="90vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="2xl" textAlign="center">
          Blockchain proof of personhood using physical mail
        </Heading>

        <Box>
          <Flex mt={10} mb={4} mx="auto" position="relative" height={frameHeight}>
            <Image
              priority
              objectFit="contain"
              layout="fill"
              src="/russia.png"
              alt="Proof of residency image"
            />
          </Flex>
        </Box>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={800}>
          <Text fontSize="2xl" mt={10} textAlign="center">
            Proof of Residency is a protocol to support decentralized governance, Universal Basic
            Income, unique identity, and many other applications.
          </Text>

          <Text fontSize="lg" mt={8} textAlign="center">
            This project is a Sybil-resistant proof of personhood protocol which issues
            non-transferable ERC-721 tokens (NFTs) based on physical mailing addresses. We send mail
            with a secret phrase and use a{' '}
            <strong>
              <Link
                aria-label="Commitment scheme wiki"
                href="https://en.wikipedia.org/wiki/Commitment_scheme"
              >
                commitment scheme
              </Link>
            </strong>{' '}
            to ensure that the recipient resides at the provided address. The address is kept
            private and names are not requested.
          </Text>

          <Text fontSize="md" mt={8} textAlign="center">
            All of our code is open-source on Github under an MIT license for future projects to
            build upon. We dedicate 15% of the revenue from this project to be donated to the
            Make-A-Wish Foundation.
          </Text>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default IndexPage;
