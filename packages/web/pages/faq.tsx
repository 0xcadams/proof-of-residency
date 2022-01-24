import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { trackEvent } from 'src/web/mixpanel';
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
          Proof of Residency is a {'"proof of personhood"'} protocol - we send physical mail with a
          secret phrase and use a <strong>commit-reveal scheme</strong> to prove that the recipient
          is human and resides at the provided address. The physical address is kept private and
          names are not requested. The subsequently minted ERC-721 tokens are non-transferable and
          burnable.
        </>
      )
    },
    {
      q: 'What is the address verification process?',
      a: (
        <>
          We pioneered a novel way of proving humanity - the first step to the process is verifying
          that you reside at a mailing address you provide. The technical details of the process can
          be seen on our{' '}
          <strong>
            <Link href="https://github.com/proof-of-residency/proof-of-residency/blob/main/WHITEPAPER.md">
              public Github
            </Link>
          </strong>{' '}
          and can be freely copied/built upon. We preserve privacy by gathering a minimal amount of
          information. All data is stored on the blockchain and no centralized database is used.
        </>
      )
    },
    {
      q: 'How do I request a proof of residency?',
      a: (
        <>
          Minting can be performed by first requesting a Proof of Residency letter to your physical
          address. Letters are mailed via USPS First Class mail with a typical delivery time of 4 to
          6 business days for US addresses and international mailings with an additional 5 to 7
          days. Once the letter is received, the unique mnemonic you receive can be used to mint a
          token for your country.
        </>
      )
    },
    {
      q: 'What are the designs based on?',
      a: (
        <>
          We create each NFT with a generative script using{' '}
          <strong>
            <Link href="https://p5js.org/">p5js</Link>
          </strong>
          . These designs are carefully based on real-world maps of countries, with seed parameters
          for each NFT stored immutably on the blockchain. We are inspired by the incredible designs
          derived from man-made land boundaries which have evolved over the past few centuries.
        </>
      )
    },
    {
      q: 'Is minting unlimited?',
      a: (
        <>
          Minting is essentially unlimited for every country, with enough available token IDs to
          support 10^15 tokens per country. This is nearly one million times larger than {"China's"}{' '}
          current population.
        </>
      )
    },
    {
      q: 'Why is my mailing address not supported?',
      a: (
        <>
          We depend on Lob to provide mailing address verification. If you are running into trouble
          with a valid address, please email{' '}
          <strong>
            <Link href="mailto:hello@proofofresidency.xyz">hello@proofofresidency.xyz</Link>
          </strong>
          {'. We look forward to supporting your address soon!'}
        </>
      )
    },
    {
      q: 'What is the license for the artwork?',
      a: (
        <>
          We give all token-holders{' '}
          <strong>
            <Link href="https://creativecommons.org/share-your-work/public-domain/cc0/">
              exclusive permissive copyright (CC0)
            </Link>
          </strong>{' '}
          for their minted NFT. The token-holder of each piece of art may freely build upon, enhance
          and reuse the works for any purposes without restriction under copyright law.
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
              priority
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
                {({ isExpanded }) => {
                  if (isExpanded) {
                    trackEvent('Faq viewed', { question: faq.q });
                  }

                  return (
                    <>
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
                      </AccordionPanel>{' '}
                    </>
                  );
                }}
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
