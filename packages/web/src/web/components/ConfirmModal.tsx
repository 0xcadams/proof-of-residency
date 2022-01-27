import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';
import { Button, Flex, Input, Text, useToast } from '@chakra-ui/react';

import React, { useState } from 'react';

import { axiosClient } from '../axios';
import {
  SubmitAddressPasswordPayload,
  SubmitAddressRequest,
  SubmitAddressResponse
} from '../../../types';
import { VerifyAddressResponse } from 'types';
import { useCommitAddress, useMintPrice, useSignPasswordEip712, useWalletAddress } from '../hooks';
import { ethers } from 'ethers';
import { CoordinateLongitudeLatitude } from 'haversine';
import { useRouter } from 'next/router';

export const ConfirmModal = (props: {
  address: VerifyAddressResponse;
  geolocation: CoordinateLongitudeLatitude;
  isOpen: boolean;
  onClose: (success: boolean) => void;
}) => {
  const [password, setPassword] = useState<string>('');
  const [randomName, setRandomName] = useState<string>('');
  const toast = useToast();

  const router = useRouter();

  const walletAddress = useWalletAddress();
  const commitAddress = useCommitAddress();
  const mintPrice = useMintPrice();
  const signPasswordEip712 = useSignPasswordEip712();

  const onSubmit = async () => {
    if (walletAddress && commitAddress && mintPrice) {
      const hashedPassword = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['string', 'string'], [walletAddress, password])
      );

      const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      const passwordPayload: SubmitAddressPasswordPayload = {
        hashedPassword,
        nonce
      };

      const signature = await signPasswordEip712(hashedPassword, nonce);

      if (!signature) {
        throw new Error('Signature could not be completed successfully.');
      }

      const body: SubmitAddressRequest = {
        addressPayload: {
          name: props.address.name,
          addressLine1: props.address.addressLine1,
          addressLine2: props.address.addressLine2,
          city: props.address.city,
          state: props.address.state,
          postal: props.address.postal,
          country: props.address.country,

          nonce: props.address.nonce
        },
        addressSignature: props.address.signature,

        passwordPayload,
        passwordSignature: signature,
        latitude: -1,
        longitude: -1
      };

      try {
        const result = await axiosClient.post<SubmitAddressResponse>('/request', body);

        if (result.status === 200) {
          const value = await mintPrice();

          const transaction = await commitAddress(
            walletAddress,
            result.data.commitment,
            result.data.hashedMailingAddress,
            result.data.v,
            result.data.r,
            result.data.s,
            { value }
          );

          const transactionResult = await transaction.wait();

          if (transactionResult.events?.some((event) => event.event === 'CommitmentCreated')) {
            toast({
              title: 'Success',
              description: `Successfully mailed a letter and committed your country to the blockchain. Please wait ${
                props.address.country === 'US' ? 'one week' : 'two weeks'
              } for your letter to arrive.`,
              status: 'success'
            });
          } else {
            toast({
              title: 'Error',
              description: 'Request was not successful. Please try again in a few minutes.',
              status: 'error'
            });
          }

          await router.push('/');

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
              data we request.
            </Text>

            <Flex direction="column" mb={6} mt={6}>
              <Text fontWeight="bold">{randomName}</Text>
              <Text fontWeight="bold">{props.address.addressLine1}</Text>
              {props.address.addressLine2 && (
                <Text fontWeight="bold">{props.address.addressLine2}</Text>
              )}
              {props.address.lastLine && (
                <Text fontWeight="bold">{`${props.address.lastLine}`}</Text>
              )}
            </Flex>

            <Text mb={3}>
              We require a password to securely generate your letter. Please use a{' '}
              <strong>secure</strong> password and remember the value.
            </Text>

            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="outline" onClick={() => props.onClose(false)}>
              Cancel
            </Button>
            <Button disabled={password.length < 6} onClick={onSubmit}>
              Sign Payload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
function useProofOfResidency() {
  throw new Error('Function not implemented.');
}
