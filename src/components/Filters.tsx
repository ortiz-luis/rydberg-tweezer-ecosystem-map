import { RotateCcw, Search } from "lucide-react";
import type { FilterOptions, FiltersState } from "../types";

interface FiltersProps {
  filters: FiltersState;
  options: FilterOptions;
  onChange: (filters: FiltersState) => void;
  onReset: () => void;
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="filter-label">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Filters({ filters, options, onChange, onReset }: FiltersProps) {
  const update = (patch: Partial<FiltersState>) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-4">
      <label className="space-y-1.5">
        <span className="filter-label">Search</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="field pl-9"
            type="search"
            placeholder="Group, PI, institution, country, tag..."
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
          />
        </div>
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <SelectFilter label="Classification" value={filters.classification} options={options.classifications} onChange={(value) => update({ classification: value })} />
        <SelectFilter label="Entity type" value={filters.entityType} options={options.entityTypes} onChange={(value) => update({ entityType: value })} />
        <SelectFilter label="Country" value={filters.country} options={options.countries} onChange={(value) => update({ country: value })} />
        <SelectFilter label="Species" value={filters.species} options={options.species} onChange={(value) => update({ species: value })} />
        <SelectFilter label="Platform tag" value={filters.tag} options={options.tags} onChange={(value) => update({ tag: value })} />
      </div>

      <button className="secondary-button w-full" type="button" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  );
}
