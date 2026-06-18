# Rydberg Tweezer Ecosystem Map - Codex package

This ZIP contains the data and instructions needed for Codex to create a modern static GitHub Pages website.

## Main data files

Use this file as the web app source of truth:

`public/data/rydberg_tweezer_ecosystem_map_export_v2_1.geojson`

Additional files:

- `data/rydberg_tweezer_ecosystem_map_export_v2_1.csv`: tabular export for debugging or optional download.
- `data/rydberg_tweezer_ecosystem_db_v2_1.xlsx`: full curated database with internal curation sheets.

## Desired website

A modern interactive world map of research groups, companies, theory nodes, and adjacent ecosystem actors working on neutral-atom Rydberg platforms and optical tweezer arrays.

Recommended stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- Leaflet + react-leaflet
- GitHub Pages
- No backend
- No database server

## Recommended repository data path

Codex should copy the GeoJSON to:

`public/data/rydberg_tweezer_ecosystem_map_export_v2_1.geojson`

The app should load data from that path.

## Important curation note

The map is curated and evolving. The classification field should not be treated as an absolute truth:

- A core: directly relevant/core Rydberg tweezer ecosystem node.
- B relevant: relevant theory, company, architecture, software, or adjacent experimental node.
- C adjacent: adjacent or boundary case kept for ecosystem context.
