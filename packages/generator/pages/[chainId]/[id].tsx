import { promises as fs } from 'fs';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { P5WrapperProps } from 'react-p5-wrapper';
import { allChains } from 'wagmi';
import {
  colors,
  getCacheableTokenIds,
  getCountryAndTokenNumber,
  getIsoCountryForCountryId,
  metadata
} from '../../src/token';
import { Country } from '../../src/types';

const P5Wrapper = dynamic<P5WrapperProps>(
  () => import('react-p5-wrapper').then((mod) => mod.ReactP5Wrapper),
  { ssr: false }
);

interface Params extends ParsedUrlQuery {
  id: string;
  chainId: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tokens = await getCacheableTokenIds();

  return {
    paths: tokens.map(({ id, chain }) => {
      const params: Params = {
        id,
        chainId: String(chain)
      };

      return { params };
    }),

    fallback: 'blocking'
  };
};

type IdPageProps = Country & {
  colors: typeof colors[number];
  sI: number;
  rhI: number;
  tokenNumber: number;
  chainName: string;
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const id = params?.id?.toString();
  const chainId = params?.chainId?.toString();

  if (!id || !chainId) {
    return { notFound: true };
  }

  const chain = allChains.find((c) => c.id === Number(chainId));

  if (!chain) {
    return { notFound: true };
  }

  try {
    const { countryId, tokenNumber } = getCountryAndTokenNumber(id);

    if (!getIsoCountryForCountryId(countryId.toNumber())) {
      return { notFound: true };
    }

    const file = path.join(process.cwd(), `sources/countries/${countryId.toNumber()}.json`);
    const countrySource: Country = JSON.parse((await fs.readFile(file, 'utf8')).toString());

    if (!countrySource?.country) {
      return { notFound: true };
    }

    const meta = metadata(chain, id);

    const props: IdPageProps = {
      ...countrySource,
      colors: meta.colors,
      sI: meta.sI,
      rhI: meta.rhI,
      tokenNumber: tokenNumber.toNumber(),
      chainName: chain.name
    };

    return {
      props: props,
      revalidate: 1800
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
};

const IndexPage = (props: IdPageProps) => (
  <>
    <Head>
      <title>{`${props.country.country}: #${props.tokenNumber.toString()} (${
        props.chainName
      })`}</title>
      <style>{`body { background-color: ${props.colors.bgg}; }`}</style>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b69ccb" />
      <meta name="msapplication-TileColor" content="#eaddf9" />
      <meta name="theme-color" content="#eaddf9" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <P5Wrapper
      sketch={(p5) => {
        let coords: { x: number; y: number }[][][];
        let hydroCoords: { x: number; y: number }[][][];

        console.log({ p5 });

        p5.setup = () => {
          const dim = Math.floor(Math.min(window.innerWidth, window.innerHeight));

          p5.createCanvas(dim, dim);

          p5.colorMode(p5.RGB, 255);
          p5.noFill();

          p5.strokeCap(p5.ROUND);
          p5.smooth();

          p5.frameRate(30);

          p5.background(props.colors.bgg);

          const ratio = 0.94;

          coords =
            props.country?.coordinates?.map((outer) =>
              outer.map((inner) =>
                inner.map((e) => ({
                  x: e.x * dim * ratio + ((1 - ratio) / 2) * dim,
                  y: e.y * dim * ratio + ((1 - ratio) / 2) * dim
                }))
              )
            ) ?? [];

          hydroCoords =
            props.waterBodies?.map((outer) =>
              outer.map((inner) =>
                inner.map((e) => ({
                  x: e.x * dim * ratio + ((1 - ratio) / 2) * dim,
                  y: e.y * dim * ratio + ((1 - ratio) / 2) * dim
                }))
              )
            ) ?? [];
        };

        p5.draw = () => {
          p5.blendMode(p5.BLEND);

          p5.noStroke();
          p5.fill(props.colors.bg);

          coords.map((outer) => {
            p5.beginShape();

            outer?.forEach((inner) =>
              inner.map((coord) => {
                p5.curveVertex(coord.x, coord.y);
              })
            );

            p5.endShape();
          });

          p5.fill(props.colors.hydro);
          p5.stroke(props.colors.hydro);
          p5.strokeWeight(p5.width / 1e3);

          [...Array(props.rhI)].forEach((_) => {
            hydroCoords?.map((outer) => {
              outer?.forEach((inner) => {
                p5.beginShape();
                inner.map((coord) => {
                  p5.curveVertex(coord.x, coord.y);
                });

                p5.endShape();
              });
            });
          });

          p5.noFill();
          p5.stroke(props.colors.country);

          p5.strokeWeight(p5.width / 10e3);

          [...Array(props.sI)].forEach((_, i) => {
            coords.map((outer) => {
              outer?.forEach((inner) => {
                p5.beginShape();
                inner.map((coord) => {
                  p5.curveVertex(
                    coord.x + 0.5 * Math.sin(i * 0.2) + 0.5 * Math.cos(i * 0.2),
                    coord.y + 0.5 * Math.sin(i * 0.2) + 0.5 * Math.cos(i * 0.2)
                  );
                });
                p5.endShape();
              });
            });
          });
        };
      }}
    />
  </>
);

export default IndexPage;
