# Day 45 verification checklist

Run locally first, then repeat the public source/SEO/network checks against the deployed URL.

## Functionality and empty states

- Open `/signup` in a clean browser profile and create an account with a valid name, unique email, and 8+ character password. Verify the new user is redirected to `/orders` and sees the clear “No orders yet” empty state.
- Confirm a duplicate email is rejected and a password confirmation mismatch is rejected.
- Open `/checkout` with an empty cart and verify the “Your cart is empty” state. Open `/favorites` with no saved dishes and verify its helpful empty state.
- Add a dish, change its quantity in checkout, submit a valid Ethiopian mobile number (10 digits starting with `09`) and a delivery area, then confirm the order.
- Open `/orders/[id]` and verify the page renders the initial status immediately and refreshes the same private endpoint every five seconds. Sign out and verify access is redirected to sign-in.
- Toggle dark/light mode. Refresh and verify the theme choice is restored. Check the mobile bottom navigation at a phone viewport.

## Attack 1: signed out access/action

Open `/orders` while signed out; it should redirect to `/signin`. Call a private order action without a valid session through the app/action test harness; expected result: refused by the server-side session check, not merely hidden by the UI.

## Attack 2: another customer's order ID

Sign in as `ifa@example.com`, then try to open `/orders/ord_demo_002`, which belongs to the second demo account. Expected result: the scoped query returns not found. The live `/api/orders/[id]` endpoint must also return 404 for an order not owned by the current session.

## Attack 3: crafted sign-in link

Open `/signin?next=https://example.com`. Expected result: the sign-in redirect helper rejects the external URL and only accepts a same-site path.

## Live data and network budget

- Open `/menu`, type a query and watch Network. Search requests should occur after a 450 ms pause, not on every keystroke.
- Open `/orders/ord_demo_001` and verify server-seeded data appears before the first poll.
- Disable browser cache, reload the homepage, and inspect image response sizes. Bundled hero WebP and social-preview JPEG are each below 150 KB; any uploaded food image should also remain below about 150 KB.

## Metadata and discovery

- Use View Source on the deployed homepage. There should be one `<h1>`, alt attributes for content images, a public description, and an absolute `og:image` URL resolving to the deployed host.
- Open `/sitemap.xml` and `/robots.txt`. Public menu/dish/about/blog/contact routes should be listed; orders, checkout, kitchen, sign-in and sign-up routes should not appear in the sitemap, and private paths must be disallowed or noindex.
- Paste the deployed URL into a chat or social preview tool and confirm the preview card contains the 1200 × 630 image.
- Open the URL in a private window and confirm it works without a session or prior cache; protected pages should still require sign-in.

## Final measurements

Run Lighthouse against the deployed preview and record the actual before/after numbers in `PERF.md`. Do not substitute guesses for LCP, CLS, JS size or Lighthouse score.

## Deployment data limitation

The process-local user/order store is intended for the assignment demo and does not provide durable storage across serverless instances. Record this as a limitation unless you configure a persistent database/identity provider before the demo.
