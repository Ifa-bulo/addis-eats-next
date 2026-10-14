# Addis Eats Dashboard and Orders Table

## Staff dashboard

The staff-only `/dashboard` route aggregates order records in the Server Component (`src/app/dashboard/page.js`). The browser chart leaf receives only two summarized datasets:

- `revenueByArea`: neighbourhood, gross revenue in ETB, and order count
- `ordersByDay`: ISO date and non-cancelled order count for each day in the shown seven-day range

Gross order value is the sum of item prices times quantities plus the recorded delivery fee. Older seed records without a fee use the project's fallback of ETB 60. Cancelled orders are excluded. The revenue bar axis begins at zero. Both charts have headings, units, SVG descriptions, and matching semantic data tables under the chart. Revenue is shown in ETB; the time-series line chart uses order counts per day because order count is a quantity, not a currency.

The route checks the signed-in session and staff role on the server. A customer cannot view aggregated staff data by manually entering `/dashboard`.

## Orders page

The `/orders` route remains customer-specific: it only calls `getOrdersFor(session.id)`, so one customer cannot list another customer's orders. Sorting (`sort`, `dir`) and pagination (`page`) are encoded in the URL and rendered on the server. The table uses `table`, `caption`, `thead`, `th scope="col"`, and row headers with `scope="row"`; pagination and sort controls use Next.js `Link` elements. Page size is 10 rows.

Example URL format:

`/orders?sort=total&dir=desc&page=3`

For a reproducible page-three pagination demonstration, use the `demo=pages` query flag. It creates 27 temporary sample rows at render time only; it does not add them to the order store:

`/orders?demo=pages&sort=total&dir=desc&page=3`

The page shows a note while the temporary data mode is enabled. Demo rows are not persisted and their details links are replaced with a sample marker.

## State demonstrations

Sign in first. Dashboard demo URLs require the staff account; order demo URLs require any signed-in account.

| State | URL example | Expected result |
|---|---|---|
| Normal dashboard | `/dashboard` | Server-computed KPIs and both charts |
| Loading state | `/dashboard?demo=loading` | Dashboard skeleton |
| Empty state | `/dashboard?demo=empty` | Empty revenue and order activity messages plus empty data-table rows |
| Error state | `/dashboard?demo=error` | Staff-safe error boundary with retry |
| Normal customer orders | `/orders` | Current customer's order history, or an empty state |
| Table loading state | `/orders?demo=loading` | Table skeleton with five body rows |
| Table empty state | `/orders?demo=empty` | New-customer empty state with menu link |
| Table error state | `/orders?demo=error` | Safe error boundary with retry |
| Page-three sorting | `/orders?demo=pages&sort=total&dir=desc&page=3` | Third page of 27 temporary rows, sorted by total descending |

These query flags are demonstration aids. The staff dashboard remains protected by the server-side role check, and real order history remains scoped to the authenticated user.

## Verification

Run these commands in the project root:

```bash
npm run validate
npm run build
```

Then sign in with the staff account, test each dashboard state, verify the revenue chart's zero baseline and its corresponding table, and open a page-three URL in a fresh browser tab to confirm that sorting and paging are shareable. Validate keyboard operation and test the table at mobile widths. The static validator is not a replacement for a production build or manual accessibility checks.
