import type { Entity, EntityCollection, EntityFeature, EntityProperties, FilterOptions, FiltersState } from "../types";

export const DATA_URL = `${import.meta.env.BASE_URL}data/rydberg_tweezer_ecosystem_map_export_v2_1.geojson`;

const FALLBACK = "Unknown";

const FIELD_ALIASES = {
  id: ["entry_id", "id", "slug"],
  name: ["name", "entity_name", "group", "organization"],
  pi: ["PI_or_leads", "pi", "lead", "leads", "principal_investigator"],
  institution: ["institution", "affiliation", "organization"],
  city: ["city"],
  country: ["country"],
  classification: ["confidence", "classification", "map_layer"],
  entityType: ["entity_type", "type", "category"],
  tags: ["platform_tags", "tags"],
  species: ["species", "atom_species"],
  role: ["rydberg_role", "role"],
  tweezerStatus: ["optical_tweezers_status", "tweezer_status"],
  experimentalMode: ["experimental_mode"],
  theoryMode: ["theory_mode"],
  notes: ["notes", "description"],
  status: ["status", "curation_status", "confidence"],
} as const;

export function getString(props: EntityProperties, keys: readonly string[], fallback = ""): string {
  for (const key of keys) {
    const value = props[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

export function getList(props: EntityProperties, keys: readonly string[]): string[] {
  const raw = getString(props, keys);
  if (!raw) return [];
  return raw
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getLinks(props: EntityProperties): Array<{ label: string; url: string }> {
  return Object.entries(props)
    .filter(([key, value]) => key.toLowerCase().includes("url") || key.toLowerCase().includes("website") || key.toLowerCase().includes("link"))
    .filter(([, value]) => typeof value === "string" && value.trim().startsWith("http"))
    .map(([key, value]) => ({
      label: key.replace(/_/g, " "),
      url: String(value),
    }));
}

export function getClassification(entity: Entity): string {
  const raw = getString(entity.properties, FIELD_ALIASES.classification, FALLBACK);
  if (/^a\b|core a/i.test(raw)) return "A core";
  if (/^b\b|relevant b/i.test(raw)) return "B relevant";
  if (/^c\b|adjacent c/i.test(raw)) return "C adjacent";
  return raw;
}

export function classificationColor(classification: string): string {
  if (classification.startsWith("A")) return "#54d5ff";
  if (classification.startsWith("B")) return "#f4c96b";
  if (classification.startsWith("C")) return "#83e6b4";
  return "#cbd5e1";
}

export function fieldAliases() {
  return FIELD_ALIASES;
}

export async function loadEntities(): Promise<Entity[]> {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ecosystem GeoJSON (${response.status})`);
  }

  const collection = (await response.json()) as EntityCollection;
  if (!Array.isArray(collection.features)) {
    throw new Error("GeoJSON is missing a features array.");
  }

  return collection.features.flatMap((feature: EntityFeature, index) => {
    const coordinates = feature.geometry?.coordinates;
    if (feature.geometry?.type !== "Point" || !Array.isArray(coordinates) || coordinates.length < 2) {
      return [];
    }

    const [longitude, latitude] = coordinates;
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return [];

    const properties = feature.properties ?? {};
    const id = getString(properties, FIELD_ALIASES.id, `entity-${index}`);
    const name = getString(properties, FIELD_ALIASES.name, `Entity ${index + 1}`);

    return [{ id, name, longitude, latitude, properties }];
  });
}

export function buildFilterOptions(entities: Entity[]): FilterOptions {
  const classifications = new Set<string>();
  const entityTypes = new Set<string>();
  const countries = new Set<string>();
  const species = new Set<string>();
  const tags = new Set<string>();

  for (const entity of entities) {
    classifications.add(getClassification(entity));
    const props = entity.properties;
    const type = getString(props, FIELD_ALIASES.entityType);
    const country = getString(props, FIELD_ALIASES.country);
    if (type) entityTypes.add(type);
    if (country) countries.add(country);
    getList(props, FIELD_ALIASES.species).forEach((value) => species.add(value));
    getList(props, FIELD_ALIASES.tags).forEach((value) => tags.add(value));
  }

  const sort = (values: Set<string>) => [...values].filter(Boolean).sort((a, b) => a.localeCompare(b));
  return {
    classifications: sort(classifications),
    entityTypes: sort(entityTypes),
    countries: sort(countries),
    species: sort(species),
    tags: sort(tags),
  };
}

export function filterEntities(entities: Entity[], filters: FiltersState): Entity[] {
  const query = filters.search.trim().toLowerCase();
  return entities.filter((entity) => {
    const props = entity.properties;
    const searchable = [entity.name, ...Object.values(props).map((value) => String(value ?? ""))].join(" ").toLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (filters.classification && getClassification(entity) !== filters.classification) return false;
    if (filters.entityType && getString(props, FIELD_ALIASES.entityType) !== filters.entityType) return false;
    if (filters.country && getString(props, FIELD_ALIASES.country) !== filters.country) return false;
    if (filters.species && !getList(props, FIELD_ALIASES.species).includes(filters.species)) return false;
    if (filters.tag && !getList(props, FIELD_ALIASES.tags).includes(filters.tag)) return false;
    return true;
  });
}
