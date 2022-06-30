import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/modal';
import { Text } from '@chakra-ui/react';
import Link from 'next/link';
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
            <Text>
              Proof of Residency is a proof of personhood protocol. In order to receive an NFT to
              your wallet, you must verify your mailing address. We do not keep any information
              associated with your address - please see our{' '}
              <Link href="https://github.com/0xcadams/proof-of-residency/blob/main/WHITEPAPER.md">
                whitepaper and open-source project
              </Link>{' '}
              for more details on how the process preserves privacy.
            </Text>
            <Text mt={4}>
              We ensure that Lob (as well as our own platform) is not provided with enough
              information to tie your request back to your wallet address. We{' '}
              <strong>do not have a centralized database with any personal data</strong> - all data
              is stored on-chain.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
