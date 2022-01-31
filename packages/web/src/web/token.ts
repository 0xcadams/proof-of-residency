import { BigNumber } from 'ethers';
import iso from 'iso-3166-1';

export const getCountryAndTokenNumber = (tokenId: BigNumber | string) => {
  const tokenIdNumber = BigNumber.from(tokenId);
  const countryId = tokenIdNumber.div(1e15);
  const tokenNumber = tokenIdNumber.mod(1e15);

  return { countryId, tokenNumber };
};

export const getIsoCountryForAlpha3 = (alpha3: string) => {
  return getAllCountries().find((country) => country.alpha3 === alpha3);
};

export const getIsoCountryForCountryId = (countryId: number) => {
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

export const getAllCountries = () => iso.all().filter((e) => !blacklist.includes(e.numeric));

export const getTokenIdForAllCountries = () =>
  getAllCountries().map((country) => ({
    ...country,
    id: BigNumber.from(Number(country.numeric)).mul(1e15).add(7).toString()
  }));

export const getCacheableTokenIds = () =>
  getAllCountries().flatMap((country) => {
    const tokenCounts = [...Array(1)].map((_, i) => i + 1);

    return tokenCounts.map((tokenCount) =>
      BigNumber.from(Number(country.numeric)).mul(1e15).add(tokenCount).toString()
    );
  });
