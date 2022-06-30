import { Box, Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import Header from 'src/web/components/Header';
import LandingImage from '../public/804.png';
import Footer from '../src/web/components/Footer';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 400, md: 600 }, 'md');
  const headingSize = useBreakpointValue({ base: '6xl', md: '8xl' }, 'md');

  return (
    <>
      <Header />
      <Box mx={4}>
        <Flex
          maxWidth={1200}
          pt="70px"
          width="100%"
          mx="auto"
          zIndex={-1}
          position="relative"
          align="center"
          height={frameHeight}
          mb={8}
        >
          <Heading
            maxWidth={1000}
            textTransform="uppercase"
            fontSize={headingSize}
            // mt={12}

            textAlign="start"
          >
            Proof of personhood for ethereum
          </Heading>
          <Flex
            // mt={2}
            // mb={4}
            zIndex={-2}
            maxWidth={'100%'}
            position="absolute"
            right={0}
            width={1000}
            height={'100%'}
          >
            <Image
              priority
              objectFit="contain"
              objectPosition="right center"
              layout="fill"
              src={LandingImage}
              alt="Proof of residency image of Ukraine"
            />
          </Flex>
        </Flex>
        <Flex maxWidth={1200} mx="auto" justify="center" mt="80px">
          <Flex align="center">
            {/* <Image src={MailIcon} alt="Proof of residency logo" width={80} height={80} /> */}
            <Heading ml={6} fontSize="3xl" textAlign="center">
              The proof of personhood protocol built on physical mail.
            </Heading>
          </Flex>
        </Flex>

        <Flex mb={10} flexDirection="column" mx="auto" align="center" width="100%" maxWidth={1000}>
          <Heading fontSize="2xl" mt={8} textAlign="center">
            We send mail with a secret phrase and use a commitment scheme to ensure that the
            recipient resides at the provided address. Privacy is the first priority - addresses are
            kept private and real names are not requested.
          </Heading>
          {/* 
          <Text fontSize="md" mt={8} textAlign="center">
            All of our code is open-source on Github. We dedicate 10% of the revenue from this
            project to be donated to Make-A-Wish®.
          </Text> */}
        </Flex>
      </Box>

      <Footer />
    </>
  );
};

export default IndexPage;
