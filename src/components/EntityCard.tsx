import { ExternalLink, MapPin } from "lucide-react";
import type { Entity } from "../types";
import { fieldAliases, getClassification, getLinks, getList, getString } from "../lib/data";

interface EntityCardProps {
  entity: Entity | null;
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-200">{value}</dd>
    </div>
  );
}

function ChipList({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <div>
      <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-500">{label}</dt>
      <dd className="mt-2 flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span className="chip" key={value}>
            {value}
          </span>
        ))}
      </dd>
    </div>
  );
}

export function EntityCard({ entity }: EntityCardProps) {
  if (!entity) {
    return (
      <section className="panel-card">
        <h2 className="text-sm font-semibold text-slate-100">Select a marker or list item</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Details from the GeoJSON will appear here, including curation notes and source links when available.
        </p>
      </section>
    );
  }

  const props = entity.properties;
  const aliases = fieldAliases();
  const location = [getString(props, aliases.city), getString(props, ["region_state"]), getString(props, aliases.country)].filter(Boolean).join(", ");
  const links = getLinks(props);

  return (
    <section className="panel-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyanCore">{getClassification(entity)}</p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-white">{entity.name}</h2>
        </div>
      </div>

      {location ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          {location}
        </p>
      ) : null}

      <dl className="mt-5 grid grid-cols-1 gap-4">
        <DetailRow label="PI or lead" value={getString(props, aliases.pi)} />
        <DetailRow label="Institution" value={getString(props, aliases.institution)} />
        <DetailRow label="Entity type" value={getString(props, aliases.entityType)} />
        <ChipList label="Platform tags" values={getList(props, aliases.tags)} />
        <ChipList label="Species" values={getList(props, aliases.species)} />
        <ChipList label="Rydberg role" values={getList(props, aliases.role)} />
        <DetailRow label="Optical tweezers status" value={getString(props, aliases.tweezerStatus)} />
        <DetailRow label="Experimental status" value={getString(props, aliases.experimentalMode)} />
        <DetailRow label="Theory status" value={getString(props, aliases.theoryMode)} />
        <DetailRow label="Curation status" value={getString(props, aliases.status)} />
        <DetailRow label="Notes" value={getString(props, aliases.notes)} />
      </dl>

      {links.length ? (
        <div className="mt-5 border-t border-line pt-4">
          <h3 className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-500">Source links</h3>
          <div className="mt-2 space-y-2">
            {links.map((link) => (
              <a className="source-link" href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noreferrer">
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
