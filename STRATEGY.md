# Rendering & boundary strategy

## Server by default
Public menu data, dish details, metadata, sitemap and robots are rendered on the server. The home page receives its dish catalog from `data/dishes.json`, and image fallbacks are resolved on the server so missing optional food photos do not create broken requests.

## Client only where interaction requires it
The cart and favorites are browser-local state; debounced menu search and live order polling use SWR; forms use client action state; the theme toggle remembers a light/dark preference. The initial public menu and initial order status are seeded by the server to avoid an empty first paint.

## Security boundary
Middleware is the first gate. Private pages and server actions do not trust middleware alone. Actions perform their own session/role/ownership checks, verify and canonicalize dish IDs against server catalog prices, and only accept same-site post-sign-in destinations. Session values are HMAC-signed and include an expiry; passwords use salted scrypt hashes.

## Deployment boundary
The assignment demo uses process-local stores for demonstration. These do not persist across serverless instances. Before real customer use, replace the in-memory order/user stores with a persistent database and managed identity provider. The security boundary should remain in the query/action layer after the storage implementation changes.
