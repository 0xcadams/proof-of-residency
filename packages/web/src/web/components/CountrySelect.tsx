import { Select } from '@chakra-ui/react';
import iso from 'iso-3166-1';

export type CountrySelectProps = {
  onChange: (country: string) => void;
  disabled?: boolean;
};

export const CountrySelect = (props: CountrySelectProps) => {
  return (
    <Select
      isDisabled={props.disabled}
      onChange={(option) => props.onChange(option.target.value)}
      placeholder="Select your country"
    >
      {iso.all().map((country) => (
        <option key={country.alpha2} value={country.alpha2}>
          {country.country}
        </option>
      ))}
    </Select>
  );
};
