import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Tag,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { useMemo } from 'react';
import { getEns } from 'src/api/ethers';
import { getAllTokenOwners, getTokensForOwner } from 'src/api/subgraph';
import { allChains, getChainForChainId, shortenEthereumAddress } from 'src/contracts';
import Header from 'src/web/components/Header';
import { CountryIso, getCountryAndTokenNumber, getIsoCountryForCountryId } from 'src/web/token';
import { MetadataResponse } from 'types';
import { useNetwork } from 'wagmi';
import Footer from '../../src/web/components/Footer';

type UserDetailsProps = {
  tokens: {
    tokenId: string;
    tokenNumber: string;
    link: string;
    image: string;
    country: CountryIso | null;

    chainName: string;
    chainId: number;
  }[];

  ownerId: string;
  shortOwnerId: string;

  ens: {
    name: string | null;
    avatar: string | null;
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allTokensForOwner = await getAllTokenOwners();

  const allOwners = allTokensForOwner.map((e) => e.id).filter((v, i, a) => a.indexOf(v) === i);

  return {
    paths: allOwners.map((owner) => {
      const params: Params = { id: owner };

      return { params };
    }),

    fallback: 'blocking'
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const owner = params?.id ?? '';

  if (!owner) {
    console.error('No id passed');
    return { notFound: true };
  }

  try {
    const ens = await getEns(owner);
    const allTokens = await getTokensForOwner(owner);

    if (!allTokens || !ens) {
      console.error('No tokens found');
      return { notFound: true };
    }

    const tokens = await Promise.all(
      allTokens?.map(async (token) => {
        const res = await fetch(
          `https://generator.proofofresidency.xyz/api/${token.chain}/${token.id}`
          // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
        );
        const meta: MetadataResponse = await res.json();

        const { countryId, tokenNumber } = getCountryAndTokenNumber(token.id);

        const isoCountry = getIsoCountryForCountryId(countryId.toNumber());

        return {
          ...meta,

          country: isoCountry ?? null,
          tokenId: token.id,
          tokenNumber: tokenNumber.toString(),
          link: `/token/${token.chain}/${token.id}`,
          image: `https://generator.proofofresidency.xyz/token/${token.chain}/${token.id}.png`,
          chainName: getChainForChainId(token.chain)?.name ?? '',
          chainId: token.chain
          // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/token/${tokenId}.png`
        };
      }) ?? []
    );

    const props: UserDetailsProps = {
      ownerId: owner,
      shortOwnerId: shortenEthereumAddress(owner),
      tokens,
      ens
    };

    return {
      props,
      revalidate: 300
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
};

const UserDetailsPage = (props: UserDetailsProps) => {
  const shortName = useMemo(() => props.ens.name ?? props.shortOwnerId, []);
  const { chain } = useNetwork();

  const hasTokenOnCurrentNetwork = useMemo(
    () => props.tokens.some((t) => Number(t.chainId) === chain?.id ?? -1),
    [props.tokens, chain?.id]
  );
  const hasAllNetworkTokens = useMemo(
    () => props.tokens.length === allChains.length,
    [props.tokens, allChains]
  );

  return (
    <>
      <Header />
      <NextSeo
        title={`${shortName} | Proof of Residency`}
        openGraph={{
          images: props.ens.avatar
            ? [
                {
                  url: props.ens.avatar,
                  alt: shortName
                }
              ]
            : []
        }}
      />
      <Flex px={2} pt="70px" width="100%" direction="column">
        <Flex justify="center">
          <Avatar size="2xl" src={props.ens.avatar ?? undefined} />
        </Flex>

        <Heading fontSize="5xl" mt={2} textAlign="center">
          {shortName}
        </Heading>

        <Grid px={4} maxWidth={1200} width="100%" mx="auto" flexDirection="column" mt={3}>
          <Flex justify="center">
            <Tooltip
              shouldWrapChildren
              label={
                hasAllNetworkTokens
                  ? 'You have a PORP on every supported network - nice!'
                  : hasTokenOnCurrentNetwork
                  ? 'You have a PORP on the current network - please change networks to claim on another chain.'
                  : undefined
              }
            >
              <Link href={'/request'} passHref>
                <Button
                  disabled={props.tokens.some((t) => Number(t.chainId) === chain?.id ?? -1)}
                  variant="solid"
                >
                  Request PORP
                </Button>
              </Link>
            </Tooltip>
          </Flex>

          <Divider mt={6} />

          {props.tokens.length > 0 ? (
            <>
              <Heading textAlign="center" mt={4} fontSize="3xl">
                Minted Tokens
              </Heading>

              <SimpleGrid
                mx="auto"
                alignItems="center"
                width="100%"
                maxWidth={1200}
                mt={4}
                mb={8}
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
              >
                {props.tokens.map((token, i) => (
                  <Link key={token.tokenId} href={token.link} passHref>
                    <Flex align="center" cursor="pointer" direction="column">
                      <Box>
                        <Flex mt={2} mx="auto" position="relative" width={400} height={400}>
                          <Image
                            objectFit="contain"
                            layout="fill"
                            placeholder="empty"
                            src={token.image}
                            alt={token.tokenNumber}
                          />
                        </Flex>
                      </Box>
                      <Heading mt={2} fontSize="2xl">
                        {token.country?.country ? `${token.country?.country}: ` : ''}#
                        {token.tokenNumber}
                      </Heading>
                      <Tag mt={2} variant="solid" size="lg">
                        {token.chainName}
                      </Tag>
                    </Flex>
                  </Link>
                ))}
              </SimpleGrid>
            </>
          ) : (
            <Flex minH="50vh" align="center" justify="center">
              <Text mt={4} mx="auto" fontSize="2xl" textAlign="center" width="100%">
                User has no tokens.
              </Text>
            </Flex>
          )}
        </Grid>
      </Flex>
      <Footer />
    </>
  );
};

export default UserDetailsPage;
