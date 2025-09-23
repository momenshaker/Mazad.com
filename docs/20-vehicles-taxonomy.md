# Vehicles Taxonomy Reference

This document describes the canonical vehicles taxonomy for Mazad.com. Data is stored in CSV and JSON under `data/vehicles/` and validated via `schemas/vehicles.schema.json`.

## Data Sources
- **`brands.csv`** – Brand slug, label, country of origin, popular-in-KSA flag.
- **`models.csv`** – Model slug, associated brand, body type, production years.
- **`trims.csv`** – Trim-level metadata per model and year (engine, drivetrain, transmission).
- **`vehicles.json`** – Generated aggregate view consumed by the Next.js app and filters.

## Hierarchy & Keys
| Level | Identifier | Example |
|-------|------------|---------|
| Brand | `brand_slug` | `toyota` |
| Model | `model_slug` | `land-cruiser` |
| Year Range | `year_min` / `year_max` | `2016`–`2024` |
| Trim | `trim_slug` | `gxr-v6` |

## Condition Attributes
All vehicle entries specify `conditionOptions: ["new", "used"]`. When `used` is selected, additional attributes become visible in filters and listing forms:
- `mileage_km`
- `owners_count`
- `accident_history`
- `warranty_status`
- `service_history`

## Brand Coverage (Top 8 for MVP1)
| Brand | Origin | Notes |
|-------|--------|-------|
| Toyota | Japan | Highest market share in KSA; prioritize Land Cruiser, Camry, Corolla. |
| Nissan | Japan | Focus on Patrol and X-Trail for desert performance. |
| Hyundai | South Korea | Popular sedans and SUVs (Sonata, Tucson). |
| Kia | South Korea | Sportage, Sorento, and Cerato demand. |
| Ford | USA | F-150 and Expedition for government/fleet use. |
| Lexus | Japan | Premium SUVs and sedans (LX, ES). |
| BMW | Germany | Luxury sedans/SUVs (5 Series, X5). |
| Mercedes-Benz | Germany | Luxury sedans/SUVs (E-Class, GLE). |

## Example Vehicle Object
```json
{
  "brand": "toyota",
  "label": "Toyota",
  "origin": "Japan",
  "models": [
    {
      "model": "land-cruiser",
      "label": "Land Cruiser",
      "body_type": "SUV",
      "year_min": 2016,
      "year_max": 2024,
      "trims": [
        { "trim": "gxr-v6", "label": "GXR V6", "engine": "4.0L", "drivetrain": "4WD" },
        { "trim": "vxr-v8", "label": "VXR V8", "engine": "5.7L", "drivetrain": "4WD" }
      ],
      "condition": {
        "options": ["new", "used"],
        "usedOnlyAttributes": ["mileage_km", "owners_count", "accident_history", "warranty_status", "service_history"]
      }
    }
  ]
}
```

## Data Maintenance Workflow
1. Product Ops updates `brands.csv`, `models.csv`, or `trims.csv` when new inventory arrives.
2. Run `npm run generate:vehicles` to rebuild `data/vehicles/vehicles.json`.
3. Commit CSV and JSON changes together to keep parity between tabular and hierarchical views.
4. Execute `npm run validate` to ensure JSON meets schema requirements.

## Localization Strategy
- Display labels default to English; Arabic translations stored in `data/i18n/ar.json` (Phase 2).
- Keys remain stable across locales (`brand`, `model`, `trim`).

## Future Extensions
- VIN decoding integration for Phase 3 advanced filters.
- Integration hooks for inspection providers to append condition reports.
- Electric vehicle-specific fields (battery health, charging standard).
