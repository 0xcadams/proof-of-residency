import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useBreakpointValue
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaBars, FaLocationArrow, FaQuestion, FaSearch } from 'react-icons/fa';
import { ProofOfResidencyNetwork } from 'src/contracts';
import useSWR from 'swr';
import { GetTokensForOwnerResponse } from 'types';
import { useNetwork } from 'wagmi';

import Logo from '../../../public/logo.svg';
import { useHasCommitment, useWalletAddress } from '../hooks';
import { CustomConnectButton } from './CustomConnectButton';

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, md: false }, 'sm');

  const [token, setToken] = useState<{
    chain: ProofOfResidencyNetwork;
    id: string;
  } | null>();

  const walletAddress = useWalletAddress();
  const { chain } = useNetwork();

  const hasCommitment = useHasCommitment();

  const verbiage = useMemo(
    () => (token ? 'tokens' : hasCommitment ? 'claim' : 'request'),
    [token, hasCommitment]
  );
  const actionLink = useMemo(
    () =>
      verbiage === 'claim'
        ? '/mint'
        : verbiage === 'tokens' && walletAddress
        ? `/user/${walletAddress.toLowerCase()}`
        : `/request`,
    [verbiage, walletAddress]
  );

  const { data } = useSWR<GetTokensForOwnerResponse>(`/tokens/${walletAddress}`);

  useEffect(() => {
    if ((data?.length ?? 0) > 0 && data?.[0]) {
      return setToken({ chain: data[0].chain, id: data[0].id });
    }
  }, [data]);

  return (
    <Flex height="70px" position="absolute" left={0} top={0} right={0} px={4} shadow="sm">
      <Flex mx="auto" align="center" width="100%" maxWidth={1200}>
        <Box cursor="pointer">
          <Link href="/" passHref>
            <Flex align="center" minW="48px" minH="48px">
              <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
            </Flex>
          </Link>
        </Box>
        {!isMobile && (
          <Flex align="center" ml={4}>
            <Link href="/explore" passHref>
              <Button ml={2} variant="ghost">
                explore
              </Button>
            </Link>
            <Link href="/faq" passHref>
              <Button ml={2} variant="ghost">
                faq
              </Button>
            </Link>
          </Flex>
        )}
        <Spacer />
        <Flex align="center" ml={{ base: 3, sm: 1 }}>
          {walletAddress && !chain?.unsupported && !isMobile && (
            <Link href={actionLink} passHref>
              <Button isLoading={hasCommitment === null} mr={3} variant="solid">
                {verbiage}
              </Button>
            </Link>
          )}

          <CustomConnectButton />

          {isMobile && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FaBars />}
                variant="outline"
                ml={3}
              />
              <MenuList bgColor="black">
                <Link href={actionLink} passHref>
                  <MenuItem icon={<FaLocationArrow />}>{verbiage}</MenuItem>
                </Link>
                <Link href="/explore" passHref>
                  <MenuItem icon={<FaSearch />}>explore</MenuItem>
                </Link>
                <Link href="/faq" passHref>
                  <MenuItem icon={<FaQuestion />}>faq</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
