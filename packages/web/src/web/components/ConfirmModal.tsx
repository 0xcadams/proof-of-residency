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
import {
  useCommitAddress,
  useCurrentNonce,
  useMintPrice,
  useSignPasswordEip712,
  useWalletAddress
} from '../hooks';
import { ethers } from 'ethers';
import { CoordinateLongitudeLatitude } from 'haversine';
import { useRouter } from 'next/router';

export const ConfirmModal = (props: {
  address: VerifyAddressResponse;
  geolocation: CoordinateLongitudeLatitude;
  isOpen: boolean;
  onClose: (success: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const toast = useToast();

  const router = useRouter();

  const walletAddress = useWalletAddress();
  const commitAddress = useCommitAddress();
  const mintPrice = useMintPrice();
  const signPasswordEip712 = useSignPasswordEip712();
  const nonce = useCurrentNonce();

  const onSubmit = async () => {
    setIsLoading(true);

    if (walletAddress && commitAddress && mintPrice && nonce) {
      try {
        const hashedPassword = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(['string', 'string'], [walletAddress, password])
        );

        const passwordPayload: SubmitAddressPasswordPayload = {
          hashedPassword,
          walletAddress,
          nonce
        };

        const passwordSignature = await signPasswordEip712(walletAddress, hashedPassword, nonce);

        if (!passwordSignature) {
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

            deliverability: props.address.deliverability,

            nonce: props.address.nonce
          },
          addressSignature: props.address.signature,

          passwordPayload,
          passwordSignature: passwordSignature
        };

        const result = await axiosClient.post<SubmitAddressResponse>('/request', body);

        if (result.status === 200) {
          const value = await mintPrice();

          const transaction = await commitAddress(
            walletAddress,
            result.data.commitment,
            result.data.v,
            result.data.r,
            result.data.s,
            { value }
          );

          const transactionResult = await transaction.wait();

          if (transactionResult.events?.some((event) => event.event === 'CommitmentCreated')) {
            toast({
              title: 'Success',
              description: `Successfully mailed your letter, it is expected to arrive in ${result.data.expectedDaysUntilDelivery} days.`,
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
        } else if (result.status === 429) {
          toast({
            title: 'Error',
            description:
              'There have been too many requests for this address. Please try again later.',
            status: 'error'
          });
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
      } finally {
        props.onClose(false);
      }
    } else {
      console.error({ walletAddress, commitAddress, mintPrice, nonce });
      toast({
        title: 'Error',
        description: 'There was a problem with the request, please try again in a few minutes.',
        status: 'error'
      });
    }

    setIsLoading(false);
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
              <Text fontWeight="bold">{props.address.name}</Text>
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
              <strong>secure</strong> password and record the value safely.
            </Text>

            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              variant="outline"
              disabled={isLoading}
              onClick={() => props.onClose(false)}
            >
              Back
            </Button>
            <Button disabled={password.length < 6} isLoading={isLoading} onClick={onSubmit}>
              Sign Confirmation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
