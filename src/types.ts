export type EntityProperties = Record<string, unknown>;

export interface EntityFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: EntityProperties;
}

export interface EntityCollection {
  type: "FeatureCollection";
  features: EntityFeature[];
}

export interface Entity {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  properties: EntityProperties;
}

export interface FiltersState {
  search: string;
  classification: string;
  entityType: string;
  country: string;
  species: string;
  tag: string;
}

export interface FilterOptions {
  classifications: string[];
  entityTypes: string[];
  countries: string[];
  species: string[];
  tags: string[];
}
