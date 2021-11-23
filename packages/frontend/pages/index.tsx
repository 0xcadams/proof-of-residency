import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import { Box, Button, Link, useDisclosure, useToast } from '@chakra-ui/react';
import { FiGithub } from 'react-icons/fi';

import { AddressModal } from '../src/components/AddressModal';
import { InfoModal } from '../src/components/InfoModal';
import { CoordinateLongitudeLatitude } from 'haversine';

const Map = ReactMapboxGl({
  interactive: false,
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
});

const styles: { [key: string]: React.CSSProperties } = {
  marker: {
    cursor: 'pointer',
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: '#51D5A0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #56C498'
  }
};

const IndexPage = () => {
  const [latLng, setLatLng] = useState<CoordinateLongitudeLatitude | null>(null);

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

  return (
    <>
      <Box zIndex={500} position="absolute" left={4} top={4}>
        <Link href="https://github.com/chase-adams/proof-of-residency" isExternal>
          <Button size="lg" mr={2}>
            <FiGithub />
          </Button>
        </Link>
      </Box>
      <Box zIndex={500} position="absolute" right={4} bottom={4}>
        <Button size="lg" onClick={onOpenInfoModal} mr={2}>
          More Info
        </Button>
        <Button size="lg" colorScheme="blue" onClick={onOpenAddressModal} disabled={!latLng}>
          Add your Address
        </Button>
      </Box>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
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
      </Map>
      {latLng && (
        <AddressModal
          geolocation={latLng}
          isOpen={isOpenAddressModal}
          onClose={onCloseAddressModal}
        />
      )}
      <InfoModal isOpen={isOpenInfoModal} onClose={onCloseInfoModal} />
    </>
  );
};

export default IndexPage;
