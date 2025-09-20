# Seller User Stories (Phase Labels & Acceptance Criteria)

## EPIC: Onboard & List Inventory (MVP1)

### Story S1: Register as seller
**As a** seller, **I want** to register my business profile, **so that** I can list inventory under Mazad.com policies.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Registration form captures business name, CR number, city, and contact info.
  2. Sellers upload trade license copy or enter manual verification code.
  3. Successful submission triggers verification workflow and sends confirmation email.
  4. Seller dashboard status displays `Pending Verification` until approved.

### Story S2: Create vehicle listing
**As a** seller, **I want** to list a vehicle with accurate specs, **so that** buyers can trust my inventory.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Listing form consumes taxonomy from `vehicles.json` enabling brand→model→year→trim selection.
  2. Mandatory fields: mileage (if used), condition, price expectations, inspection availability.
  3. Upload at least 6 photos and 1 inspection document placeholder.
  4. Submission triggers moderation queue entry with SLA timestamp.

### Story S3: Manage listings
**As a** seller, **I want** to edit or pause listings, **so that** I maintain accurate availability.
- **Phase:** MVP1
- **Acceptance Criteria:**
  1. Sellers can toggle listing status between `Active`, `Paused`, `Sold`.
  2. Edited listings retain audit trail of changes.
  3. Notifications sent to followers when listing is paused or sold.
  4. Updates respect moderation rules (critical changes re-queued for review).

## EPIC: Build Trust & Performance (MVP2)

### Story S4: Apply for Mazad Certified
**As a** seller, **I want** to submit vehicles for certification, **so that** I can boost buyer confidence.
- **Phase:** MVP2
- **Acceptance Criteria:**
  1. Sellers request certification from listing detail with preferred inspection partner.
  2. Workflow collects fees and schedules inspection time slot.
  3. Certification results update listing with badge, expiry date, and checklist summary.
  4. Certification status visible in seller dashboard analytics.

### Story S5: Respond to buyer inquiries
**As a** seller, **I want** to respond to buyer messages quickly, **so that** I maintain lead quality.
- **Phase:** MVP2
- **Acceptance Criteria:**
  1. Messaging center groups conversations by listing and shows unread count.
  2. Response time SLA tracked and surfaced as a trust metric on listings.
  3. Buyers receive notification when seller replies.
  4. Agents can mark conversation as resolved.

## EPIC: Optimize Revenue (MVP3)

### Story S6: Promote featured listing
**As a** seller, **I want** to boost a listing for higher visibility, **so that** I can reach more buyers.
- **Phase:** MVP3
- **Acceptance Criteria:**
  1. Sellers choose from Featured or Boost packages defined in pricing matrix.
  2. Payment status tracked and invoice generated.
  3. Featured listings appear in carousel slots per IA spec.
  4. Performance analytics show impressions, clicks, and conversion per boost.

### Story S7: Access performance analytics
**As a** seller, **I want** to track listing performance metrics, **so that** I can optimize my inventory strategy.
- **Phase:** MVP3
- **Acceptance Criteria:**
  1. Dashboard charts show bids, watchlist adds, conversions by time period.
  2. Sellers can export CSV of metrics for selected date range.
  3. Filters allow segmentation by category and certification status.
  4. Data refreshes daily with timestamp indicator.
