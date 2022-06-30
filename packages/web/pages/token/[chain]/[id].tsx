import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
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

import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { getOwnerOfToken, TokenOwner } from 'src/api/ethers';
import {
  isValidProofOfResidencyNetwork,
  ProofOfResidencyNetwork,
  PROOF_OF_RESIDENCY_CHAINS
} from 'src/contracts';
import Header from 'src/web/components/Header';
import {
  CountryIso,
  getCacheableTokenIds,
  getCountryAndTokenNumber,
  getIsoCountryForCountryId
} from 'src/web/token';
import { MetadataResponse } from 'types';
import { chain } from 'wagmi';
import Footer from '../../../src/web/components/Footer';

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getCacheableTokenIds().flatMap((tokenId) =>
      PROOF_OF_RESIDENCY_CHAINS.map((chain) => {
        const params: Params = { id: tokenId, chain };

        return { params };
      })
    ),

    fallback: 'blocking'
  };
};

type DetailsProps = CountryIso &
  MetadataResponse & {
    tokenId: string;
    chain: ProofOfResidencyNetwork;
    owner: TokenOwner;
    imagePng: string;
  };

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const tokenId = params?.id;
  const chain = String(params?.chain) as ProofOfResidencyNetwork;

  if (!tokenId || !isValidProofOfResidencyNetwork(chain) || !process.env.NEXT_PUBLIC_CID_METADATA) {
    return { notFound: true };
  }

  try {
    const res = await fetch(
      `https://generator.proofofresidency.xyz/api/${tokenId}`
      // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_METADATA}/${tokenId}`
    );
    const meta: MetadataResponse = await res.json();

    const { countryId } = getCountryAndTokenNumber(tokenId);

    const isoCountry = getIsoCountryForCountryId(countryId.toNumber());

    if (!isoCountry || !process.env.NEXT_PUBLIC_CID_CONTENT) {
      return { notFound: true };
    }

    const owner = await getOwnerOfToken(tokenId, chain);

    const props: DetailsProps = {
      ...isoCountry,
      ...meta,

      image: `https://generator.proofofresidency.xyz/${tokenId}`,
      // `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/${tokenId}.html`,
      imagePng: `https://generator.proofofresidency.xyz/tokens/${tokenId}.png`,
      //  `https://cloudflare-ipfs.com/ipfs/${process.env.NEXT_PUBLIC_CID_CONTENT}/token/${tokenId}.png`,
      tokenId,
      owner,
      chain
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

  // const token = useGetTokenByIdQuery({
  //   variables: { id: BigNumber.from(props.tokenId).toHexString() }
  // });

  const tags = [
    {
      name: 'License',
      link: 'https://creativecommons.org/publicdomain/zero/1.0/',
      content: 'CCO: No Rights Reserved'
    },
    // {
    //   name: 'Initial Price',
    //   content: `${numeral(props.price).format('0.0')}Ξ`
    // },
    // ...(token.data?.token?.mintTime
    //   ? [
    //       {
    //         name: 'Total Population',
    //         content: `${dayjs(token.data?.token?.mintTime.toNumber()).format('mm/dd/yy')}`,
    //         link: 'https://en.wikipedia.org/wiki/Metropolitan_statistical_area',
    //         tooltip: 'The population over 18 y.o. in the city in 2020.'
    //       }
    //     ]
    //   : []),
    {
      name: 'Created By',
      content: 'Generative Script',
      tooltip: ''
    },
    {
      name: 'Chain',
      content: chain[props.chain].name
    },
    ...(props.owner.link
      ? [
          {
            name: 'Owned By',
            content: props.owner.content,
            link: props.owner.link
          }
        ]
      : [])
  ];

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
        {/* {typeof window === 'undefined' ? (
          <Skeleton height={imageHeight} width="100%" />
        ) : (
          <iframe
            sandbox="allow-scripts allow-downloads"
            allowFullScreen={false}
            allow="xr-spatial-tracking"
            src={props.image}
            style={{ height: imageHeight, width: '100%' }}
          />
        )} */}

        <Divider />

        <Heading size="lg" mt={6} textAlign="center">
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
                        <Link href={tag.link} passHref>
                          <Tag pt="3px" variant="solid" size="lg">
                            {tag.content}
                          </Tag>
                        </Link>
                      </Box>
                    ) : (
                      <Box mt={2}>
                        <Tag pt="3px" variant="solid" size="lg">
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
