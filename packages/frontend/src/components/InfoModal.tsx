import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/modal';
import { Text } from '@chakra-ui/react';
import React from 'react';

export const InfoModal = (props: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About Proof of Residency</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>In order to add an address to your</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
