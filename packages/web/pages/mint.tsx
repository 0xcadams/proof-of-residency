import { Button, Flex, Heading, Select, Text, Textarea } from '@chakra-ui/react';
import BIP32Factory from 'bip32';
// import { ethers } from 'ethers';
import { promises as fs } from 'fs';
import path from 'path';
import React, { useEffect, useState } from 'react';
import * as ecc from 'tiny-secp256k1';
import { useWallet } from 'use-wallet';

import Footer from '../src/web/components/Footer';
import Header from '../src/web/components/Header';
import { Mapping } from '../types';

const bip32 = BIP32Factory(ecc);

type MintProps = {
  cities: {
    name: string;
    index: number;
    value: number;
  }[];
};

export const getStaticProps = async () => {
  try {
    const mappingFile = path.join(process.cwd(), 'sources/mappings.json');
    const mappings: Mapping[] = JSON.parse((await fs.readFile(mappingFile, 'utf8')).toString());

    if (!mappings) {
      return { notFound: true };
    }

    const props: MintProps = {
      cities: mappings.map((city, index) => ({ name: city.name, index: index, value: city.price }))
    };

    return {
      props
    };
  } catch (e) {
    return { notFound: true };
  }
};

const MintPage = (props: MintProps) => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<number>(-1);

  const wallet = useWallet();

  useEffect(() => {
    (async () => {
      await wallet.connect('injected');
    })();
  }, []);

  const onSubmit = async () => {
    //   if (wallet.status === 'connected' && wallet.ethereum) {
    //     const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    //     const signer = provider.getSigner();
    //     const proofOfResidency = ProofOfResidencyFactory.connect(
    //       process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '',
    //       signer
    //     );
    //     const address = await signer.getAddress();
    //     const payload: SubmitAddressPayload = {
    //       walletAddress: address
    //     };
    //     const message = JSON.stringify(payload, null, 2);
    //     const signature = await signer.signMessage(message);
    //     const password = ethers.utils.keccak256(signature);
    //     const seedBuffer = await bip39.mnemonicToSeed(mnemonic, password);
    //     const node = bip32.fromSeed(seedBuffer);
    //     const transaction = await proofOfResidency.safeMint(
    //       selectedCity,
    //       node?.privateKey?.toString('hex') ?? '',
    //       {
    //         value: ethers.utils.parseEther(props.cities?.[selectedCity]?.value?.toString() ?? '0')
    //       }
    //     );
    //   }
  };

  return (
    <>
      <Header />

      <Flex minHeight="100vh" pt="70px" width="100%" direction="column" px={4}>
        <Heading mt={20} size="4xl" textAlign="center">
          Mint
        </Heading>

        <Flex mt={4} mb={6} mx="auto">
          <Text fontSize="xl">Please select a city from the dropdown below.</Text>
        </Flex>

        <Flex flexDirection="column" mx="auto" justify="center">
          <Select
            onChange={(option) => setSelectedCity(Number.parseInt(option.target.value))}
            placeholder="Select your city"
          >
            {props.cities.map((city) => (
              <option key={city.index} value={city.index}>
                {city.name}
              </option>
            ))}
          </Select>

          {selectedCity !== -1 && (
            <Flex flexDirection="column" mt={4} justify="center">
              <Textarea
                onChange={(event) => setMnemonic(event.target.value)}
                placeholder="Mnemonic received in your letter"
              />
              <Button disabled={!mnemonic} mt={4} onClick={onSubmit}>
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
