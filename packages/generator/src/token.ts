import { BigNumber } from "ethers";
import iso from "iso-3166-1";
import { getPopulationForAlpha3 } from "./populations";

export const colors = [
  {
    name: "Apped",
    type: "Light",
    bg: "#F4E9CD",
    country: "#468189",
    city: "#0a0a0a",
    road: "#9882AC",
    hydro: "#C1CEFE",
    bgg: "#ffffff",
  },
  {
    name: "Aqua",
    type: "Dark",
    bg: "#738cce",
    country: "#FFFFFF",
    city: "#151515",
    road: "#33032F",
    hydro: "#405cb1",
    bgg: "#000000",
  },
  {
    name: "Steel",
    type: "Light",
    bg: "#e4e4e4",
    country: "#1a1a1a",
    city: "#101010",
    road: "#2f2f2f",
    hydro: "#2E4057",
    bgg: "#ffffff",
  },
  {
    name: "Knight",
    type: "Dark",
    bg: "#1a1a1a",
    country: "#e4e4e4",
    city: "#505050",
    road: "#cccccc",
    hydro: "#8896AB",
    bgg: "#000000",
  },
  {
    name: "Cotton Candy",
    type: "Light",
    bg: "#eaddf9",
    country: "#b69ccb",
    city: "#101010",
    road: "#b69ccb",
    hydro: "#C4AFD5",
    bgg: "#ffffff",
  },
  {
    name: "Radar",
    type: "Dark",
    bg: "#1d2e26",
    country: "#91c8ac",
    city: "#404040",
    road: "#79b094",
    hydro: "#79b094",
    bgg: "#000000",
  },
  {
    name: "Blue Sky",
    type: "Light",
    bg: "#eaebdf",
    country: "#7f7f7f",
    city: "#0a0a0a",
    road: "#7f7f7f",
    hydro: "#aadaee",
    bgg: "#aadaee",
  },
  {
    name: "Schwifty",
    type: "Dark",
    bg: "#1a1a1a",
    country: "#e4e4e4",
    city: "#808080",
    road: "#b69ccb",
    hydro: "#b69ccb",
    bgg: "#000000",
  },
] as const;

export const metadata = (tokenId: string) => {
  const { tokenNumber } = getCountryAndTokenNumber(tokenId);
  const colorsIndex = tokenNumber.mod(colors.length);

  const sI = tokenNumber.mod(2).add(2);
  const rhI = tokenNumber.mod(2).add(1);

  return {
    colors: colors[colorsIndex.toNumber()] ?? colors[0],
    sI: sI.toNumber(),
    rhI: rhI.toNumber(),
  };
};

export const getIsoCountryForAlpha3 = (alpha3: string) => {
  return getAllCountries().find((country) => country.alpha3 === alpha3);
};

export const getCountryAndTokenNumber = (tokenId: string) => {
  const tokenIdNumber = BigNumber.from(tokenId);
  const countryId = tokenIdNumber.div(1e15);
  const tokenNumber = tokenIdNumber.mod(1e15);

  return { countryId, tokenNumber };
};

export const getIsoCountryForCountryId = (countryId: number) => {
  return getAllCountries().find(
    (country) => country.numeric === countryId.toString().padStart(3, "0")
  );
};

const blacklist = [
  "535",
  "074",
  "162",
  "166",
  "254",
  "260",
  "292",
  "312",
  "336",
  "474",
  "175",
  "683",
  "744",
  "772",
  "798",
  "581",
  "638",
  "010",
];

export const getTokenIdsForCountryAndCount = (country: number, count: number) =>
  [...Array(count)].map((_, tokenNumber) =>
    BigNumber.from(Number(country))
      .mul(1e15)
      .add(tokenNumber + 1)
      .toString()
  );

export const getAllCountries = () =>
  iso.all().filter((e) => !blacklist.includes(e.numeric));

export const getTokenIdForAllCountries = () =>
  getAllCountries().map((country) => ({
    ...country,
    id: BigNumber.from(Number(country.numeric)).mul(1e15).add(7).toString(),
  }));

export const getCacheableTokenIds = () =>
  getAllCountries().flatMap((country) => {
    // generate the cacheable token IDs from the population size
    const count = Math.floor(
      Math.min(getPopulationForAlpha3(country.alpha3) ?? 1e8, 1e8) / 5e5
    );

    // floor at 1
    const tokenCounts = [...Array(count > 0 ? count : 1)].map((_, i) => i + 1);

    return tokenCounts.map((tokenCount) =>
      BigNumber.from(Number(country.numeric))
        .mul(1e15)
        .add(tokenCount)
        .toString()
    );
  });
