import lob from 'lob';
import * as dayjs from 'dayjs';
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
        primary_line: process.env.NODE_ENV === 'development' ? 'deliverable' : primaryLine,
        secondary_line: secondaryLine,
        city: city,
        state: state,
        zip_code: process.env.NODE_ENV === 'development' ? '11111' : zipCode
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
        primary_line: process.env.NODE_ENV === 'development' ? 'deliverable' : primaryLine,
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

export const sendLetter = (
  name: string,
  primaryLine: string,
  secondaryLine: string | undefined,
  lastLine: string,
  country: string,

  mnemonic: string,

  idempotencyKey: string
) => {
  return new Promise<VerifyIntlAddressResponse>((resolve, reject) => {
    Lob.letters.create(
      {
        to: {
          name,
          primary_line: primaryLine,
          secondary_line: secondaryLine,
          last_line: lastLine,
          country
        },
        from: process.env.LOB_ADDRESS_ID,
        file: process.env.LOB_TEMPLATE_ID,
        merge_variables: {
          today_date: dayjs.default().format('DD/MM/YYYY'),
          country,
          mnemonic
        },
        color: true
      },
      { 'idempotency-key': idempotencyKey },
      function (err: Error, res: any) {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      }
    );
  });
};
