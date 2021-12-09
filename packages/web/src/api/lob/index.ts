import lob from 'lob';
import { VerifyUsAddressResponse } from 'types';

const Lob = lob(process.env.LOB_API_KEY);

export const verifyUsAddress = async (
  primaryLine: string,
  city: string,
  state: string,
  zipCode: string
) => {
  return new Promise<VerifyUsAddressResponse>((resolve, reject) => {
    Lob.usVerifications.verify(
      {
        primary_line: primaryLine,
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
