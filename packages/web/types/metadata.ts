export type Attribute = {
  trait_type:
    | 'State'
    | 'City'
    | 'Country'
    | 'State Iterations'
    | 'Theme'
    | 'Background'
    | 'Type'
    | 'Type Iterations';
  value: string | number;
  display_type?: 'date';
};

export type MetadataResponse = {
  description: string;
  external_url: string;
  animation_url: string;
  background_color: string;
  image: string;
  name: string;
  tags: string[];
  attributes: Attribute[];
};
