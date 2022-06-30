import { MultiPolygon, Polygon } from '@turf/turf';

// input files
type CountryProperties = {
  name: string;
};

type CountryGeo = {
  type: string;
  id: string;
  properties: CountryProperties;
  geometry: Polygon | MultiPolygon;
};

export type AllCountries = {
  type: string;
  features: CountryGeo[];
};

export type AllWaterBodies = {
  type: 'GeometryCollection';
  geometries: MultiPolygon[];
};

// outputs
export type Country = {
  country: {
    coordinates: {
      x: number;
      y: number;
    }[][][];
    country: string;
    alpha2: string;
    alpha3: string;
    numeric: string;
  };
  waterBodies: {
    x: number;
    y: number;
  }[][][];
};
