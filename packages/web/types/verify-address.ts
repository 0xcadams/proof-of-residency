import { AddressComponents } from './submit-address';

export type Components = {
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
};

export type DeliverabilityAnalysis = {
  dpv_confirmation: string;
  dpv_cmra: string;
  dpv_vacant: string;
  dpv_active: string;
  dpv_footnotes: string[];
  ews_match: boolean;
  lacs_indicator: string;
  lacs_return_code: string;
  suite_return_code: string;
};

export type LobConfidenceScore = {
  score?: any;
  level: string;
};

export interface IntlComponents {
  primary_number: string;
  street_name: string;
  city: string;
  state: string;
  postal_code: string;
}

export type VerifyIntlAddressResponse = {
  recipient: string;
  primary_line: string;
  secondary_line: string;
  last_line: string;
  country: string;
  coverage: 'SUBBUILDING' | 'HOUSENUMBER/BUILDING' | 'STREET' | 'LOCALITY' | 'SPARSE';
  deliverability: 'deliverable' | 'deliverable_missing_info' | 'undeliverable' | 'no_match';
  status:
    | 'LV4'
    | 'LV3'
    | 'LV2'
    | 'LV1'
    | 'LF4'
    | 'LF3'
    | 'LF2'
    | 'LF1'
    | 'LM4'
    | 'LM3'
    | 'LM2'
    | 'LU1';
  components: Partial<IntlComponents>;
  object: 'intl_verification';
  id: string;
};

export type VerifyUsAddressResponse = {
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
  components: Partial<Components>;
  deliverability_analysis: DeliverabilityAnalysis;
  lob_confidence_score: LobConfidenceScore;
  object: 'us_verification';
};

export type VerifyAddressResponse = AddressComponents & {
  lastLine: string;

  latitude?: number;
  longitude?: number;

  signature: string;
};

export type VerifyAddressRequest = {
  primaryLine: string;
  secondaryLine?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
