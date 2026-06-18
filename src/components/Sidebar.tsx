import type { Entity, FilterOptions, FiltersState } from "../types";
import { getClassification, getString, fieldAliases } from "../lib/data";
import { EntityCard } from "./EntityCard";
import { Filters } from "./Filters";
import { StatsBar } from "./StatsBar";

interface SidebarProps {
  entities: Entity[];
  totalCount: number;
  selectedEntity: Entity | null;
  filters: FiltersState;
  options: FilterOptions;
  onFiltersChange: (filters: FiltersState) => void;
  onResetFilters: () => void;
  onSelectEntity: (entity: Entity) => void;
}

export function Sidebar({
  entities,
  totalCount,
  selectedEntity,
  filters,
  options,
  onFiltersChange,
  onResetFilters,
  onSelectEntity,
}: SidebarProps) {
  const aliases = fieldAliases();

  return (
    <aside className="sidebar">
      <div className="space-y-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanCore">Neutral atoms</p>
          <h1 className="mt-2 text-3xl font-semibold leading-none text-white">Rydberg Tweezer Ecosystem Map</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            A curated map of research groups, companies, and theory nodes working on neutral-atom Rydberg platforms and optical tweezer arrays.
          </p>
        </header>

        <StatsBar filteredCount={entities.length} totalCount={totalCount} />
        <Filters filters={filters} options={options} onChange={onFiltersChange} onReset={onResetFilters} />
        <EntityCard entity={selectedEntity} />
      </div>

      <section className="space-y-2 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visible entities</h2>
        <div className="entity-list">
          {entities.length ? (
            entities.map((entity) => (
              <button
                className={`entity-row ${selectedEntity?.id === entity.id ? "entity-row-active" : ""}`}
                key={entity.id}
                type="button"
                onClick={() => onSelectEntity(entity)}
              >
                <span className="entity-title">{entity.name}</span>
                <span className="entity-meta">
                  {getString(entity.properties, aliases.country, "Unknown country")} · {getClassification(entity)}
                </span>
              </button>
            ))
          ) : (
            <p className="rounded-md border border-line bg-white/[0.03] p-4 text-sm text-slate-400">No entities match the current filters.</p>
          )}
        </div>
      </section>
    </aside>
  );
}
