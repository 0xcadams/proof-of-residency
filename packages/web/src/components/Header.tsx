import { Button, Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';
import { FiGithub } from 'react-icons/fi';
import Logo from '../../public/logo.svg';

export type HeaderProps = {
  showAction?: boolean;
};

const Header = (props: HeaderProps) => {
  const router = useRouter();

  return (
    <Flex height="70px" position="absolute" left={0} top={0} right={0} px={4} shadow="sm">
      <Flex mx="auto" align="center" width="100%" maxWidth={1200}>
        <Link href="/">
          <Flex align="center">
            <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
            {/* <Heading size="md" ml={3}>
              Proof of Residency
            </Heading> */}
          </Flex>
        </Link>
        <Spacer />
        {props.showAction && (
          <Link href="/request">
            <Button size="lg">launch</Button>
          </Link>
        )}
        <Link ml={3} href="https://github.com/proof-of-residency/proof-of-residency" isExternal>
          <Button variant="outline" size="lg">
            <FiGithub size={25} />
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Header;
