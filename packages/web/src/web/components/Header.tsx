import { Badge, Box, Button, Flex, Spacer, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiGithub } from 'react-icons/fi';

import Logo from '../../../public/logo.svg';
import { useNetworkName } from '../hooks';

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false });
  const buttonSize = isMobile ? 'md' : 'lg';

  const network = useNetworkName();

  return (
    <Flex height="70px" position="absolute" left={0} top={0} right={0} px={4} shadow="sm">
      <Flex mx="auto" align="center" width="100%" maxWidth={1200}>
        <Box cursor="pointer">
          <Link href="/" passHref>
            <Flex align="center">
              <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
            </Flex>
          </Link>
        </Box>
        {network !== 'homestead' && (
          <Badge fontSize="md" ml={3}>
            Connected to {network ?? 'Unknown'}
          </Badge>
        )}

        <Spacer />

        {/* <Link href="/request"> */}
        <Button disabled size={buttonSize}>
          mint
        </Button>
        {/* </Link> */}
        <Link href="/explore" passHref>
          <Button ml={3} variant="outline" size={buttonSize}>
            explore
          </Button>
        </Link>
        <Link href="/faq" passHref>
          <Button ml={3} variant="outline" size={buttonSize}>
            faq
          </Button>
        </Link>

        {!isMobile && (
          <Link href="https://github.com/proof-of-residency" passHref>
            <Button ml={3} variant="outline" size={buttonSize}>
              <FiGithub size={25} />
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
