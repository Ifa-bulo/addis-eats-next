# PERF.md — Performance budget and evidence

## Asset measurements from this source bundle

These are file-size measurements of the current source assets, not browser timings from the live site.

| Asset | Dimensions | Measured size | Budget | Result |
|---|---:|---:|---:|---|
| Homepage hero | 1200 × 675 WebP | 65,500 bytes (63.96 KiB) | < 150 KiB | Pass |
| Homepage social card | 1200 × 630 JPEG | 112,153 bytes (109.52 KiB) | < 150 KiB | Pass |
| Dish social cards | 19 × 1200 × 630 JPEG | 1,133,071 bytes total | Each < 150 KiB | Pass; largest is 70,144 bytes (68.50 KiB) |

The exported card sizes have been checked against the source files. Actual transfer size can differ slightly due to HTTP compression/CDN behavior, though JPEG and WebP files generally receive little additional compression.

## Core Web Vitals and Lighthouse

| Metric | Target | Latest verified value | Status |
|---|---:|---|---|
| LCP (mobile, throttled) | < 2.5 s | Not measured on the final deployed build | Pending |
| CLS | < 0.1 | Not measured on the final deployed build | Pending |
| INP | < 200 ms | Not measured on the final deployed build | Pending |
| Lighthouse Performance | ≥ 90 | Not measured on the final deployed build | Pending |
| `/menu` First Load JS | < 120 kB | Not measured from production build output | Pending |
| Largest image response | < 150 KiB | Largest source social card: 68.50 KiB; deployed Network response not captured | Source pass, live verification pending |

I have deliberately not fabricated Lighthouse or Core Web Vitals values. The final Vercel build could not be inspected from this environment, and the package registry was not available for a complete dependency install/build here.

## Repeatable measurement procedure

1. Deploy the exact final commit to Vercel Preview, then promote that commit to Production after checks pass.
2. Open the deployed URL in a fresh private browser window. Use Chrome DevTools Lighthouse, Mobile mode, with the same throttling preset for each run. Save the report date, URL/deployment, and scores.
3. Run at least three Lighthouse audits and record the median LCP, CLS, INP/TBT diagnostic, Performance score, and accessibility score. Lighthouse lab TBT is not the same metric as field INP.
4. In DevTools Network, enable **Disable cache**, reload, and inspect response sizes for the hero image, Open Graph JPEG, and representative dish images. Confirm the dish social-card URL returns `200 image/jpeg` without authentication.
5. Inspect the production build summary for `/menu` First Load JS. Compare with the <120 kB project target and investigate any overage.
6. Test an iPhone or Android phone, not just emulation. Verify categories scroll horizontally, no page-level horizontal overflow exists, and focus/navigation controls remain usable.

## Current optimization decisions

- Hero image is a local compressed WebP and reserves layout space through its `next/image` container.
- Homepage uses a compressed 1200 × 630 Open Graph card.
- Every menu detail has a dedicated 1200 × 630 raster JPEG for Open Graph and Twitter `summary_large_image` metadata. This avoids requiring social crawlers to support dish SVG images.
- All 19 dish card images are below the 150 KiB source budget; the largest is 68.50 KiB.
- Menu categories use a single horizontal, horizontally scrollable row rather than wrapping onto several lines.
- Menu search is debounced at 450 ms. Dashboard aggregation occurs on the server and the chart client leaf receives summary rows only.

## Limitations

The app's users, orders, menu availability overrides, and checkout idempotency map are in-process demo data. A durable database and serverless concurrency tests are required before the app handles real customer orders. No complete live Lighthouse report has yet been collected for the updated commit.
