import lob from 'lob';
import dayjs from 'dayjs';
import { AddressComponents, VerifyIntlAddressResponse, VerifyUsAddressResponse } from 'types';
import { RequestLetterResponse } from 'types/request-letter';

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
  address: AddressComponents,
  mnemonic: string,
  idempotencyKey: string
) => {
  const today = dayjs();

  return new Promise<RequestLetterResponse>((resolve, reject) => {
    Lob.letters.create(
      {
        to: {
          name: address.name,
          address_line1: address.addressLine1,
          address_line2: address.addressLine2,
          address_city: address.city,
          address_state: address.state,
          address_zip: address.postal,
          address_country: address.country
        },
        from: process.env.LOB_ADDRESS_ID,
        file: process.env.LOB_TEMPLATE_ID,
        merge_variables: {
          today_date: today.format('DD/MM/YYYY'),
          valid_date: today.add(8, 'days').format('DD/MM/YYYY'), // 8 days :) to deal with time zone issues and delayed submissions
          country: address.country,
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
