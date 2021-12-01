import { Box, Button, Link, useDisclosure, useToast } from '@chakra-ui/react';
import { CoordinateLongitudeLatitude } from 'haversine';
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiGithub } from 'react-icons/fi';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import Logo from '../public/logo.svg';
import { VerifyUsAddressResponse } from '../src/api/services/lob';
import { AddressModal } from '../src/components/AddressModal';
import { ConfirmModal } from '../src/components/ConfirmModal';
import { InfoModal } from '../src/components/InfoModal';

const Map = ReactMapboxGl({
  interactive: false,
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
});

const styles: { [key: string]: React.CSSProperties } = {
  marker: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: '#eaddf9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #b69ccb'
  },
  markerAddress: {
    cursor: 'pointer',
    width: 15,
    height: 15,
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
  const [address, setAddress] = useState<VerifyUsAddressResponse | null>(null);

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

  const getLocation = () => {
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

          toast({
            title: 'Success',
            description: 'Geolocation was successful, please continue to add an address.',
            status: 'success'
          });
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
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onSuccess = (address: VerifyUsAddressResponse) => {
    setAddress({
      ...address
    });

    onCloseAddressModal();
    onOpenConfirmModal();
  };

  return (
    <>
      <Box zIndex={500} position="absolute" left={4} top={4}>
        <Link href="/">
          <Box align="center">
            <Image src={Logo} alt="Proof of residency logo" width={48} height={48} />
          </Box>
        </Link>
      </Box>
      <Box zIndex={500} position="absolute" right={4} top={4}>
        <Link href="https://github.com/proof-of-residency/proof-of-residency" isExternal>
          <Button>
            <FiGithub />
          </Button>
        </Link>
      </Box>

      <Box zIndex={500} position="absolute" right={4} bottom={4}>
        <Button size="lg" colorScheme="gray" onClick={onOpenInfoModal} mr={2}>
          More Info
        </Button>
        <Button
          size="lg"
          onClick={address ? onOpenConfirmModal : onOpenAddressModal}
          disabled={!latLng}
        >
          {address ? 'Confirm your Address' : 'Add your Address'}
        </Button>
      </Box>
      <Map
        style="mapbox://styles/chase-adams-asu/ckwmoa4oo244t14mdno6kg6e7"
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        zoom={[14]}
        center={latLng ? [latLng.longitude, latLng.latitude] : undefined}
      >
        {latLng ? (
          <Marker style={styles.marker} coordinates={[latLng.longitude, latLng.latitude]} />
        ) : (
          <></>
        )}
        {address ? (
          <Marker
            onClick={onOpenConfirmModal}
            style={styles.markerAddress}
            coordinates={[address.components.longitude, address.components.latitude]}
          />
        ) : (
          <></>
        )}
      </Map>
      {latLng && (
        <AddressModal
          onSuccess={onSuccess}
          geolocation={latLng}
          isOpen={isOpenAddressModal}
          onClose={onCloseAddressModal}
        />
      )}
      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />
      {address && (
        <ConfirmModal isOpen={isOpenConfirmModal} onClose={onCloseConfirmModal} address={address} />
      )}
    </>
  );
};

export default RequestPage;
