import { Box, Divider, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';
import { HiOutlineNewspaper } from 'react-icons/hi';

const Footer = () => {
  return (
    <Flex direction="column" mt={12} height="70px" px={4} shadow="sm">
      <Divider />
      <Flex mt={4} align="center" mx="auto" width="100%" maxWidth={1200}>
        <Text mr={4} size="md">
          Copyright © {new Date().getFullYear()} by Inclined Finance, Inc. All rights reserved.
        </Text>
        <Spacer />

        <Box cursor={'pointer'} mr={3}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Check out our whitepaper"
            href="https://github.com/0xcadams/proof-of-residency/blob/main/WHITEPAPER.md"
          >
            <HiOutlineNewspaper size={30} />
          </a>
        </Box>

        <Box cursor={'pointer'} mr={3}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Check out our twitter"
            href="https://twitter.com/proofofres"
          >
            <FaTwitter size={30} />
          </a>
        </Box>

        <Box cursor={'pointer'} mr={3}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join the discord server"
            href="https://discord.gg/hhQfHqGTPk"
          >
            <FaDiscord size={30} />
          </a>
        </Box>

        <Box cursor={'pointer'}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Check out the github code"
            href="https://github.com/0xcadams/proof-of-residency"
          >
            <FaGithub size={30} />
          </a>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Footer;
