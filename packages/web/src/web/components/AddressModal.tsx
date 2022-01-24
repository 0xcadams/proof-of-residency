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
import { Button, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

import { axiosClient } from '../axios';
import { VerifyAddressRequest, VerifyAddressResponse } from 'types';
import Link from 'next/link';
import { CountrySelect } from './CountrySelect';

export const AddressModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: VerifyAddressResponse) => void;
}) => {
  const [primaryLine, setPrimaryLine] = useState<string>('');
  const [secondaryLine, setSecondaryLine] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const toast = useToast();

  const onSubmit = async () => {
    if (primaryLine && city && state && postalCode && country) {
      const body: VerifyAddressRequest = {
        primaryLine,
        secondaryLine,
        city,
        state,
        postalCode,
        country
      };
      const result = await axiosClient.post<VerifyAddressResponse>('/verify', body);

      if (result.status !== 200) {
        toast({
          title: 'Error',
          description: 'There was a problem with the request, please try again.',
          status: 'error'
        });
      } else if (result.data.deliverability === 'deliverable') {
        return props.onSuccess(result.data);
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
              : result.data.deliverability === 'deliverable_missing_info'
              ? 'Missing information for address, please try again.'
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
              You must provide your address so we can mail a letter to validate your personhood.
              Please refer to our{' '}
              <strong>
                <Link href="https://github.com/proof-of-residency/proof-of-residency/blob/main/WHITEPAPER.md">
                  whitepaper
                </Link>
              </strong>{' '}
              to answer any other questions about our security considerations.
            </Text>

            <CountrySelect onChange={(country) => setCountry(country)} />

            {country && (
              <>
                <FormControl mt={4}>
                  <Input
                    autocomplete="shipping address-line1"
                    onChange={(e) => setPrimaryLine(e.target.value)}
                    value={primaryLine}
                    placeholder="Primary Line"
                  />
                </FormControl>

                <FormControl mt={2}>
                  <Input
                    autocomplete="shipping address-line2"
                    onChange={(e) => setSecondaryLine(e.target.value)}
                    value={secondaryLine}
                    placeholder={`Secondary Line (optional)`}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <Input
                    autocomplete="shipping locality"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    placeholder="City"
                  />
                </FormControl>

                <FormControl mt={2}>
                  <Input
                    autocomplete="shipping region"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    placeholder={`State${country !== 'US' ? ' (optional)' : ''}`}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <Input
                    autocomplete="shipping postal-code"
                    onChange={(e) => setPostalCode(e.target.value)}
                    value={postalCode}
                    placeholder={`ZIP/Postal Code ${country !== 'US' ? ' (optional)' : ''}`}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="outline" onClick={props.onClose}>
              Cancel
            </Button>
            <Button disabled={!(primaryLine && city && country)} onClick={onSubmit}>
              Verify Address
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
