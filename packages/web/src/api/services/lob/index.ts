import lob from 'lob';

const Lob = lob(process.env.LOB_API_KEY);

export interface Components {
  primary_number: string;
  street_predirection: string;
  street_name: string;
  street_suffix: string;
  street_postdirection: string;
  secondary_designator: string;
  secondary_number: string;
  pmb_designator: string;
  pmb_number: string;
  extra_secondary_designator: string;
  extra_secondary_number: string;
  city: string;
  state: string;
  zip_code: string;
  zip_code_plus_4: string;
  zip_code_type: string;
  delivery_point_barcode: string;
  address_type: string;
  record_type: string;
  default_building_address: boolean;
  county: string;
  county_fips: string;
  carrier_route: string;
  carrier_route_type: string;
  latitude: number;
  longitude: number;
}

export interface DeliverabilityAnalysis {
  dpv_confirmation: string;
  dpv_cmra: string;
  dpv_vacant: string;
  dpv_active: string;
  dpv_footnotes: string[];
  ews_match: boolean;
  lacs_indicator: string;
  lacs_return_code: string;
  suite_return_code: string;
}

export interface LobConfidenceScore {
  score?: any;
  level: string;
}

export interface VerifyUsAddressResponse {
  id: string;
  recipient: string;
  primary_line: string;
  secondary_line: string;
  urbanization: string;
  last_line: string;
  deliverability:
    | 'deliverable'
    | 'deliverable_unnecessary_unit'
    | 'deliverable_incorrect_unit'
    | 'deliverable_missing_unit'
    | 'undeliverable';
  components: Components;
  deliverability_analysis: DeliverabilityAnalysis;
  lob_confidence_score: LobConfidenceScore;
  object: string;
}

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
