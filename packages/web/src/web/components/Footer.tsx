import { Box, Divider, Flex, Spacer, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <Flex direction="column" mt={12} height="70px" px={4} shadow="sm">
      <Divider />
      <Flex mt={4} align="center" mx="auto" width="100%" maxWidth={1200}>
        <Text mr={4} size="md">
          Copyright © 2021 by Inclined Finance, Inc. All rights reserved.
        </Text>
        <Spacer />
        <Box cursor={'pointer'} mr={3}>
          <Link
            passHref
            aria-label="Check out our insta"
            href="https://www.instagram.com/proofofres/"
          >
            <FaInstagram size={30} />
          </Link>
        </Box>
        <Box cursor={'pointer'} mr={3}>
          <Link passHref aria-label="Check out our twitter" href="https://twitter.com/proofofres">
            <FaTwitter size={30} />
          </Link>
        </Box>

        <Box cursor={'pointer'}>
          <Link aria-label="Join the discord server" passHref href="https://discord.gg/hhQfHqGTPk">
            <FaDiscord size={30} />
          </Link>
        </Box>

        <Box cursor={'pointer'} ml={3}>
          <Link
            aria-label="Check out the github code"
            passHref
            href="https://github.com/proof-of-residency"
          >
            <FaGithub size={30} />
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Footer;
