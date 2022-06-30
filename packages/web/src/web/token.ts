import { BigNumber } from 'ethers';
import iso from 'iso-3166-1';
import { Country } from 'iso-3166-1/dist/iso-3166';

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
