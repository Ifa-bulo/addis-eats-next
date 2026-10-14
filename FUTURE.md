# FUTURE.md — Must / Should / Could

## Must: before real orders

1. Replace process-local user and order arrays, menu availability overrides, and idempotency map with a persistent database.
2. Add a unique database constraint on `(userId, idempotencyKey)` and test simultaneous checkout requests. Client locks plus an in-memory map do not guarantee exactly-once behavior across Vercel instances.
3. Persist the dish enabled/disabled state in the same database and test changes from more than one server instance.
4. Review the latest official Next.js security release before deployment (an upstream dependency update was announced for October 14, 2026); then pass `npm install`, `npm run validate`, `node scripts/preflight-a11y.mjs`, `npm audit`, and `npm run build` on the final commit.
5. Verify three security attacks, then test the deployed application in a private window and on a real phone.

## Should: strengthen quality

1. Add Playwright tests for keyboard-only ordering, pending states, double-submit, role checks, cross-account order access, admin availability, CSV escaping, and stream cleanup.
2. Collect three mobile Lighthouse runs from the final Vercel deployment and record median LCP, CLS, INP, Performance score, `/menu` JavaScript size, and network image sizes in `PERF.md`.
3. Add an audit log for staff menu availability changes and alerts for order action failures.
4. Add real geocoding and a courier GPS provider. Current map coordinates are illustrative estimates, not live courier telemetry.
5. Add documented rotation/recovery drills for deployment secrets and staff access.

## Could: intentionally cut from this submission

- Payment gateway, capture/refund reconciliation, and production payment flows.
- Courier dispatch, route optimization, push/SMS notifications, and live traffic integration.
- Ratings, reviews, loyalty points, promo codes, recommendations, and multi-branch inventory.
- Analytics warehouse and historical reports beyond the current order summaries.
- Localization beyond the current English UI and ETB formatting.

These features are valuable but were cut to keep this capstone focused on the customer order flow, authenticated staff dashboard, non-destructive menu availability controls, social preview metadata, accessibility, and a verifiable release process.
