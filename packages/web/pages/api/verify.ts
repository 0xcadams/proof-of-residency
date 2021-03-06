import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUsAddress, verifyIntlAddress } from 'src/api/lob';
import { AddressComponents, VerifyAddressRequest, VerifyAddressResponse } from 'types';
import { faker } from '@faker-js/faker';

import { signAddressEip712 } from 'src/api/ethers';
import { getIsoCountryForAlpha2 } from 'src/web/token';
import { isValidProofOfResidencyNetwork } from 'src/contracts';

const usCountryCodes = ['US', 'AS', 'PR', 'FM', 'GU', 'MH', 'MP', 'PW', 'VI'];

const handler = async (req: NextApiRequest, res: NextApiResponse<VerifyAddressResponse | null>) => {
  try {
    const method = req.method;
    const body: VerifyAddressRequest = req.body;

    if (method === 'POST') {
      const expiration = new Date().getTime() + 3600000;

      const name = `${faker.name.firstName()} ${faker.name.lastName()} or Current Resident`;

      const isoCountry = getIsoCountryForAlpha2(body.country);

      if (!isoCountry) {
        return res.status(500).end('Country code not accepted.');
      }
      if (!body.chain || !isValidProofOfResidencyNetwork(body.chain)) {
        return res.status(500).end('Chain ID must be valid');
      }

      if (usCountryCodes.includes(body.country)) {
        const verifyResult = await verifyUsAddress(
          body.primaryLine,
          body.secondaryLine,
          body.city,
          body.state,
          body.postalCode
        );

        const address: AddressComponents = {
          name,

          addressLine1: verifyResult.primary_line,
          addressLine2: verifyResult.secondary_line,
          city: verifyResult.components.city,
          state: verifyResult.components.state,
          postal: verifyResult.components.zip_code,
          country: body.country,

          deliverability: verifyResult.deliverability,

          expiration
        };

        const signature = await signAddressEip712(address, body.chain);

        return res.status(200).json({
          ...address,

          signature,

          latitude: verifyResult.components.latitude,
          longitude: verifyResult.components.longitude,

          lastLine: verifyResult.last_line
        });
      }

      const verifyResult = await verifyIntlAddress(
        body.primaryLine,
        body.secondaryLine,
        body.city,
        body.state,
        body.postalCode,
        body.country
      );

      const address: AddressComponents = {
        name,

        addressLine1: verifyResult.primary_line,
        addressLine2: verifyResult.secondary_line,
        city: verifyResult.components.city,
        state: verifyResult.components.state,
        postal: verifyResult.components.postal_code,
        country: body.country,

        deliverability: verifyResult.deliverability,

        expiration
      };

      const signature = await signAddressEip712(address, body.chain);

      return res.status(200).json({ ...address, signature, lastLine: verifyResult.last_line });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
};

export default handler;
