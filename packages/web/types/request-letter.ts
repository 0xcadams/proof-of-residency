export type To = {
  id: string;
  description?: any;
  name: string;
  company?: any;
  phone?: any;
  email?: any;
  address_line1: string;
  address_line2?: any;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  date_created: Date;
  date_modified: Date;
  deleted: boolean;
  object: string;
};

export type From = {
  id: string;
  description?: any;
  name?: any;
  company: string;
  phone?: any;
  email?: any;
  address_line1: string;
  address_line2?: any;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  date_created: string;
  date_modified: string;
  object: string;
};

export type MergeVariables = {
  today_date: string;
  valid_date: string;
  country: string;
  mnemonic: string;
};

export type Thumbnail = {
  small: string;
  medium: string;
  large: string;
};

export type RequestLetterResponse = {
  id: string;
  description?: any;
  to: To;
  from: From;
  color: boolean;
  double_sided: boolean;
  address_placement: string;
  return_envelope: boolean;
  perforated_page?: any;
  custom_envelope?: any;
  extra_service?: any;
  mail_type: string;
  url: string;
  merge_variables: MergeVariables;
  template_id: string;
  template_version_id: string;
  carrier: string;
  tracking_number?: any;
  tracking_events: any[];
  thumbnails: Thumbnail[];
  expected_delivery_date: string;
  date_created: Date;
  date_modified: Date;
  send_date: Date;
  object: string;
};
