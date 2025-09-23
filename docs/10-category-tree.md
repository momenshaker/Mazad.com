# Category Tree & Navigation Model

Mazad.com launches with nine super-categories tailored for the Saudi market. Each entry includes its machine slug, description, and top-level subcategories.

## Super-Categories
| Label | Slug | Description |
|-------|------|-------------|
| Vehicles | vehicles | Cars, motorcycles, commercial transport, and parts optimized for Saudi regulations. |
| Real Estate | real-estate | Residential, commercial, and land listings compliant with Saudi property norms. |
| Luxury | luxury | Watches, jewelry, collectibles, and premium accessories. |
| Electronics | electronics | Consumer electronics, mobiles, computers, and accessories. |
| Home & Living | home-and-living | Furniture, appliances, and décor. |
| Fashion | fashion | Apparel, footwear, and accessories for men, women, and children. |
| Sports & Outdoors | sports-and-outdoors | Sporting goods, fitness equipment, and outdoor gear. |
| Business & Industrial | business-and-industrial | Machinery, tools, and B2B supplies. |
| Services | services | Professional and household services across Saudi cities. |

## Vehicles Subcategories
- **Cars** (`cars`): Sedan, SUV, Coupe, Hatchback, Pickup.
- **Motorcycles** (`motorcycles`): Street, Cruiser, Off-road, Scooters.
- **Commercial Vehicles** (`commercial-vehicles`): Vans, Trucks, Buses.
- **Parts & Accessories** (`parts-accessories`): Engines, Body parts, Tires, Electronics.
- **Marine** (`marine`): Boats, Jet Skis, Trailers.

### Filter Highlights
- Aligns with `data/filters.json` keys such as `brand`, `model`, `year`, `condition`, `mileage`, and `warranty`.
- Used-only filters (mileage, owners, accident history) are conditionally visible when `condition = used`.

## Real Estate Subcategories
- **Residential Sales** (`residential-sales`): Villas, Apartments, Townhouses.
- **Residential Rentals** (`residential-rentals`): Long-term, Short-term, Serviced apartments.
- **Commercial** (`commercial`): Offices, Retail, Warehouses.
- **Land & Plots** (`land-plots`): Urban, Suburban, Agricultural.
- **Co-living & Shared** (`coliving-shared`): Shared apartments, Rooms for rent.

### Filter Highlights
- `property_type`, `location_city`, `price_range`, `bedrooms`, `furnished`, `area_sqm`.
- Compliance fields: `deed_verified`, `available_from`.

## Luxury Subcategories
- **Watches** (`watches`)
- **Jewelry** (`jewelry`)
- **Designer Bags** (`designer-bags`)
- **Collectibles** (`collectibles`)
- **Luxury Autos** (`luxury-autos`)

Filters emphasize authenticity: `brand`, `condition`, `authenticity_docs`, `year_of_purchase`.

## Electronics Subcategories
- **Mobile Phones** (`mobile-phones`)
- **Laptops & Computers** (`laptops-computers`)
- **Home Entertainment** (`home-entertainment`)
- **Smart Home** (`smart-home`)
- **Gaming** (`gaming`)

Filters: `brand`, `model`, `storage_size`, `warranty_remaining`, `condition`.

## Home & Living Subcategories
- **Furniture** (`furniture`)
- **Appliances** (`appliances`)
- **Kitchen & Dining** (`kitchen-dining`)
- **Home Décor** (`home-decor`)
- **Outdoor & Garden** (`outdoor-garden`)

Filters: `brand`, `material`, `color`, `condition`, `dimension_notes`.

## Fashion Subcategories
- **Men** (`men`)
- **Women** (`women`)
- **Kids** (`kids`)
- **Luxury Fashion** (`luxury-fashion`)
- **Traditional Wear** (`traditional-wear`)

Filters: `brand`, `size`, `condition`, `authenticity_docs`, `season`.

## Sports & Outdoors Subcategories
- **Fitness Equipment** (`fitness-equipment`)
- **Team Sports** (`team-sports`)
- **Outdoor Adventure** (`outdoor-adventure`)
- **Cycling** (`cycling`)
- **Water Sports** (`water-sports`)

Filters: `brand`, `equipment_type`, `condition`, `usage_level`.

## Business & Industrial Subcategories
- **Heavy Machinery** (`heavy-machinery`)
- **Tools & Hardware** (`tools-hardware`)
- **Office Equipment** (`office-equipment`)
- **Industrial Supplies** (`industrial-supplies`)
- **Wholesale Lots** (`wholesale-lots`)

Filters: `brand`, `condition`, `power_requirement`, `usage_hours`, `location_city`.

## Services Subcategories
- **Automotive Services** (`automotive-services`)
- **Home Services** (`home-services`)
- **Professional Services** (`professional-services`)
- **Events & Catering** (`events-catering`)
- **Logistics & Delivery** (`logistics-delivery`)

Filters: `service_type`, `coverage_city`, `availability`, `pricing_model`, `certifications`.

## Navigation Notes
- Global navigation features category mega-menu with hover reveal of subcategories.
- `/categories` route lists all super-categories with icons and call-to-action.
- Each leaf node surfaces recommended filters and quick links to featured searches.
