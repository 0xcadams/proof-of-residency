import lob from 'lob';
import { VerifyIntlAddressResponse, VerifyUsAddressResponse } from 'types';

const Lob = lob(process.env.LOB_API_KEY);

export const verifyUsAddress = async (
  primaryLine: string,
  secondaryLine: string | undefined,
  city: string,
  state: string,
  zipCode: string
) => {
  return new Promise<VerifyUsAddressResponse>((resolve, reject) => {
    Lob.usVerifications.verify(
      {
        primary_line: primaryLine,
        secondary_line: secondaryLine,
        city: city,
        state: state,
        zip_code: zipCode
      },
      function (err: Error, res: any) {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      }
    );
  });
};

export const verifyIntlAddress = async (
  primaryLine: string,
  secondaryLine: string | undefined,
  city: string,
  state: string,
  postalCode: string,
  country: string
) => {
  return new Promise<VerifyIntlAddressResponse>((resolve, reject) => {
    Lob.intlVerifications.verify(
      {
        primary_line: primaryLine,
        secondary_line: secondaryLine,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country
      },
      function (err: Error, res: any) {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      }
    );
  });
};
