# Addis Eats delivery tracking

## Implemented

- `/track/[id]` is a private, user-owned order tracking page.
- The page renders a server-seeded snapshot so status/address content is available before EventSource connects.
- `DeliveryMapLoader.jsx` loads Leaflet with `dynamic(..., { ssr: false })` and a fixed-height placeholder to avoid layout shift.
- `DeliveryMap.jsx` imports Leaflet CSS, includes OpenStreetMap attribution, shows courier and destination markers, and fits both markers in view.
- `/api/orders/[id]/stream` checks the signed-in user and sends correctly framed SSE messages as `data: {...}

`.
- The client closes EventSource on unmount and when the order is delivered or cancelled. A visible connection state is shown.
- `src/lib/format.js` exports shared `etb`, `when`, and `relative` functions. Order, dashboard, menu, checkout and tracking views use the same currency/date formatting functions.
- `src/lib/csv.js` exports `toCsv` and `downloadCsv`; it quotes commas, double-quotes and newline characters and prefixes formula-leading text to reduce spreadsheet formula-injection risk.
- The order history exports only the current signed-in customer's orders.
- Checkout now collects a street/building/landmark address as well as a neighbourhood.

## Important demo limitations

The project does not have courier-device GPS data or geocoding configured. The courier marker is a status-driven demo estimate and the destination pin marks the centre of the selected neighbourhood, not the exact street address. The exact user-entered delivery instructions are available as text beside the map. Connect a trusted courier GPS feed and a geocoder before calling this live location tracking in production.

Orders and accounts are currently held in an in-memory demo store in this project. For a multi-instance production deployment, persist order status and tracking events to a shared database/pub-sub service so that SSE updates are visible consistently across server instances.

## Verification

```bash
npm install
npm run validate
npm run build
npm run dev
```

Use an authenticated user's order and open `/track/<order-id>`. Navigate away and back several times; each `DeliveryTrackingClient` cleanup closes its EventSource. Mark an order `delivered` in the staff workflow to verify that the final update arrives and the stream closes.

For CSV quoting, try an address such as `Flat 2, "Blue House"
Near the main gate` and open the download in a spreadsheet.
