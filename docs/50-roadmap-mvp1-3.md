# Roadmap MVP1–MVP3

## Phase Overview
| Phase | Goal | Timeframe | Primary KPIs |
|-------|------|-----------|--------------|
| MVP1 – Core Foundation | Launch vehicle-first marketplace with trusted taxonomy and browsing. | Months 0–3 | Listings supply, buyer engagement time. |
| MVP2 – Trust & Growth | Introduce certification, notifications, and dashboards to drive retention. | Months 4–6 | Certification adoption, follow actions, seller response SLAs. |
| MVP3 – Monetization & Scale | Unlock boosts, seller plans, and AI enhancements for revenue growth. | Months 7–9 | Boost revenue, AI feature usage, seller retention. |

## MVP1 Backlog Highlights
- Publish taxonomy (`categories.json`, `vehicles.json`) and filters.
- Ship buyer/seller onboarding flows with moderation guardrails.
- Release initial Next.js experience: category browse, listing detail, placeholder bidding widget.
- Enable CSV→JSON data pipeline and validation scripts.
- Deliver analytics instrumentation plan for key events (view, filter, follow).

### Dependencies
- Seller verification service integration.
- CDN for image hosting and optimization.
- Localization strings defined for EN with placeholders for AR.

## MVP2 Backlog Highlights
- Launch Mazad Certified workflow: inspection scheduling, badge display, certification policy doc.
- Build notifications service (outbid, ending soon, inspection ready) with schema definitions.
- Implement buyer/seller dashboards with performance metrics and messaging inbox.
- Release ratings & reviews data model and UI entry points.

### Dependencies
- Partner inspection providers in Riyadh, Jeddah, Dammam.
- Notification delivery channels (email, SMS provider).
- Legal review of certification and inspection policy.

## MVP3 Backlog Highlights
- Introduce featured listings & boost pricing matrix with configurable packages.
- Offer subscription-based seller plans (tiers with limits, analytics).
- Integrate AI price estimator and VIN lookup for advanced buyers.
- Expand filters for EV-specific attributes and financing offers.

### Dependencies
- Pricing & billing integration (Stripe-like provider or in-house invoicing).
- Data science services for AI estimation.
- Regulatory compliance for VIN services.

## Release Management
- Operate two-week sprints with formal phase gates at the end of each MVP milestone.
- Conduct usability testing before MVP1 launch and before major MVP2/MVP3 features.
- Maintain single source of truth backlog in Jira; map doc references to ticket IDs.
- Phase retro documents stored alongside roadmap for institutional knowledge.
