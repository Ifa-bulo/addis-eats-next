# AUTH.md — Authentication and attack verification

## Access-control table

| Route/action | Required identity | Enforcement |
|---|---|---|
| `/menu`, `/menu/[id]` | Public | No session required; disabled dishes cannot be ordered. |
| `/checkout`, `/orders`, `/track/[id]` | Signed-in customer | `middleware.js` checks the signed cookie, then page/API/action code verifies the session and scopes orders to `session.id`. |
| `/dashboard`, `/kitchen`, `/admin/menu` | Staff | `middleware.js` rejects missing sessions and non-staff roles; page components and server actions repeat staff checks. |
| `placeOrder` | Customer | `requireUser()`, server-side price/item/availability/phone/address validation, plus a process-local idempotency map. |
| `setDishAvailability` | Staff | `requireStaff()` in `src/app/actions/menu.js` before updating the availability override. |
| `cancelOrder` | Owner of order | `getOrderForUser(orderId, session.id)` before changing the status. |

## Session design

- Cookie payload uses HMAC-SHA-256 signing with `SESSION_SECRET` and a seven-day expiry.
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production.
- The server refuses to sign a session when `SESSION_SECRET` is missing or shorter than 32 characters.
- Seeded demonstration accounts can be disabled with `ENABLE_DEMO_ACCOUNTS=false`; use separate secrets in Preview and Production.
- Session payload is signed, not encrypted. Do not put sensitive data inside it.

## Three attacks to demonstrate

1. **Unsigned/expired cookie against a private route.** Open a private window without a session and request `/orders`, `/checkout`, `/track/<known-id>`, `/dashboard`, or `/admin/menu`. Expected: redirect to sign-in. Enforcement: `middleware.js:12–18` verifies the cookie and redirects if it is invalid; destination pages also call `getSession()` / `requireUser()` / `requireStaff()`. Do not rely on `robots.txt`.
2. **IDOR / another user's order ID.** Sign in as customer A and request customer B's known order ID at `/orders/<id>`, `/api/orders/<id>`, or `/track/<id>`. Expected: 404/not found with no order data. Enforcement: `src/lib/data.js:116` (function `getOrderForUser`) matches order ID and user ID; the private order page calls it at `src/app/orders/[id]/page.js:15`, and the API calls it at `src/app/api/orders/[id]/route.js:9`. Recheck current line numbers after edits.
3. **Open redirect through `next`.** Open `/signin?next=https://example.com` and attempt sign-in. Expected: redirect only to a local safe route, never `example.com`. Enforcement: `src/app/actions/auth.js:10–19`, function `safeNext()`, rejects absolute external URLs, protocol-relative URLs, and backslashes.

## Additional staff attack

A signed-in customer must not access `/dashboard`, `/kitchen`, `/admin/menu`, or the `setDishAvailability` server action. Expected: redirect/forbidden response. Checks exist in `middleware.js`, staff pages, and the server action. Hidden UI controls alone are not authorization.

## Data/persistence caveat

Accounts, orders, and menu availability are stored in process-local memory in this demonstration. That is not durable or shared across serverless instances. Before production use, use a persistent database, enforce unique email and `(userId, idempotencyKey)` constraints, add rate limiting, and repeat the concurrency and ownership tests against that database.
