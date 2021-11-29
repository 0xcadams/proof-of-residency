import React from 'react';
import dynamic from 'next/dynamic';
import { P5WrapperProps } from 'react-p5-wrapper';
import keccak from 'keccak';

import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { promises as fs } from 'fs';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';

const P5Wrapper = dynamic<P5WrapperProps>(
  () => import('react-p5-wrapper').then((mod) => mod.ReactP5Wrapper),
  { ssr: false }
);

type StatesCitiesOther = {
  state: {
    name: string;
    coords: {
      x: number;
      y: number;
    }[][];
  };
  cities: {
    center: {
      x: number;
      y: number;
    };
    name: string;
  }[];
  roads: {
    x: number;
    y: number;
  }[][];
  hydro: {
    x: number;
    y: number;
  }[][];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const mappingFile = path.join(process.cwd(), 'sources/mapping.json');
  const mappings: { name: string; paths: number[] }[] = JSON.parse(
    (await fs.readFile(mappingFile, 'utf8')).toString()
  );

  const locPaths: string[][] = [];

  const tokenIds = [...Array(2)].map((_, i) => i);

  mappings.forEach((mapping, index) =>
    mapping.paths.forEach((path, pathIndex) => {
      locPaths.push([index.toString(), pathIndex.toString()]);
    })
  );

  return {
    paths: tokenIds.flatMap((t, tokenId) =>
      locPaths.map((locPath) => ({
        params: { id: tokenId.toString(), loc: locPath }
      }))
    ),

    fallback: 'blocking'
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
  loc: string[];
}

const backgrounds: {
  type: 'dark' | 'light';
  bg: string;
  state: string;
  city: string;
  road: string;
  hydro: string;
  bgg: string;
}[] = [
  {
    type: 'light',
    bg: '#F4E9CD',
    state: '#468189',
    city: '#000000',
    road: '#9882AC',
    hydro: '#C1CEFE',
    bgg: '#ffffff'
  },
  {
    type: 'dark',
    bg: '#738cce',
    state: '#FFFFFF',
    city: '#FFFFFF',
    road: '#33032F',
    hydro: '#405cb1',
    bgg: '#000000'
  },
  {
    type: 'light',
    bg: '#e4e4e4',
    state: '#1a1a1a',
    city: '#1a1a1a',
    road: '#2f2f2f',
    hydro: '#2E4057',
    bgg: '#ffffff'
  },
  {
    type: 'dark',
    bg: '#1a1a1a',
    state: '#e4e4e4',
    city: '#e4e4e4',
    road: '#cccccc',
    hydro: '#8896AB',
    bgg: '#000000'
  },
  {
    type: 'light',
    bg: '#eaddf9',
    state: '#b69ccb',
    city: '#808080',
    road: '#b69ccb',
    hydro: '#C4AFD5',
    bgg: '#ffffff'
  },
  {
    type: 'dark',
    bg: '#1d2e26',
    state: '#91c8ac',
    city: '#91c8ac',
    road: '#79b094',
    hydro: '#79b094',
    bgg: '#000000'
  },
  {
    type: 'light',
    bg: '#eaebdf',
    state: '#eaebdf',
    city: '#8c8b89',
    road: '#7f7f7f',
    hydro: '#aadaee',
    bgg: '#aadaee'
  }
];

const scaleBetween = (
  unscaledNum: number,
  min: number,
  max: number,
  minAllowed: number,
  maxAllowed: number
) => {
  return Math.round(((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed);
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Params>) => {
  const stateId = Number.parseInt(params?.loc?.[0]?.toString() ?? '0');

  const file = path.join(process.cwd(), `sources/${stateId}.json`);
  const statesCitiesRoads: StatesCitiesOther = JSON.parse(
    (await fs.readFile(file, 'utf8')).toString()
  );

  const cityId = Number.parseInt(params?.loc?.[1]?.toString() ?? '-1');

  const hash = keccak('keccak256')
    .update(`${params?.id?.toString()}${stateId}${cityId}`)
    .digest('hex');

  const state = statesCitiesRoads?.state ?? null;
  const city: {
    center: {
      x: number;
      y: number;
    };
    name: string;
  } | null = statesCitiesRoads?.cities[cityId] ?? null;

  let hashPairs: number[] = [];
  for (let i = 0; i < 63; i++) {
    let hex = hash.slice(i, i + 2);
    hashPairs[i] = parseInt(hex, 16);
  }

  const colorsIndex = scaleBetween(hashPairs[4], 0, 255, 0, backgrounds.length - 1);

  const isHydro = (hashPairs?.[8] ?? 0) <= 197;

  return {
    props: {
      state,
      city,
      road: isHydro ? null : statesCitiesRoads?.roads,
      hydro: isHydro ? statesCitiesRoads?.hydro : null,
      colors: backgrounds[colorsIndex],
      sI: scaleBetween(hashPairs[10], 0, 255, 2, 4),
      rhI: scaleBetween(hashPairs[14], 0, 255, 1, 2)
    },
    revalidate: 60
  };
};

const IndexPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => (
  <>
    <P5Wrapper
      sketch={(p5) => {
        let coords: { x: number; y: number }[][];
        let cityCoords: { x: number; y: number } | null;
        let roadsOrHydroCoords: { x: number; y: number }[][];

        let count: number;

        let fontRegular: ReturnType<typeof p5.loadFont> | null;

        p5.preload = () => {
          fontRegular = p5.loadFont('/assets/ShadowsIntoLight-Regular.ttf');
        };

        p5.setup = () => {
          let dim = Math.floor(Math.min(window.innerWidth, window.innerHeight));
          p5.createCanvas(dim, dim);
          p5.colorMode(p5.RGB, 255);
          p5.noFill();

          p5.strokeCap(p5.ROUND);
          p5.smooth();

          p5.background(props.colors.bgg);

          count = 0;

          p5.frameRate(30);
          p5.textFont(fontRegular as unknown as string);

          coords =
            props.state?.coords?.map((outer) =>
              outer.map((e) => ({
                x: e.x * p5.width * 0.8 + p5.width * 0.1,
                y: e.y * p5.height * 0.8 + p5.height * 0.1
              }))
            ) ?? [];

          cityCoords = props.city
            ? {
                x: (props.city?.center?.x ?? 0) * p5.width * 0.8 + p5.width * 0.1,
                y: (props.city?.center?.y ?? 0) * p5.height * 0.8 + p5.height * 0.1
              }
            : null;

          roadsOrHydroCoords =
            (props.road ?? props.hydro)?.map((outer) =>
              outer.map((e) => ({
                x: e.x * p5.width * 0.8 + p5.width * 0.1,
                y: e.y * p5.height * 0.8 + p5.height * 0.1
              }))
            ) ?? [];
        };

        p5.draw = () => {
          count++;

          p5.fill(props.colors.bg);
          p5.noStroke();

          coords.map((outer) => {
            p5.beginShape();

            outer?.forEach((coord) => {
              p5.curveVertex(coord.x, coord.y);
            });

            p5.endShape();
          });

          if (props.hydro) {
            p5.fill(props.colors.hydro);
            p5.stroke(props.colors.hydro);
            p5.strokeWeight(p5.width / 1e3);
          } else {
            p5.noFill();
            p5.stroke(props.colors.road);
            p5.strokeWeight(p5.width / 8e3);
          }

          [...Array(count)].forEach((_, i) => {
            if (i >= props.rhI) {
              return;
            }

            roadsOrHydroCoords?.map((outer) => {
              p5.beginShape();

              outer?.forEach((coord, cI) => {
                p5.curveVertex(
                  coord.x + (i + 1) * 0.3 * p5.cos(cI * 5 + i * 40),
                  coord.y - (i + 1) * 0.3 * p5.cos(cI * 5 + i * 40)
                );
              });

              p5.endShape();
            });
          });

          p5.noFill();
          p5.stroke(props.colors.state);

          p5.strokeWeight(p5.width / 3e3);

          [...Array(count)].forEach((_, i) => {
            if (i >= props.sI) {
              return;
            }

            coords.map((outer) => {
              p5.beginShape();

              outer?.forEach((coord, cI) => {
                p5.curveVertex(
                  coord.x + (i + 1) * 0.4 * p5.cos(cI * 5 + i * 20),
                  coord.y - (i + 1) * 0.4 * p5.cos(cI * 5 + i * 20)
                );
              });

              p5.endShape();
            });
          });

          if (cityCoords) {
            p5.fill(props.colors.city);
            p5.stroke(props.colors.city);

            p5.circle(cityCoords?.x ?? 0, cityCoords?.y ?? 0, 6);
          }

          p5.fill(props.colors.type === 'dark' ? '#ffffff' : '#000000');

          p5.textAlign(p5.CENTER, p5.BOTTOM);

          p5.textSize(34);
          p5.text(props.city?.name ?? props.state.name, p5.width * 0.5, p5.height - 30);
        };
      }}
    />
  </>
);

export default IndexPage;
