import { Button, Flex, Link, Spacer, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { FiGithub } from 'react-icons/fi';
import Logo from '../../public/logo.svg';

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false });
  const buttonSize = isMobile ? 'md' : 'lg';

  return (
    <Flex height="70px" position="absolute" left={0} top={0} right={0} px={4} shadow="sm">
      <Flex mx="auto" align="center" width="100%" maxWidth={1200}>
        <Link href="/">
          <Flex align="center">
            <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
          </Flex>
        </Link>
        <Spacer />

        <Link href="/request">
          <Button size={buttonSize}>mint</Button>
        </Link>
        <Link ml={3} href="/explore">
          <Button variant="outline" size={buttonSize}>
            explore
          </Button>
        </Link>
        <Link ml={3} href="/faq">
          <Button variant="outline" size={buttonSize}>
            faq
          </Button>
        </Link>

        {!isMobile && (
          <Link ml={3} href="https://github.com/proof-of-residency" isExternal>
            <Button variant="outline" size={buttonSize}>
              <FiGithub size={25} />
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
