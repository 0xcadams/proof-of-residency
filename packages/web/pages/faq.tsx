import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Link,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import BST from '../public/boston.png';
import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

const FaqPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 400 });

  const faqs = [
    {
      q: 'What is Proof of Residency?',
      a: (
        <>
          Proof of Residency is an NFT project inspired by cartography, with a unique minting
          process that requires residency in the city you are minting for. Token holders can
          represent their city with artwork that admires the eccentricities of their city and state.
          NFTs are only available for US cities, but we are working on expanding to other countries.
        </>
      )
    },
    {
      q: 'What is the address verification process?',
      a: (
        <>
          We are pioneering a novel way of minting NFTs, and the first step to the process is
          verifying that you are minting for the city you reside in. The technical details of the
          process can be seen on our public{' '}
          <Link
            isExternal
            href="https://github.com/proof-of-residency/proof-of-residency/blob/main/WHITEPAPER.md"
          >
            Github
          </Link>
          , and can be freely copied/built upon. We preserve privacy by gathering a minimal amount
          of information and never storing any sensitive information. All data is stored on the
          blockchain and no centralized database is used.
        </>
      )
    },
    {
      q: 'How do I mint?',
      a: (
        <>
          Minting can be performed by first requesting a Proof of Residency letter to your physical
          address. Letters are mailed with via USPS First Class Mail, which has a typical delivery
          time of 4 to 6 business days. Once the letter is received, the unique code you receive can
          be used to mint an NFT for your city. NFT availability is not guaranteed by the letter,
          and there is a likelihood that the remaining NFTs will be minted while your Proof of
          Residency letter is still being delivered.
        </>
      )
    },
    {
      q: 'What are generative designs?',
      a: (
        <>
          We create each NFT with a generative script using{' '}
          <Link isExternal href="https://p5js.org/">
            p5js
          </Link>
          . These designs are carefully based on real-world maps of cities, with seed parameters for
          each NFT stored immutably on the blockchain. We are inspired by the incredible designs
          derived from man-made land boundaries which have evolved over the past few centuries.
        </>
      )
    },
    {
      q: 'How is minting limited?',
      a: (
        <>
          Minting is limited to a capped number of tokens per city. This cap is based upon
          population count - New York City and the greater Los Angeles area are capped at 200 and
          150 respectively, while smaller cities by population, such as Raleigh and New Orleans, are
          limited to 10.
        </>
      )
    },
    {
      q: 'When will you expand outside of the US?',
      a: (
        <>
          We are actively working on cities/countries outside of the US. There is a massive amount
          of artwork required for all of the great cities of the world. To show your support for a
          city which is not represented yet, please email{' '}
          <Link isExternal href="mailto:hello@proofofresidency.xyz">
            hello@proofofresidency.xyz
          </Link>
          {". We're looking forward to supporting your city soon!"}
        </>
      )
    },
    {
      q: 'What is the license for the artwork?',
      a: (
        <>
          We give all token-holders{' '}
          <Link isExternal href="https://creativecommons.org/share-your-work/public-domain/cc0/">
            exclusive permissive copyright (CC0)
          </Link>{' '}
          if they own the NFT artwork. The token-holder of each piece of art may freely build upon,
          enhance and reuse the works for any purposes without restriction under copyright law.
        </>
      )
    }
  ];

  return (
    <>
      <Header />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="4xl" textAlign="center">
          FAQ
        </Heading>

        <Box>
          <Flex mt={2} mx="auto" position="relative" height={frameHeight}>
            <Image
              objectFit="contain"
              layout="fill"
              placeholder="empty"
              src={BST}
              alt="Boston proof of residency image"
            />
          </Flex>
        </Box>

        <Flex
          mt={8}
          mb={10}
          flexDirection="column"
          mx="auto"
          align="center"
          width="100%"
          maxWidth={800}
        >
          <Accordion defaultIndex={[0]} width="100%">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q}>
                <h2>
                  <AccordionButton>
                    <Heading flex="1" textAlign="left" size="lg" py={2}>
                      {faq.q}
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel py={4}>
                  <Text>{faq.a}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default FaqPage;
