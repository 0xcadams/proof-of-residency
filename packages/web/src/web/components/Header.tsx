import { Badge, Box, Button, Flex, Spacer, Tooltip, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FiGithub } from 'react-icons/fi';

import Logo from '../../../public/logo.svg';
import {
  useGetCommitmentPeriodIsValid,
  useHasTokenId,
  useNetworkName,
  useProviderExists
} from '../hooks';

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false }, 'sm');
  const buttonSize = isMobile ? 'md' : 'lg';

  const network = useNetworkName();
  const providerExists = useProviderExists();
  const commitmentPeriodIsValid = useGetCommitmentPeriodIsValid();
  const hasTokenId = useHasTokenId();

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
        {process.env.NODE_ENV === 'development' && (
          <Badge fontSize="md" ml={3}>
            {network ? network : 'Unknown'}
          </Badge>
        )}

        <Spacer />

        <Tooltip
          label={
            'Coming soon!'
            // !providerExists
            //   ? 'You must install Metamask to use this app.'
            //   : process.env.NODE_ENV !== 'development'
            //   ? 'Coming soon!'
            //   : undefined
          }
          shouldWrapChildren
        >
          <Link
            href={
              commitmentPeriodIsValid ? '/mint' : hasTokenId ? `/token/${hasTokenId}` : '/request'
            }
            passHref
          >
            <Button
              disabled={process.env.NODE_ENV !== 'development' || !providerExists}
              size={buttonSize}
            >
              {hasTokenId ? 'proof' : 'mint'}
            </Button>
          </Link>
        </Tooltip>
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
