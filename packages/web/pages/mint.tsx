import { Button, Flex, Heading, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import BIP32Factory from 'bip32';
import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import React, { useState } from 'react';
import {
  useGetCommitmentPeriodIsValid,
  useMint,
  useMintPrice,
  useWalletAddress
} from 'src/web/hooks';
import * as ecc from 'tiny-secp256k1';

import iso from 'iso-3166-1';

import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';

import { CountrySelect } from 'src/web/components/CountrySelect';
import { useRouter } from 'next/router';

const bip32 = BIP32Factory(ecc);

const MintPage = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const walletAddress = useWalletAddress();
  const mint = useMint();
  const mintPrice = useMintPrice();

  const isCommitmentReady = useGetCommitmentPeriodIsValid();

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async () => {
    const isoCountry = iso.whereAlpha2(selectedCountry);

    try {
      if (isoCountry && walletAddress && mint && mintPrice) {
        const hashedPassword = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(['string', 'string'], [walletAddress, password])
        );

        const seedBuffer = await bip39.mnemonicToSeed(mnemonic.trim(), hashedPassword);
        const node = bip32.fromSeed(seedBuffer);

        const value = await mintPrice();

        const transaction = await mint(
          Number(isoCountry.numeric),
          node?.publicKey?.toString('hex') ?? '',
          { value }
        );

        const result = await transaction.wait();

        if (result.events?.some((event) => event.event === 'Transfer')) {
          toast({
            title: 'Success',
            description: 'Successfully claimed your Proof of Residency token!',
            status: 'success'
          });

          await router.push('/');
        } else {
          throw new Error('No transfer events found.');
        }
      }
    } catch (e) {
      console.error({ e });

      toast({
        title: 'Error',
        description:
          'Minting was not successful. Please double check your inputs and try again in a few minutes.',
        status: 'error'
      });
    }
  };

  return (
    <>
      <Header />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="4xl" textAlign="center">
          Claim Token
        </Heading>

        <Flex textAlign={'center'} direction={'column'} mt={4} mb={6} mx="auto">
          <Text fontSize="xl">Please select your country from the dropdown below.</Text>

          {!isCommitmentReady && (
            <Text mt={2} color={'red'} fontSize="sm">
              Your token is not ready to be minted. Please wait one week from your original request.
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" mx="auto" justify="center">
          <CountrySelect
            disabled={!isCommitmentReady}
            onChange={(country) => setSelectedCountry(country)}
          />

          {selectedCountry && (
            <Flex flexDirection="column" mt={4} justify="center">
              <Textarea
                onChange={(event) => setMnemonic(event.target.value)}
                placeholder="Mnemonic received in your letter"
              />
              <Input
                mt={4}
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password you entered"
              />
              <Button
                disabled={!(mnemonic && password && password.length >= 6)}
                mt={4}
                onClick={onSubmit}
              >
                Submit
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>

      <Footer />
    </>
  );
};

export default MintPage;
