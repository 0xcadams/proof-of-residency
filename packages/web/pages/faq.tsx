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
import React from 'react';
import NY from '../public/new-york.png';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';

const FaqPage = () => {
  const frameHeight = useBreakpointValue({ base: 300, md: 400 });

  const faqs = [
    {
      q: 'What is Proof of Residency?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'What is the address verification process?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'How do I mint?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'What are generative designs?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'How is minting limited?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'When will you expand outside of the US?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    },
    {
      q: 'What is the license for the artwork?',
      a: 'Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform.'
    }
  ];

  return (
    <>
      <Header showAction />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="4xl" textAlign="center">
          FAQ
        </Heading>

        <Box>
          <Flex mt={2} mx="auto" position="relative" height={frameHeight}>
            <Image
              objectFit="contain"
              layout="fill"
              placeholder="blur"
              src={NY}
              alt="New york proof of residency image"
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
              <AccordionItem>
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
