import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsAddress, verifyIntlAddress } from 'src/api/lob';
import { VerifyAddressRequest, VerifyAddressResponse } from 'types';

import iso from 'iso-3166-1';

const usCountryCodes = ['US', 'AS', 'PR', 'FM', 'GU', 'MH', 'MP', 'PW', 'VI'];

const handler = async (req: NextApiRequest, res: NextApiResponse<VerifyAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: VerifyAddressRequest = req.body;

    if (method === 'POST') {
      const isoCountry = iso.whereAlpha2(body.country);

      if (!isoCountry) {
        return res.status(500).end('Country code not accepted.');
      }

      if (usCountryCodes.includes(body.country)) {
        const verifyResult = await verifyUsAddress(
          body.primaryLine,
          body.secondaryLine,
          body.city,
          body.state,
          body.postalCode
        );

        return res.status(200).json(verifyResult);
      }

      const verifyResult = await verifyIntlAddress(
        body.primaryLine,
        body.secondaryLine,
        body.city,
        body.state,
        body.postalCode,
        body.country
      );

      return res.status(200).json(verifyResult);
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
