# Rydberg Tweezer Ecosystem Map

A static GitHub Pages app for exploring a curated GeoJSON database of research groups, companies, theory nodes, and adjacent ecosystem actors working on neutral-atom Rydberg platforms and optical tweezer arrays.

## Local Development

```bash
npm install
npm run dev
```

The app loads its source data from:

```text
public/data/rydberg_tweezer_ecosystem_map_export_v2_1.geojson
```

## Updating the GeoJSON

Replace the file at `public/data/rydberg_tweezer_ecosystem_map_export_v2_1.geojson` with a new export. The app reads the GeoJSON at runtime and preserves the properties attached to each point feature. Keep the filename stable unless you also update `src/lib/data.ts`.

The optional CSV export is available at `public/data/rydberg_tweezer_ecosystem_map_export_v2_1.csv`.

## Build

```bash
npm run build
```

The production bundle is written to `dist/`.

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`, which builds the Vite app and deploys it to GitHub Pages with GitHub Actions.

In GitHub, open the repository settings, go to **Pages**, and set **Build and deployment** to **GitHub Actions**. Push to `main` and the workflow will publish the site.

The Vite base path is computed from `GITHUB_REPOSITORY` during Actions builds, so the app works under the repository subpath used by project Pages.

## Curation Disclaimer

The map is curated and evolving. Classifications are not absolute truth:

- A core: directly relevant/core Rydberg tweezer ecosystem node.
- B relevant: relevant theory, company, architecture, software, or adjacent experimental node.
- C adjacent: adjacent or boundary case kept for ecosystem context.
