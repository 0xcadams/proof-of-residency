import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';
import { Button, Flex, FormControl, Input, Text, useToast } from '@chakra-ui/react';
import { name } from 'faker';
import React, { useEffect, useState } from 'react';
import { VerifyUsAddressResponse } from '../api/services/lob';

export const ConfirmModal = (props: {
  address: VerifyUsAddressResponse;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [mnemonicPassword, setMnemonicPassword] = useState<string>('');
  const [randomName, setRandomName] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    setRandomName(`${name.firstName()} ${name.lastName()}`);
  }, []);

  const onSubmit = async () => {
    // TODO

    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
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

            <Text mt={6}>
              You also must provide a mnemonic password longer than 6 characters, which will be
              required to verify your address once you receive your{' '}
              <strong>Address Confirmation Letter</strong> in the mail:
            </Text>

            <FormControl mt={2}>
              <Input
                type="password"
                onChange={(e) => setMnemonicPassword(e.target.value)}
                value={mnemonicPassword}
                placeholder="Mnemonic Password"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="outline" onClick={props.onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={mnemonicPassword?.length < 6}>
              Send Letter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
