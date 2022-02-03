import { Button, Flex, Heading, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import BIP32Factory from 'bip32';
import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import React, { useState } from 'react';
import * as ecc from 'tiny-secp256k1';

import { useRouter } from 'next/router';

import { CountrySelect } from 'src/web/components/CountrySelect';
import Footer from 'src/web/components/Footer';
import Header from 'src/web/components/Header';
import {
  useWalletAddress,
  useMint,
  useProviderExists,
  useGetCommitmentPeriodIsUpcoming,
  useGetCommitmentPeriodIsValid
} from 'src/web/hooks';
import { NextSeo } from 'next-seo';
import { getIsoCountryForAlpha2 } from 'src/web/token';

const bip32 = BIP32Factory(ecc);

const MintPage = () => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const walletAddress = useWalletAddress();
  const mint = useMint();

  const providerExists = useProviderExists();

  const commitmentPeriodIsUpcoming = useGetCommitmentPeriodIsUpcoming();
  const isCommitmentReady = useGetCommitmentPeriodIsValid();

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async () => {
    const isoCountry = getIsoCountryForAlpha2(selectedCountry);

    try {
      if (isoCountry && walletAddress && mint) {
        const hashedPassword = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(['string', 'string'], [walletAddress, password])
        );

        const seedBuffer = await bip39.mnemonicToSeed(mnemonic.trim(), hashedPassword);
        const node = bip32.fromSeed(seedBuffer);

        const transaction = await mint(
          Number(isoCountry.numeric),
          node?.publicKey?.toString('hex') ?? ''
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
      } else {
        toast({
          title: 'Error',
          description:
            'Minting was not successful. Please double check your inputs and try again in a few minutes.',
          status: 'error'
        });
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
      <NextSeo title={`Mint | Proof of Residency`} />

      <Header />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="4xl" textAlign="center">
          Claim Token
        </Heading>

        <Flex textAlign={'center'} direction={'column'} mt={4} mb={6} mx="auto">
          <Text fontSize="xl">Please select your country from the dropdown below.</Text>

          <Text maxWidth={700} mt={3} color={'red'} fontSize="sm">
            {providerExists
              ? !isCommitmentReady &&
                (commitmentPeriodIsUpcoming
                  ? 'Your token is not available to be minted. Please wait one week from your original request.'
                  : 'Your token is not available to be minted. Please try again if it has been more than ten weeks.')
              : 'You must have Metamask installed to use this app.'}
          </Text>
        </Flex>

        <Flex flexDirection="column" mx="auto" justify="center">
          <CountrySelect
            country={selectedCountry}
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
                disabled={
                  !(
                    mnemonic &&
                    password &&
                    password.length >= 6 &&
                    mnemonic.split(' ')?.length === 12 &&
                    mnemonic.split(' ')?.every((e) => e)
                  )
                }
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
