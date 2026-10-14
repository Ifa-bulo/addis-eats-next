# Addis Eats 🍽️

**A modern Ethiopian-inspired food ordering platform built with Next.js and React.**

Addis Eats is a full-stack capstone project for browsing a food menu, managing a cart, placing and tracking demo orders, and giving staff tools to manage orders and menu availability. It focuses on a responsive customer experience, accessible interactions, server-side validation, authentication boundaries, social sharing metadata, and clear project documentation.

![Addis Eats delivery experience](public/images/hero/addis-eats-delivery.webp)

## Live demo

**Current Vercel URL:** [https://addis-eats-next-omega.vercel.app/](https://addis-eats-next-omega.vercel.app/)

This is the project's current public deployment URL. After pushing updates, confirm that Vercel has built and deployed the latest commit before assuming every feature documented here is live.

## Features

### Customer experience

- Browse Ethiopian-inspired dishes, including main dishes, vegetarian options, burgers, pizza, and drinks.
- Filter dishes using horizontally scrollable category controls and search by name, description, or category.
- Open dedicated dish-detail pages with prices, availability, and social-sharing metadata.
- Save favourite dishes and preserve the cart in browser `localStorage`.
- Add or remove items, change quantities, and review totals in ETB.
- Register, sign in, and submit a validated demo order with a delivery area, address, and delivery option.
- View order history and order details, sort and paginate orders through URL parameters, and export history to CSV.
- View order-status updates and a delivery map with a text alternative for users who cannot rely on the map.

### Staff experience

- View revenue by neighbourhood and orders over time on `/dashboard`.
- Read the same chart data in accessible HTML tables.
- View and update order status on `/kitchen`.
- Enable or disable a menu dish on `/admin/menu` without deleting the dish record.
- See disabled dishes marked unavailable; server-side order validation rejects unavailable dishes.

### Accessibility and interface quality

- Responsive layouts for mobile and desktop.
- Semantic forms, links, buttons, and table markup.
- Visible keyboard focus and skip-to-content navigation.
- Minimum 44-pixel target styling for interactive controls.
- Loading, empty, and error states for important screens.
- Reduced-motion support and text descriptions alongside charts and the delivery map.

### SEO and social sharing

- Page titles, descriptions, canonical URLs, and Open Graph/Twitter metadata.
- A homepage social preview at `public/og-image.jpg`.
- A dedicated 1200 × 630 JPEG social card for each of the 19 dish pages in `public/images/social/dishes/`.
- Generated `/sitemap.xml` and `/robots.txt` routes.
- Structured data on applicable pages.

Social preview appearance depends on each platform's crawler and cache. After deployment, verify the absolute `og:image` URL is publicly accessible and refresh platform caches if an older card continues to appear.

## Technology stack

| Technology | Role |
|---|---|
| Next.js App Router | Routing, server-rendered pages, metadata, Route Handlers, and Server Actions |
| React | Interactive user interface and client-side state |
| JavaScript | Application and validation logic |
| Tailwind CSS | Styling and responsive layouts |
| SWR | Client-side data fetching, caching, and revalidation |
| Leaflet | Delivery map component |
| Node.js crypto | Password hashing and signed session cookies |
| Vercel | Hosting and deployment |

The dependency versions are defined in `package.json`. Use the Node.js version specified by the `engines` field (`20.9` or newer) and review current framework security advisories before deploying.

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Homepage and featured dishes | Public |
| `/menu` | Search, category filters, and dish list | Public |
| `/menu/[id]` | Dish detail and share metadata | Public |
| `/favorites` | Saved favourite dishes | Signed-in experience / browser-local favourites |
| `/signin`, `/signup` | Sign in and registration | Public |
| `/checkout` | Validated checkout | Customer |
| `/orders` | Order history, sort, pagination, CSV export | Customer |
| `/orders/[id]` | Order details and current status | Order owner |
| `/track/[id]` | Delivery information, map, and status stream | Order owner |
| `/dashboard` | Revenue and order analytics | Staff |
| `/admin/menu` | Enable/disable dishes | Staff |
| `/kitchen` | Order status management | Staff |
| `/api/dishes` | Public dish search endpoint | Public |
| `/api/orders/[id]` | Private order status endpoint | Order owner |
| `/api/orders/[id]/stream` | Server-sent event stream for tracking | Order owner |
| `/sitemap.xml`, `/robots.txt` | Search-engine metadata | Public |

## Project structure

```text
addis-eats-next/
├── data/                         # JSON seed data for the demo
├── public/
│   ├── images/                   # Hero, fallback, and social-preview images
│   └── og-image.jpg              # Homepage social card
├── scripts/
│   ├── validate-project.mjs      # Project/source validation
│   └── preflight-a11y.mjs        # Static accessibility/security checks
├── src/
│   ├── app/                      # App Router pages, APIs, and server actions
│   │   ├── actions/               # Authentication, menu, and order mutations
│   │   ├── admin/menu/            # Staff menu availability controls
│   │   ├── api/                   # Route Handlers
│   │   ├── dashboard/             # Server aggregation and chart client leaf
│   │   ├── menu/                  # Menu and dish detail routes
│   │   ├── orders/                # Order history and order details
│   │   └── track/                 # Delivery tracking page and map components
│   ├── components/                # Reusable interface components
│   └── lib/                       # Data, sessions, formatting, CSV, delivery
├── .env.example
├── middleware.js
├── next.config.mjs
├── package.json
├── AUTH.md
├── DATA.md
├── PERF.md
└── FUTURE.md
```

## Getting started

### Prerequisites

- Node.js `20.9` or newer
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ifa-bulo/addis-eats-next.git
cd addis-eats-next
```

### 2. Install dependencies

```bash
npm install
```

Keep the generated `package-lock.json` under version control so teammates and deployment builds can install the same dependency graph.

### 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env.local
openssl rand -base64 32
```

Copy the generated random value into `SESSION_SECRET` in `.env.local`. Use a unique secret of at least 32 characters for local development, Preview, and Production. Never commit `.env.local` or paste a secret into a `NEXT_PUBLIC_` variable.

For local development, use:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SESSION_SECRET=<your-own-random-secret-of-32-characters-or-more>
ENABLE_DEMO_ACCOUNTS=true
```

Replace the placeholder with the output from `openssl`. Do not use an empty or shared sample secret.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local and Preview demo accounts

When `ENABLE_DEMO_ACCOUNTS=true` in local development or an isolated Preview environment, the seed data includes these assessment accounts:

| Role | Email | Password |
|---|---|---|
| Customer | `ifa@example.com` | `demo123` |
| Second customer (for order-ownership tests) | `sara@example.com` | `demo123` |
| Staff | `kitchen@example.com` | `staff123` |

These credentials are only for local/Preview demonstrations. Set `ENABLE_DEMO_ACCOUNTS=false` in Production. If seeded accounts were ever enabled on a public deployment, rotate `SESSION_SECRET` after disabling them to invalidate sessions signed with the previous secret.

## Environment configuration for Vercel

Open **Vercel → Project → Settings → Environment Variables** and set values separately for Preview and Production.

| Variable | Local | Preview | Production |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Leave unset to use the Vercel deployment URL | `https://addis-eats-next-omega.vercel.app` |
| `SESSION_SECRET` | Unique random secret | Separate Preview-only secret | Separate Production-only secret |
| `ENABLE_DEMO_ACCOUNTS` | `true` for demo accounts | `true` only if needed for isolated QA | `false` |

After changing environment variables, create a new deployment for those values to take effect. `NEXT_PUBLIC_` variables may be included in browser-delivered JavaScript and must never contain secrets.

## Scripts and verification

The following scripts are provided in `package.json`:

```bash
npm run validate
node scripts/preflight-a11y.mjs
npm audit
npm run build
npm start
```

To run the combined project validation, static accessibility/security preflight, and production build:

```bash
npm run preflight
```

Review any `npm audit` findings instead of automatically applying dependency changes without checking compatibility. Do not promote a deployment unless the production build succeeds.

### Manual release checklist

- [ ] Create a new customer account and complete the order flow.
- [ ] Confirm a new customer sees a useful empty order-history state.
- [ ] Navigate and place an order using only the keyboard.
- [ ] Activate Place order rapidly twice and confirm only one order is created in the tested environment.
- [ ] Verify a customer cannot access another customer's order by changing the ID.
- [ ] Verify unauthenticated access to private routes is refused.
- [ ] Verify the sign-in `next` parameter cannot redirect to an external site.
- [ ] Verify customers cannot access staff routes or staff actions.
- [ ] Disable a dish as staff and confirm customers cannot order it; re-enable it afterward.
- [ ] Verify the tracking page shows text information in addition to the map and closes its event stream when leaving the page.
- [ ] Inspect `og:title`, `og:description`, and absolute `og:image` values on the deployed pages.
- [ ] Open `/sitemap.xml` and `/robots.txt` on the live domain.
- [ ] Use a private window and a real phone to check the deployed application.
- [ ] Run Lighthouse on the final deployed commit and update `PERF.md` with measured results.

See [`docs/PREFLIGHT.md`](docs/PREFLIGHT.md) and [`docs/TESTING.md`](docs/TESTING.md) for more detailed procedures.

## How caching and SWR are used

| Location | Mechanism | Purpose |
|---|---|---|
| `src/components/search-menu.jsx` | SWR with server-provided `fallbackData`, `keepPreviousData`, and a 450 ms debounce | Fetch and update search results without blanking the existing results while typing |
| `src/components/order-status.jsx` | SWR `refreshInterval: 5000` with `fallbackData` | Refresh the customer's order status every five seconds |
| `src/app/api/dishes/route.js` | `Cache-Control: public, s-maxage=30, stale-while-revalidate=120` | Permit shared caching of public dish-search responses |
| `src/app/api/orders/[id]/route.js` | `Cache-Control: no-store` plus session and ownership checks | Prevent HTTP caches from storing private order responses |
| `src/app/actions/menu.js`, `src/app/actions/orders.js` | `revalidatePath()` | Request revalidation of affected Next.js routes after mutations |
| `src/components/cart-provider.jsx` | Browser `localStorage` | Preserve cart data across browser page refreshes; this is not SWR |

SWR's in-browser cache and HTTP/CDN caching are separate mechanisms. `revalidatePath()` does not directly clear every already-open browser's SWR cache. The delivery-tracking view uses Server-Sent Events (EventSource), rather than SWR, for its stream of tracking updates.

## Security design

- Password verification uses salted scrypt hashes.
- Sessions use HMAC-SHA-256 signatures and a seven-day expiry. The cookie is configured with `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- `SESSION_SECRET` is required by the session-signing code and must remain server-only.
- Middleware provides early route gating, while pages, APIs, and server actions enforce session, role, and ownership checks at the data/action boundary.
- Checkout validates dish IDs, current availability, price from server-side catalog data, quantity, phone format, delivery area, delivery address, and delivery option on the server.
- `safeNext()` constrains post-login redirects to safe local routes.
- Private order APIs use `no-store` and scope order lookups to the signed-in user.

Read [`AUTH.md`](AUTH.md) for the access-control table and three attack demonstrations, and [`DATA.md`](DATA.md) for the data ownership/boundary map.

## Known limitations

This repository is an educational capstone/demo and is **not ready to process real customer orders or payments** without further work:

- Users, orders, menu availability overrides, and the checkout idempotency map use process-local demo storage. Data can be lost on a process restart and is not shared across Vercel instances.
- Client in-flight locks and the current in-memory idempotency map are not a distributed exactly-once guarantee. A production version needs a persistent database, a unique constraint on `(userId, idempotencyKey)`, and concurrency tests.
- Menu availability must be saved in a persistent store before staff updates can be trusted across instances.
- The tracking map uses illustrative/demo location estimates; it is not connected to courier GPS or a live geocoding/dispatch service.
- No real payment gateway is integrated.
- `PERF.md` contains source asset measurements and performance targets, but LCP, CLS, INP, Lighthouse scores, deployed network response sizes, and production build results must be recorded from the final deployed build before describing them as passed.

See [`FUTURE.md`](FUTURE.md) for the Must/Should/Could roadmap.

## Documentation

- [`AUTH.md`](AUTH.md) — sessions, role checks, route protection, and attack tests.
- [`DATA.md`](DATA.md) — data ownership, client/server boundaries, and persistence.
- [`PERF.md`](PERF.md) — source asset budgets, performance targets, and measurement procedure.
- [`FUTURE.md`](FUTURE.md) — prioritized work and features intentionally cut from the capstone.
- [`STRATEGY.md`](STRATEGY.md) — project strategy and architectural decisions.
- [`BOUNDARY.md`](BOUNDARY.md) — server/client boundary notes.
- [`DASHBOARD.md`](DASHBOARD.md) — dashboard design and demonstration notes.
- [`TRACKING.md`](TRACKING.md) — tracking map, event stream, and limitations.
- [`docs/REHEARSAL.md`](docs/REHEARSAL.md) — eight-minute walkthrough plan.
- [`docs/PREFLIGHT.md`](docs/PREFLIGHT.md) — pre-deployment checklist.
- [`docs/TESTING.md`](docs/TESTING.md) — manual testing guide.

## Deployment and rollback

1. Push the intended commit to the branch connected to Vercel.
2. Deploy a Preview with Preview-specific environment variables.
3. Run the automated and manual checks listed above.
4. Configure Production environment variables separately and deploy the verified commit.
5. Repeat the post-deployment smoke tests in a private window and on a real phone.
6. Record the final build reference and performance measurements in the documentation.

To roll back, open the Vercel project's **Deployments** view, select the last known-good Production deployment, and use Vercel's rollback action. The Vercel CLI also supports rollback to a prior production deployment URL:

```bash
vercel rollback <previous-production-deployment-url>
```

## License

No open-source licence is currently included. Add a `LICENSE` file before redistributing the project under an open-source licence.
