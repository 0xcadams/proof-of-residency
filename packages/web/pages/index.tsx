import { Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LandingImage from '../public/russia.png';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 500 }, 'md');

  return (
    <>
      <Header />

      <Flex minHeight="90vh" pt="70px" width="100%" direction="column" px={4}>
        <Flex mt={2} mb={4} mx="auto" position="relative" width="100%" height={frameHeight}>
          <Image
            priority
            objectFit="contain"
            layout="fill"
            src={LandingImage}
            alt="Proof of residency image of russia"
          />
        </Flex>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={800}>
          <Text fontSize="2xl" mt={10} textAlign="center">
            Proof of Residency is a protocol to support decentralized governance, Universal Basic
            Income, unique identity, and many other applications.
          </Text>

          <Text fontSize="lg" mt={8} textAlign="center">
            A privacy-focused, Sybil-resistant proof of personhood protocol which issues
            non-transferable NFTs based on physical mailing addresses. We perform a reverse Turing
            test by sending mail with a secret phrase and use a{' '}
            <strong>
              <Link
                aria-label="Commitment scheme wiki"
                href="https://en.wikipedia.org/wiki/Commitment_scheme"
              >
                commitment scheme
              </Link>
            </strong>{' '}
            to ensure that the recipient resides at the provided address. Privacy is the first
            priority - your address is kept private and real names are not requested.
            Decentralization and community ownership is built into the protocol.
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
