# Mazad.com MVP Overview

## Vision
Mazad.com is a Saudi marketplace that brings transparency and trust to auctions across vehicles, real estate, luxury goods, electronics, and services. The MVP focuses on high-intent categories with localized taxonomies, bilingual readiness, and data structures that downstream teams can extend without refactoring.

## Strategic Objectives
- **Trust first:** Provide certified listings, verified sellers, and clear inspection signals for vehicles.
- **Liquidity:** Seed supply in core categories and streamline onboarding for professional sellers.
- **Localization:** Reflect Saudi regulatory requirements, vehicle preferences, and Arabic terminology.
- **Scalable foundation:** Deliver reusable schemas, IA, and UI scaffolding that accelerates later phases (ratings, monetization, AI features).

## Scope Snapshot
- **Audience:** Saudi buyers & sellers of vehicles and high-value goods.
- **Platforms:** Responsive web (Next.js). Mobile apps are out of scope for MVP.
- **Phases:** Three release waves (MVP1–MVP3) aligning with trust, growth, and monetization goals.

## Success Metrics
| Objective | Metric | Target |
|-----------|--------|--------|
| Supply activation | Active seller listings in Vehicles (first 90 days) | ≥ 2,000 |
| Buyer engagement | Average session duration on listings | ≥ 4 minutes |
| Trust | % of vehicle listings with inspection/condition data | ≥ 85% |
| Conversion | Bid-to-listing ratio in Vehicles | ≥ 35% |

## Stakeholders
- **Product:** Aligns backlog with phased roadmap and user stories.
- **Engineering:** Consumes data schemas, Next.js scaffold, and validation scripts.
- **Design:** References IA, menu spec, and wireframe annotations.
- **Operations:** Uses taxonomy and filters to curate listings, inspections, and certifications.

## Assumptions & Dependencies
- Classified data ingestion comes from partner feeds or manual seller entry.
- Payment gateway and escrow workflows will be defined after MVP1.
- Arabic localization content will be populated during Phase 2 using keys seeded in `data/i18n`.
- Government regulations for auctions and vehicle transfers remain stable during MVP timeline.

## Risks & Mitigation
| Risk | Mitigation |
|------|------------|
| Fragmented vehicle data from sellers | Normalize inputs using brand/model/year pickers and enforce mandatory fields. |
| Low buyer trust | Launch “Mazad Certified” flow in MVP2 and highlight inspection badges in UI specs. |
| Complexity in filters | Use centralized `filters.json` schema with visible conditions for used vehicles. |
| Scope creep | Track features against roadmap and acceptance criteria documents. |

## Deliverable Map
| Artifact | Location | Owner |
|----------|----------|-------|
| Category Tree | `docs/10-category-tree.md`, `data/categories.json` | Product Ops |
| Vehicles Taxonomy | `docs/20-vehicles-taxonomy.md`, `data/vehicles/*.csv`, `data/vehicles/vehicles.json` | Data Services |
| User Stories & ACs | `docs/30-32-*.md` | Product Management |
| IA & UI Spec | `docs/40-ia-menu-spec.md` | Product Design |
| Roadmap | `docs/50-roadmap-mvp1-3.md` | Product Leadership |
| App Scaffold | `/app` | Engineering |
| Validation Scripts | `/scripts/validate-json.mjs` | Engineering Enablement |
