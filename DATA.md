# DATA.md — Data ownership and boundaries

| Data | Source / owner | Boundary behavior | Persistence |
|---|---|---|---|
| Dishes | `data/dishes.json` via `src/lib/data.js` | Server-rendered rows are passed to the UI; search calls `/api/dishes`. | Base catalog is checked-in JSON. |
| Dish availability | `src/lib/data.js` in-memory `Map` | Staff action changes the explicit enabled/disabled flag. Customers see unavailable state and server checkout rejects disabled items. | Process-local demo override only; must be moved to a DB for durable Vercel behavior. |
| Prices and order items | Server's canonical dish catalog | Client-supplied values are not trusted; item IDs and quantities are re-read/validated on the server and server price/name is copied into the order. | Order records are in process memory. |
| Orders | `src/lib/data.js` | Private reads require ownership match to `session.id`; dashboard passes aggregated rows to chart client leaves. | Process-local memory, not production persistence. |
| User accounts | Seed JSON plus newly created in-memory users | Passwords use salted scrypt hashes; signed session cookie used for browser identity. | Demo storage is not durable. |
| Session | Signed `HttpOnly` cookie | Cookie is verified on the server; never expose the signing key to client bundles. | Browser cookie, seven-day max age. |
| Cart | Client cart provider | Browser-local state; checkout submits item IDs/quantities for server revalidation. | localStorage in the current browser. |
| Favorites and theme | Client | Only affects presentation/personal preference. | localStorage in current browser. |
| Delivery stream | `/api/orders/[id]/stream` | Server checks session and order ownership, seeds the client with server-rendered state, then streams status events. | Uses current demo order store. |
| CSV export | Signed-in user's order history | CSV quoting handles commas, quotes and line breaks; export remains scoped to the current user's orders. | Downloaded file generated in browser. |

## Aggregation and rendering

- Dashboard charts are calculated in the server component; only summarized revenue-by-area and count-by-day rows cross to `RevenueChart.jsx`.
- The order table uses semantic `table`, `caption`, `thead`, scoped headers and URL-driven sort/pagination.
- Menu search is debounced to avoid a request for every keystroke. The public dish endpoint uses `Cache-Control: no-store` so staff availability changes are not kept in shared cache.
- `src/lib/format.js` is the shared formatter for ETB amounts and time/date display.
- Dish social metadata is server-generated and points to static, absolute 1200×630 JPEG cards under `public/images/social/dishes/`.

## Empty-data contract

A new account has no orders: `/orders` should show a clear empty state with a route back to the menu. Dashboard empty-state demo is `/dashboard?demo=empty`; order history demo is `/orders?demo=empty`. Loading and error demos are listed in `DASHBOARD.md` and `docs/PREFLIGHT.md`.

## Production database requirement

This project deliberately exposes its demo limitation: the process-local store does not survive restarts and does not synchronize across Vercel instances. Persist accounts, orders, dish availability, and idempotency keys in a database before real customer use. Enforce uniqueness for normalized email and `(userId, idempotencyKey)` at the database level.
