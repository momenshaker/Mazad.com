# Global Acceptance Criteria Matrix

This matrix ties the MVP scope to verifiable outcomes across documentation, data, and application layers.

## Data & Taxonomy (AC-01 to AC-04)
| ID | Description | Verification |
|----|-------------|--------------|
| AC-01 | `data/categories.json` lists all nine super-categories with stable slugs and nested subcategories. | Run `npm run validate` → categories schema passes. |
| AC-02 | `data/filters.json` defines filter configurations per category (type, options, dependencies). | Run `npm run validate` → filters schema passes. |
| AC-03 | Vehicles JSON includes brand, model, `year_min`, `year_max`, `trims[]`, `condition.options`, and used-only attributes. | Run `npm run validate` → vehicles schema passes. |
| AC-04 | JSON validates against schemas in `/schemas` via `scripts/validate-json.mjs`. | Command exit code 0 with summary log. |

## Documentation & Planning (AC-05 to AC-08)
| ID | Description | Verification |
|----|-------------|--------------|
| AC-05 | User stories cover buyer and seller personas with MVP1–3 labels. | Review `docs/30-user-stories-buyer.md` and `docs/31-user-stories-seller.md`. |
| AC-06 | Roadmap outlines MVP1–3 with milestones, KPIs, and dependencies. | Review `docs/50-roadmap-mvp1-3.md`. |
| AC-07 | IA spec includes Mermaid diagram and wireframe annotations for listing flow. | Review `docs/40-ia-menu-spec.md`. |
| AC-08 | Vehicles taxonomy documentation details CSV/JSON workflow. | Review `docs/20-vehicles-taxonomy.md`. |

## Application Scaffold (AC-09 to AC-12)
| ID | Description | Verification |
|----|-------------|--------------|
| AC-09 | Next.js app builds with TypeScript and renders category menu from `data/categories.json`. | Run `npm run build` or `npm run dev` locally; screenshot optional. |
| AC-10 | `/categories/[slug]` page shows subcategories and filter chips. | Manual QA via dev server. |
| AC-11 | `/categories/cars/[brand]/[model]` renders vehicle model overview with trims list. | Manual QA via dev server with seeded data. |
| AC-12 | Filter panel component shows conditional fields based on `visibleWhen`. | Manual QA verifying toggled state. |

## Operational Excellence (AC-13 to AC-15)
| ID | Description | Verification |
|----|-------------|--------------|
| AC-13 | Scripts exist for JSON validation and vehicles JSON generation. | Inspect `scripts/validate-json.mjs`, `scripts/generate-vehicles-json.mjs`. |
| AC-14 | README and docs provide onboarding guidance for engineers. | Review `README.md` updates. |
| AC-15 | Localization keys seeded for English & Arabic placeholders. | Check `data/i18n/en.json`, `data/i18n/ar.json`. |
