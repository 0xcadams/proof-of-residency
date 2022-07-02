import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import React, { useMemo } from 'react';
import { getOwnerOfToken, getTokenByIdAndChain, TokenOwner } from 'src/api/subgraph';
import { getAllTokens } from 'src/api/subgraph';
import {
  getChainForChainId,
  isValidProofOfResidencyNetwork,
  ProofOfResidencyNetwork
} from 'src/contracts';
import Header from 'src/web/components/Header';
import { CountryIso, getCountryAndTokenNumber, getIsoCountryForCountryId } from 'src/web/token';
import { MetadataResponse } from 'types';
import Footer from '../../../src/web/components/Footer';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getEns } from 'src/api/ethers';

dayjs.extend(localizedFormat);

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tokens = await getAllTokens();

  return {
    paths: tokens.map(({ chain, id }) => {
      const params: Params = { id, chain: String(chain) };

      return { params };
    }),

    fallback: false
  };
};

type DetailsProps = {
  burned: boolean;
  mintTime: number;
} & CountryIso &
  MetadataResponse & {
    tokenId: string;
    tokenIdCondensed: string;
    chain: string;
    owner: TokenOwner;
    imagePng: string;
    metadataUrl: string;
    ensName: string;
  };

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const tokenId = params?.id;
  const chain = Number(params?.chain) as ProofOfResidencyNetwork;

  if (!tokenId || !isValidProofOfResidencyNetwork(chain) || !process.env.NEXT_PUBLIC_CID_METADATA) {
    return { notFound: true };
  }

  try {
    const metadataUrl = `https://generator.proofofresidency.xyz/api/${chain}/${tokenId}`;
    // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
    const res = await fetch(metadataUrl);
    const meta: MetadataResponse = await res.json();

    const { countryId } = getCountryAndTokenNumber(tokenId);

    const isoCountry = getIsoCountryForCountryId(countryId.toNumber());

    if (!isoCountry) {
      return { notFound: true };
    }

    const owner = await getOwnerOfToken(tokenId, chain);
    const token = await getTokenByIdAndChain(tokenId, chain);
    const ens = await getEns(owner.owner ?? '');

    if (!token) {
      return { notFound: true };
    }

    const props: DetailsProps = {
      ...isoCountry,
      ...meta,

      burned: token.burned,
      mintTime: token.mintTime.toNumber(),

      image: `https://generator.proofofresidency.xyz/${chain}/${tokenId}`,
      // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/${tokenId}.html`,
      imagePng: `https://generator.proofofresidency.xyz/token/${chain}/${tokenId}.png`,
      //  `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/token/${tokenId}.png`,
      tokenId,
      tokenIdCondensed: `${tokenId.slice(0, 3)}...${tokenId.slice(14)}`,
      owner,
      chain: getChainForChainId(chain)?.name ?? '',
      metadataUrl,
      ensName: ens.name ?? ''
    };

    return {
      props,
      revalidate: 600
    };
  } catch (e) {
    console.error(e);

    return { notFound: true };
  }
};

const TokenDetailsPage = (props: DetailsProps) => {
  const imageHeight = useBreakpointValue({ base: 400, md: 650 }, 'md');

  const tags = useMemo(
    () => [
      {
        name: 'Chain',
        content: props.chain,
        tooltip: 'The chain which this NFT was minted on.'
      },
      {
        name: 'Claimed Date',
        content: `${dayjs.unix(props.mintTime).format('LL')}`,
        tooltip: 'The calendar day this PORP was claimed by the owner.'
      },
      ...(props.owner.link
        ? [
            {
              name: 'Owned By',
              content: props.ensName || props.owner.content,
              link: props.owner.link
            }
          ]
        : []),
      {
        name: 'Metadata URL',
        content: props.tokenIdCondensed,
        link: props.metadataUrl
      },
      {
        name: 'License',
        link: 'https://creativecommons.org/publicdomain/zero/1.0/',
        content: 'CCO'
      },

      {
        name: 'Artwork',
        content: 'Generative Script'
      },
      ...(props.burned
        ? [
            {
              name: 'Burned',
              content: 'True'
            }
          ]
        : [])
    ],
    [props]
  );

  return (
    <>
      <NextSeo
        title={`${props.name} | Proof of Residency`}
        description={props.description}
        openGraph={{
          images: [
            {
              url: props.imagePng,
              width: 1000,
              height: 1000,
              alt: props.name
            }
          ]
        }}
      />
      <Header />
      <Flex pt="70px" width="100%" direction="column">
        {typeof window === 'undefined' ? (
          <Skeleton height={imageHeight} width="100%" />
        ) : (
          <iframe
            sandbox="allow-scripts allow-downloads"
            allowFullScreen={false}
            allow="xr-spatial-tracking"
            src={props.image}
            style={{ height: imageHeight, width: '100%' }}
          />
        )}

        <Divider />

        <Heading size="xl" mt={6} textAlign="center">
          {props.name}
        </Heading>

        <SimpleGrid
          px={4}
          columns={{ base: 1, md: 2 }}
          spacing={4}
          maxWidth={1200}
          width="100%"
          alignContent="center"
          mx="auto"
          mt={4}
        >
          <Flex direction="column" mt={2} flex={1}>
            {props.description && (
              <Text fontSize="lg" width="100%">
                {props.description}
              </Text>
            )}
            <SimpleGrid mt={8} mb={8} columns={2} spacing={4}>
              {tags.map((tag) => (
                <Flex key={tag.name} direction="column">
                  <Text fontWeight="bold" fontSize="lg">
                    {tag.name}
                  </Text>
                  <Tooltip label={tag.tooltip}>
                    {tag.link ? (
                      <Box cursor="pointer" mt={2}>
                        <a
                          href={tag.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Check out our twitter"
                        >
                          <Tag variant="solid" size="lg">
                            {tag.content}
                          </Tag>
                        </a>
                      </Box>
                    ) : (
                      <Box mt={2}>
                        <Tag variant="solid" size="lg">
                          {tag.content}
                        </Tag>
                      </Box>
                    )}
                  </Tooltip>
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>

          <Flex flex={1}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Feature</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.attributes.map((attribute) => (
                  <Tr key={attribute.trait_type}>
                    <Td>{attribute.trait_type}</Td>
                    <Td>{attribute.value}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </SimpleGrid>
      </Flex>
      <Footer />
    </>
  );
};

export default TokenDetailsPage;
