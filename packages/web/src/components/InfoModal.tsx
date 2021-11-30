import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/modal';
import { Link, Text } from '@chakra-ui/react';
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
              Proof of Residency is a generative design NFT project based on locations in the United
              States of America. In order to mint an NFT, you must be a valid resident of the US and
              verify your residency. We do not keep any information associated with your address -
              please see our{' '}
              <Link
                isExternal
                href="https://github.com/proof-of-residency/proof-of-residency/blob/main/WHITEPAPER.md"
              >
                whitepaper and open-source project
              </Link>{' '}
              for more details on how the process preserves privacy.
            </Text>
            <Text mt={2}>
              We designed this NFT as an art project as well as a proof-of-concept for an NFT lego,
              "Proof of Residency". The generative art designs are based upon your physical address
              (based on your home city/state). We send a letter through{' '}
              <Link isExternal href="https://www.lob.com/">
                Lob
              </Link>
              {', '} a physical mail service, to validate your address. We ensure that Lob (as well
              as our own platform) is not provided with enough information to tie your request back
              to your wallet address. We <strong>do not have a centralized database</strong> - all
              data is stored on-chain.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
