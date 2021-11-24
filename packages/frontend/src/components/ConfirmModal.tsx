import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/modal';
import { Button, Code, Flex, FormControl, Input, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

import { VerifyUsAddressResponse } from '../api/services/lob';

export const ConfirmModal = (props: {
  address: VerifyUsAddressResponse;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [mnemonicPassword, setMnemonicPassword] = useState<string>('');
  const toast = useToast();

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
              Please confirm the address shown below to continue submitting for Proof of Residency:
            </Text>

            <Flex direction="column" mt={2}>
              <Code>{props.address.primary_line}</Code>
              {props.address.secondary_line && <Code>{props.address.secondary_line}</Code>}
              {props.address.last_line && <Code>{props.address.last_line}</Code>}
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSubmit}
              disabled={mnemonicPassword?.length < 6}
            >
              Send Letter
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
