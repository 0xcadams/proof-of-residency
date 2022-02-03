import { BigNumber } from 'ethers';
import iso from 'iso-3166-1';
import { Country } from 'iso-3166-1/dist/iso-3166';
import { getPopulationForAlpha3 } from './populations';

export type CountryIso = Country;

export const getIsoCountryForAlpha3 = (alpha3: string): CountryIso | undefined => {
  return getAllCountries().find((country) => country.alpha3 === alpha3);
};

export const getIsoCountryForAlpha2 = (alpha2: string): CountryIso | undefined => {
  return getAllCountries().find((country) => country.alpha2 === alpha2);
};

export const getCountryAndTokenNumber = (tokenId: string) => {
  const tokenIdNumber = BigNumber.from(tokenId);
  const countryId = tokenIdNumber.div(1e15);
  const tokenNumber = tokenIdNumber.mod(1e15);

  return { countryId, tokenNumber };
};

export const getIsoCountryForCountryId = (countryId: number): CountryIso | undefined => {
  return getAllCountries().find(
    (country) => country.numeric === countryId.toString().padStart(3, '0')
  );
};

const blacklist = [
  '535',
  '074',
  '162',
  '166',
  '254',
  '260',
  '292',
  '312',
  '336',
  '474',
  '175',
  '683',
  '744',
  '772',
  '798',
  '581',
  '638',
  '010'
];

export const getTokenIdsForCountryAndCount = (country: number, count: number) =>
  [...Array(count)].map((_, tokenNumber) =>
    BigNumber.from(Number(country))
      .mul(1e15)
      .add(tokenNumber + 1)
      .toString()
  );

export const getAllCountries = (): CountryIso[] =>
  iso.all().filter((e) => !blacklist.includes(e.numeric));

export const getTokenIdForAllCountries = () =>
  getAllCountries().map((country) => ({
    ...country,
    id: BigNumber.from(Number(country.numeric)).mul(1e15).add(7).toString()
  }));

export const getCacheableTokenIds = () =>
  getAllCountries().flatMap((country) => {
    // generate the cacheable token IDs from the population size
    const count = Math.floor((getPopulationForAlpha3(country.alpha3) ?? 2e6) / 8e5);

    // floor at 1
    const tokenCounts = [...Array(count > 0 ? count : 1)].map((_, i) => i + 1);

    return tokenCounts.map((tokenCount) =>
      BigNumber.from(Number(country.numeric)).mul(1e15).add(tokenCount).toString()
    );
  });
