import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import haversine, { CoordinateLongitudeLatitude } from 'haversine';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';

import { GetTokensForOwnerResponse, VerifyAddressResponse } from 'types';

import { NextSeo } from 'next-seo';
import numeral from 'numeral';
import { FaBars, FaLocationArrow, FaQuestion, FaSearch } from 'react-icons/fa';
import { AddressModal } from 'src/web/components/AddressModal';
import { ConfirmModal } from 'src/web/components/ConfirmModal';
import { CustomConnectButton } from 'src/web/components/CustomConnectButton';
import { InfoModal } from 'src/web/components/InfoModal';
import {
  useGetCommitmentPeriodIsUpcoming,
  useStatusAndChainUnsupported,
  useWalletAddress
} from 'src/web/hooks';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';
import Logo from '../public/logo.svg';

const Map = ReactMapboxGl({
  interactive: false,
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
});

const styles: { [key: string]: React.CSSProperties } = {
  marker: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#eaddf9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #b69ccb'
  },
  markerAddress: {
    cursor: 'pointer',
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid black'
  }
};

const RequestPage = () => {
  const [latLng, setLatLng] = useState<CoordinateLongitudeLatitude | null>(null);
  const [address, setAddress] = useState<VerifyAddressResponse | null>(null);

  const commitmentPeriodIsUpcoming = useGetCommitmentPeriodIsUpcoming();
  const statusAndChainUnsupported = useStatusAndChainUnsupported();

  const {
    isOpen: isOpenAddressModal,
    onOpen: onOpenAddressModal,
    onClose: onCloseAddressModal
  } = useDisclosure();
  const {
    isOpen: isOpenInfoModal,
    onOpen: onOpenInfoModal,
    onClose: onCloseInfoModal
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal
  } = useDisclosure();

  const toast = useToast();

  const { chain } = useNetwork();
  const walletAddress = useWalletAddress();

  const { data: allTokens } = useSWR<GetTokensForOwnerResponse>(`/tokens/${walletAddress ?? ''}`);

  const hasTokenOnCurrentNetwork = useMemo(
    () => (allTokens ?? []).some((t) => t.chain === chain?.id ?? -1),
    [allTokens, chain?.id]
  );

  useEffect(() => {
    if (!commitmentPeriodIsUpcoming) {
      if (!navigator.geolocation) {
        toast({
          title: 'Error',
          description: 'Geolocation is not supported by your browser.',
          status: 'error'
        });
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatLng({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          () => {
            toast({
              title: 'Error',
              description: 'You must enable geolocation in order to use this service.',
              status: 'error'
            });
          }
        );
      }
    }
  }, []);

  const onSuccess = (address: VerifyAddressResponse) => {
    if (address?.latitude && address?.longitude && latLng?.latitude && latLng?.longitude) {
      // this is silly, but we're checking in-browser since this value can always be spoofed - don't tell anyone!
      const distance = haversine(
        { longitude: address.longitude, latitude: address.latitude },
        { longitude: latLng.longitude, latitude: latLng.latitude }
      );

      // ten kilometers
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && distance > 10) {
        toast({
          title: 'Error',
          description: `You are ${numeral(distance).format(
            '0,0'
          )}km away from the address - must be located within 10km.`,
          status: 'error'
        });

        setAddress(null);

        return;
      }
    }

    setAddress({
      ...address
    });

    onCloseAddressModal();
    onOpenConfirmModal();
  };

  return (
    <>
      <NextSeo title={`Request | Proof of Residency`} />

      <Box cursor="pointer" zIndex={500} position="absolute" left={4} top={4}>
        <Flex align="center" flexDirection="row">
          <Link href="/" passHref>
            <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
          </Link>
        </Flex>
      </Box>
      <Box zIndex={500} position="absolute" right={4} top={4}>
        <Flex>
          <Box mr={3}>
            <CustomConnectButton />
          </Box>
          <Menu>
            <MenuButton as={IconButton} aria-label="Options" icon={<FaBars />} variant="outline" />
            <Portal>
              <MenuList bgColor="black">
                {(allTokens?.length ?? 0) > 0 && walletAddress && (
                  <Link href={`/user/${walletAddress.toLowerCase()}`} passHref>
                    <MenuItem icon={<FaLocationArrow />}>tokens</MenuItem>
                  </Link>
                )}
                <Link href="/explore" passHref>
                  <MenuItem icon={<FaSearch />}>explore</MenuItem>
                </Link>
                <Link href="/faq" passHref>
                  <MenuItem icon={<FaQuestion />}>faq</MenuItem>
                </Link>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Box>

      <Box zIndex={500} position="absolute" right={4} bottom={4}>
        <Button size="lg" colorScheme="gray" onClick={onOpenInfoModal} mr={2}>
          More Info
        </Button>
        <Tooltip
          label={
            hasTokenOnCurrentNetwork
              ? 'You have a PORP on the current network - please switch to claim another'
              : statusAndChainUnsupported.status !== 'success'
              ? 'Connect to your wallet to use this app'
              : !latLng
              ? 'You must enable geolocation'
              : commitmentPeriodIsUpcoming
              ? 'Your letter is on the way!'
              : undefined
          }
          shouldWrapChildren
        >
          <Button
            size="lg"
            onClick={address ? onOpenConfirmModal : onOpenAddressModal}
            disabled={
              hasTokenOnCurrentNetwork ||
              statusAndChainUnsupported.status !== 'success' ||
              statusAndChainUnsupported.connectionRejected ||
              !latLng ||
              Boolean(commitmentPeriodIsUpcoming)
            }
          >
            {address ? 'Confirm Address' : 'Claim Address'}
          </Button>
        </Tooltip>
      </Box>
      <Map
        style="mapbox://styles/chase-adams-asu/ckwmoa4oo244t14mdno6kg6e7"
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        zoom={latLng ? [14] : [4]}
        center={latLng ? [latLng.longitude, latLng.latitude] : [-98.5795, 39.8283]}
      >
        {latLng ? (
          <Marker style={styles.marker} coordinates={[latLng.longitude, latLng.latitude]} />
        ) : (
          <></>
        )}
        {address?.longitude && address?.latitude ? (
          <Marker
            onClick={!commitmentPeriodIsUpcoming ? onOpenConfirmModal : () => {}}
            style={styles.markerAddress}
            coordinates={[address.longitude, address.latitude]}
          />
        ) : (
          <></>
        )}
      </Map>
      {latLng && (
        <AddressModal
          onSuccess={onSuccess}
          isOpen={isOpenAddressModal}
          onClose={() => {
            setAddress(null);
            onCloseAddressModal();
          }}
        />
      )}
      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />
      {address && latLng && (
        <ConfirmModal
          geolocation={latLng}
          isOpen={isOpenConfirmModal}
          onClose={async () => {
            setAddress(null);
            onCloseConfirmModal();
            onOpenAddressModal();
          }}
          address={address}
        />
      )}
    </>
  );
};

export default RequestPage;
