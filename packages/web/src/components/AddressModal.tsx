import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/modal';
import { Button, Link, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import haversine, { CoordinateLongitudeLatitude } from 'haversine';

import { VerifyAddressRequest } from '../../pages/api/verify';
import { VerifyUsAddressResponse } from '../api/services/lob';
import { axiosClient } from '../axiosClient';

export const AddressModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: VerifyUsAddressResponse) => void;
  geolocation: CoordinateLongitudeLatitude;
}) => {
  const [primaryLine, setPrimaryLine] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');

  const toast = useToast();

  const onSubmit = async () => {
    if (primaryLine && city && state && zipCode) {
      const body: VerifyAddressRequest = { primaryLine, city, state, zipCode };
      const result = await axiosClient.post<VerifyUsAddressResponse>('/verify', body);

      if (result.status !== 200) {
        toast({
          title: 'Error',
          description: 'There was a problem with the request, please try again.',
          status: 'error'
        });
      } else if (result.data.deliverability === 'deliverable') {
        const distance = haversine(
          props.geolocation,
          {
            latitude: result.data.components.latitude,
            longitude: result.data.components.longitude
          },
          { unit: 'meter' }
        );

        if (distance <= 500) {
          return props.onSuccess(result.data);
        }
        toast({
          title: 'Error',
          description: `You are too far away from your claimed address. You are ${distance.toFixed(
            0
          )}m away - you must be within 500m of the address to claim it.`,
          status: 'error'
        });
      } else {
        toast({
          title: 'Warning',
          description:
            result.data.deliverability === 'deliverable_incorrect_unit'
              ? 'Incorrect unit for address, please try again.'
              : result.data.deliverability === 'deliverable_unnecessary_unit'
              ? 'Unnecessary unit for address, please try again.'
              : result.data.deliverability === 'deliverable_missing_unit'
              ? 'Missing unit for address, please try again.'
              : 'Undeliverable address, please try again.',
          status: 'warning'
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'There was a problem with the address, please try again.',
        status: 'error'
      });
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit your claimed address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={3}>
              In order to request to mint a Proof of Residency NFT, you must provide your address so
              we can send a letter through{' '}
              <Link isExternal href="https://www.lob.com/">
                Lob
              </Link>
              {', '} a physical mail service, to validate your address. We ensure that Lob (as well
              as our own platform) is not provided with enough information to tie your request back
              to your wallet address. Please refer to our{' '}
              <Link
                isExternal
                href="https://github.com/proof-of-residency/proof-of-residency/blob/main/WHITEPAPER.md"
              >
                whitepaper
              </Link>{' '}
              to answer any other questions about our security considerations.
            </Text>

            <Text>
              We only support US addresses at this time! This is due to the massive amount of effort
              put into design for each state. We look forward to supporting more countries in the
              future.
            </Text>
            <FormControl mt={4}>
              <Input
                onChange={(e) => setPrimaryLine(e.target.value)}
                value={primaryLine}
                placeholder="Street Address"
              />
            </FormControl>

            <FormControl mt={1}>
              <Input onChange={(e) => setCity(e.target.value)} value={city} placeholder="City" />
            </FormControl>

            <FormControl mt={1}>
              <Input onChange={(e) => setState(e.target.value)} value={state} placeholder="State" />
            </FormControl>

            <FormControl mt={1}>
              <Input
                onChange={(e) => setZipCode(e.target.value)}
                value={zipCode}
                placeholder="ZIP"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="outline" onClick={props.onClose}>
              Cancel
            </Button>
            <Button disabled={!(primaryLine && city && state && zipCode)} onClick={onSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
