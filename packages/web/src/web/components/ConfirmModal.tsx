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
import faker from 'faker';
import React, { useEffect, useState } from 'react';

import { axiosClient } from '../axios';
import {
  SubmitAddressPasswordPayload,
  SubmitAddressRequest,
  SubmitAddressResponse
} from '../../../types';
import { VerifyAddressResponse } from 'types';
import { useCommitAddress, useSigner } from '../hooks';
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

  const signer = useSigner();
  const commitAddress = useCommitAddress();

  useEffect(() => {
    (async () => {
      faker.seed((await signer?.getTransactionCount()) ?? 11);
      setRandomName(`${faker.name.firstName()} ${faker.name.lastName()}`);
    })();
  }, []);

  const onSubmit = async () => {
    if (signer && commitAddress) {
      const address = await signer.getAddress();

      const hashedPassword = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['string', 'string'], [address, password])
      );

      const passwordPayload: SubmitAddressPasswordPayload = {
        hashedPassword
      };

      const message = JSON.stringify(passwordPayload, null, 2);

      const signature = await signer.signMessage(message);

      const body: SubmitAddressRequest = {
        addressPayload: {
          primaryLine: props.address.primaryLine,
          secondaryLine: props.address.secondaryLine,
          lastLine: props.address.lastLine,
          country: props.address.country
        },
        addressSignature: props.address.signature,

        passwordPayload,
        passwordSignature: signature,
        latitude: -1,
        longitude: -1,

        name: randomName
      };

      try {
        const result = await axiosClient.post<SubmitAddressResponse>('/request', body);

        if (result.status === 200) {
          const transaction = await commitAddress(
            address,
            result.data.commitment,
            result.data.hashedMailingAddress,
            result.data.v,
            result.data.r,
            result.data.s
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
              <Text fontWeight="bold">{props.address.primaryLine}</Text>
              {props.address.secondaryLine && (
                <Text fontWeight="bold">{props.address.secondaryLine}</Text>
              )}
              {props.address.lastLine && <Text fontWeight="bold">{props.address.lastLine}</Text>}
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
