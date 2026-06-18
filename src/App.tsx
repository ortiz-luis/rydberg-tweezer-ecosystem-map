import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Entity, FiltersState } from "./types";
import { buildFilterOptions, filterEntities, loadEntities } from "./lib/data";
import { MapView } from "./components/MapView";
import { Sidebar } from "./components/Sidebar";

const DEFAULT_FILTERS: FiltersState = {
  search: "",
  classification: "",
  entityType: "",
  country: "",
  species: "",
  tag: "",
};

export default function App() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntities()
      .then((loaded) => {
        setEntities(loaded);
        setSelectedEntity(loaded[0] ?? null);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load ecosystem data."))
      .finally(() => setLoading(false));
  }, []);

  const options = useMemo(() => buildFilterOptions(entities), [entities]);
  const filteredEntities = useMemo(() => filterEntities(entities, filters), [entities, filters]);

  useEffect(() => {
    if (selectedEntity && !filteredEntities.some((entity) => entity.id === selectedEntity.id)) {
      setSelectedEntity(filteredEntities[0] ?? null);
    }
  }, [filteredEntities, selectedEntity]);

  if (loading) {
    return (
      <main className="state-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cyanCore" />
        <p>Loading ecosystem GeoJSON...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="state-screen">
        <AlertTriangle className="h-8 w-8 text-amberRel" />
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="app-layout">
      <Sidebar
        entities={filteredEntities}
        totalCount={entities.length}
        selectedEntity={selectedEntity}
        filters={filters}
        options={options}
        onFiltersChange={setFilters}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        onSelectEntity={setSelectedEntity}
      />
      <MapView entities={filteredEntities} selectedEntity={selectedEntity} onSelectEntity={setSelectedEntity} />
    </main>
  );
}
