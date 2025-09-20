# Mazad.com MVP Workspace

This repository contains the documentation, data catalogs, and Next.js scaffold for the Mazad.com marketplace MVP. It follows the operating modes described in `agent_md_mazad.md` and ships artifacts for product, design, and engineering stakeholders.

## Repository Structure
- `docs/` – Planning artifacts including category tree, vehicles taxonomy guide, user stories, IA spec, and roadmap.
- `data/` – JSON/CSV catalogs for categories, filters, vehicles, and localization keys.
- `schemas/` – JSON Schemas that validate category, filter, and vehicle datasets.
- `scripts/` – Utility scripts for generating vehicles JSON and validating data assets.
- `app/` – Next.js (App Router) scaffold with TypeScript, Tailwind CSS, and sample pages/components.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate vehicles JSON from CSV sources**
   ```bash
   npm run generate:vehicles
   ```
3. **Validate JSON assets against schemas**
   ```bash
   npm run validate
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to explore the scaffold (category browse, filters mock, vehicles taxonomy pages).

## Available Scripts
- `npm run generate:vehicles` – Reads CSV files in `data/vehicles/` and writes `vehicles.json`.
- `npm run validate` – Validates `data/categories.json`, `data/filters.json`, and `data/vehicles/vehicles.json` against schemas.
- `npm run dev` – Starts Next.js in development mode.
- `npm run build` – Builds production output.
- `npm run lint` – Runs ESLint using Next.js defaults.

## Data Workflow
1. Update CSV catalogs (`brands.csv`, `models.csv`, `trims.csv`).
2. Run `npm run generate:vehicles` to rebuild `vehicles.json`.
3. Commit CSV and JSON changes together.
4. Execute `npm run validate` before submitting PRs.

## Documentation Index
- [Overview](docs/00-overview.md)
- [Category Tree](docs/10-category-tree.md)
- [Vehicles Taxonomy](docs/20-vehicles-taxonomy.md)
- [Buyer Stories](docs/30-user-stories-buyer.md)
- [Seller Stories](docs/31-user-stories-seller.md)
- [Acceptance Criteria Matrix](docs/32-acceptance-criteria.md)
- [IA & Menu Spec](docs/40-ia-menu-spec.md)
- [Roadmap](docs/50-roadmap-mvp1-3.md)

## Linting & Formatting
The project relies on ESLint (Next.js configuration) and Tailwind CSS for styling. Prettier is not included; format using your editor defaults.

## License
All generated assets are work-for-hire for Mazad.com. See `agent_md_mazad.md` for additional constraints.
