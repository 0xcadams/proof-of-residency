import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { name } from 'faker';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { useWallet } from 'use-wallet';

import { axiosClient } from '../axios';
import {
  SubmitAddressPayload,
  SubmitAddressRequest,
  SubmitAddressResponse
} from '../../../types/submit-address';
import { VerifyUsAddressResponse } from 'types';

export const ConfirmModal = (props: {
  address: VerifyUsAddressResponse;
  isOpen: boolean;
  onClose: (success: boolean) => void;
}) => {
  const [randomName, setRandomName] = useState<string>('');
  const toast = useToast();

  const wallet = useWallet();

  useEffect(() => {
    setRandomName(`${name.firstName()} ${name.lastName()}`);
  }, []);

  useEffect(() => {
    (async () => {
      await wallet.connect('injected');
    })();
  }, []);

  const onSubmit = async () => {
    if (wallet.status === 'connected' && wallet.ethereum) {
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);

      const signer = provider.getSigner();

      const address = await signer.getAddress();

      const payload: SubmitAddressPayload = {
        walletAddress: address
      };

      const message = JSON.stringify(payload, null, 2);

      const signature = await signer.signMessage(message);

      const body: SubmitAddressRequest = {
        payload,
        signature,
        latitude: props.address.components.latitude,
        longitude: props.address.components.longitude,

        name: randomName,
        primaryLine: props.address.primary_line,
        secondaryLine: props.address.secondary_line,
        city: props.address.components.city,
        state: props.address.components.state,

        lobAddressId: props.address.id
      };

      try {
        const result = await axiosClient.post<SubmitAddressResponse>('/request', body);

        if (result.status === 200) {
          toast({
            title: 'Success',
            description: `Successfully initiated sending a physical letter to your address. Please wait 4-6 business days for your request for ${result.data.city}.`,
            status: 'success'
          });

          localStorage.setItem('letterSent', 'true');

          return props.onClose(true);
        } else if (result.status === 400) {
          toast({
            title: 'Error',
            description: 'The transaction could not be successfully submitted.',
            status: 'error'
          });
        } else if (result.status === 404) {
          toast({
            title: 'Error',
            description: 'There was no city found associated with your address.',
            status: 'error'
          });
        } else {
          toast({
            title: 'Error',
            description: 'There was a problem with the request, please try again in a few minutes.',
            status: 'error'
          });
        }
      } catch (e) {
        toast({
          title: 'Error',
          description: 'There was a problem with the request, please try again in a few minutes.',
          status: 'error'
        });
      }

      props.onClose(false);
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={() => props.onClose(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              Please confirm the address shown below to continue submitting for Proof of Residency.
              We use a <strong>randomly generated name</strong> so we can minimize the amount of
              data we request, for maximum privacy/security. This is inconsequential with mail -
              they will deliver the parcel regardless.
            </Text>

            <Flex direction="column" mt={6}>
              <Text fontWeight="bold">{randomName}</Text>
              <Text fontWeight="bold">{props.address.primary_line}</Text>
              {props.address.secondary_line && (
                <Text fontWeight="bold">{props.address.secondary_line}</Text>
              )}
              {props.address.last_line && <Text fontWeight="bold">{props.address.last_line}</Text>}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="outline" onClick={() => props.onClose(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Send Letter</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
