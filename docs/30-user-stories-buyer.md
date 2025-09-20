# Buyer User Stories (Phase Labels & Acceptance Criteria)

## EPIC: Discover & Browse Inventory (MVP1)

### Story B1: Browse categories
**As a** buyer, **I want** to browse all marketplace categories, **so that** I can quickly navigate to items of interest.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Categories page lists all nine super-categories with localized labels.
  2. Selecting a category routes to `/categories/[slug]` showing subcategories and featured filters.
  3. Breadcrumbs update to reflect the category path.
  4. Analytics event `category_view` fires with `{ categorySlug }`.

### Story B2: Filter vehicle listings
**As a** buyer, **I want** to filter vehicles by brand, model, year, and condition, **so that** I can narrow options quickly.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Filter panel displays available filters defined for `vehicles` in `data/filters.json`.
  2. Selecting `condition = used` reveals used-only filters (mileage, owners, accident history).
  3. Filter selections update query params without full page reload.
  4. Listing results refresh with applied filters and show count of matches.

### Story B3: View listing details
**As a** buyer, **I want** to view a detailed listing page with inspection data, **so that** I can evaluate trustworthiness.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Listing page shows seller info, vehicle specs, photos, and inspection summary.
  2. Condition badges (New/Used) appear with iconography described in IA spec.
  3. If `Mazad Certified` flag is present, display certification card with inspection date.
  4. Related listings section surfaces 4 items matching brand/model.

## EPIC: Transact with Confidence (MVP2)

### Story B4: Follow a listing
**As a** buyer, **I want** to follow listings and receive notifications, **so that** I never miss bid updates.
- **Phase:** MVP2
- **Acceptance Criteria:**
  1. Clicking “Follow” subscribes buyer to listing events and updates CTA to “Following”.
  2. Buyer receives notification preferences modal (email, SMS, push placeholder).
  3. Event payload conforms to notifications schema (`eventType`, `listingId`, `userId`).
  4. Buyers can unfollow from listing or notifications center.

### Story B5: Review Mazad Certified inspection
**As a** buyer, **I want** to review inspection reports for certified listings, **so that** I can trust vehicle condition.
- **Phase:** MVP2
- **Acceptance Criteria:**
  1. Certified badge links to modal with inspection checklist (exterior, interior, mechanical, documentation).
  2. Modal includes inspector name, certification date, and downloadable PDF placeholder.
  3. Buyers can flag discrepancies, creating support ticket with listing context.
  4. Analytics event `inspection_view` captured with `certified: true`.

## EPIC: Optimize Purchase Decision (MVP3)

### Story B6: Receive AI price estimate
**As a** buyer, **I want** to see AI-generated price guidance, **so that** I know if the current bid is fair.
- **Phase:** MVP3
- **Acceptance Criteria:**
  1. Price estimator consumes brand, model, year, trim, mileage to return `estimate_low`, `estimate_high`.
  2. Estimate panel displays confidence score and disclaimer text.
  3. If AI service fails, fallback message explains manual valuation process.
  4. Event `ai_price_estimate` records estimation inputs and response time.

### Story B7: Compare multiple listings
**As a** buyer, **I want** to compare up to three listings side-by-side, **so that** I can select the best value.
- **Phase:** MVP3
- **Acceptance Criteria:**
  1. Compare widget accepts maximum of three listings and displays key attributes (price, mileage, warranty).
  2. Listings can be added from search results or detail page.
  3. Comparison state persists across session via local storage.
  4. Buyers can remove items individually or clear all.
