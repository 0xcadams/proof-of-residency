import { Box, Flex, Heading, useBreakpointValue, Text, ResponsiveValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import Header from 'src/web/components/Header';
import LandingImage from '../public/804.png';
import Footer from '../src/web/components/Footer';

const IndexPage = () => {
  const frameHeight = useBreakpointValue({ base: 400, md: 600 }, 'md');
  const headingSize = useBreakpointValue({ base: '6xl', md: '8xl' }, 'md');
  const justify = useBreakpointValue<ResponsiveValue<'center' | 'end'>>(
    { base: 'center', md: 'end' },
    'center'
  );

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
            textAlign="start"
          >
            Proof of personhood for ethereum
          </Heading>
          <Flex
            zIndex={-2}
            maxWidth={'100%'}
            position="absolute"
            right={0}
            width={800}
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
        <Flex maxWidth={1200} justifyContent={justify} mx="auto" mt="80px">
          <Flex maxWidth={800} direction="column">
            <Heading textAlign={justify} fontSize="3xl">
              The proof of personhood protocol built on physical mail.
            </Heading>

            <Text textAlign={justify} fontSize="xl" mt={8}>
              We send mail with a randomly generated phrase and use a {'"commitment scheme"'} to
              ensure that the recipient is a real human. Privacy is the first priority - information
              is kept private and no names are requested. Live on Ethereum, Arbitrum, Optimism, and
              Polygon.
            </Text>

            <Text textAlign={justify} fontSize="md" mt={8}>
              We dedicate 10% of the revenue from this project to be donated to Make-A-Wish®.
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Footer />
    </>
  );
};

export default IndexPage;
