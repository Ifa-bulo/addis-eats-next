import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const dishes = JSON.parse(fs.readFileSync(path.join(root, 'data/dishes.json'), 'utf8'));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const requiredFiles = [
  'src/app/page.js', 'src/app/layout.js', 'src/app/globals.css',
  'src/app/menu/page.js', 'src/app/menu/[id]/page.js', 'src/app/api/dishes/route.js',
  'src/app/api/orders/[id]/route.js', 'src/app/orders/page.js', 'src/app/orders/[id]/page.js',
  'src/app/checkout/page.js', 'src/app/kitchen/page.js', 'src/app/signin/page.js', 'src/app/signup/page.js',
  'src/app/favorites/page.js', 'src/app/blog/[slug]/page.js',
  'src/app/dashboard/page.js', 'src/app/dashboard/RevenueChart.jsx', 'src/app/dashboard/loading.js', 'src/app/dashboard/error.js',
  'src/app/admin/menu/page.js', 'src/app/actions/menu.js', 'src/components/menu-availability-manager.jsx',
  'src/app/orders/OrderTable.jsx', 'src/app/orders/loading.js', 'src/app/orders/error.js',
  'src/app/track/[id]/page.js', 'src/app/track/[id]/DeliveryMap.jsx', 'src/app/track/[id]/DeliveryMapLoader.jsx',
  'src/app/track/[id]/DeliveryTrackingClient.jsx', 'src/app/track/[id]/loading.js', 'src/app/track/[id]/error.js',
  'src/app/api/orders/[id]/stream/route.js', 'src/lib/format.js', 'src/lib/csv.js', 'src/lib/tracking.js',
  'src/components/ExportOrdersButton.jsx', 'TRACKING.md', 'DASHBOARD.md', 'AUTH.md', 'DATA.md', 'PERF.md', 'docs/TESTING.md'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);

check(Array.isArray(dishes) && dishes.length === 19, `Expected the 19 supplied menu dishes; found ${dishes?.length ?? 'no list'}.`);
const ids = new Set();
const allowedCategories = new Set(['main-dishes', 'vegetarian', 'burgers', 'pizzas', 'drinks', 'desserts']);
for (const dish of dishes) {
  check(dish && typeof dish.id === 'string' && dish.id.length > 0, 'Dish has a missing ID.');
  if (dish?.id) check(!ids.has(dish.id), `Duplicate dish ID: ${dish.id}`);
  ids.add(dish?.id);
  check(typeof dish.name === 'string' && dish.name.trim().length > 0, `Dish ${dish?.id} has no name.`);
  check(typeof dish.description === 'string' && dish.description.trim().length > 0, `Dish ${dish?.id} has no description.`);
  check(Number.isFinite(dish.price) && dish.price >= 0, `Dish ${dish?.id} has an invalid price.`);
  check(allowedCategories.has(dish.category), `Dish ${dish?.id} has an unexpected category.`);
  check(Number.isInteger(dish.spiceLevel) && dish.spiceLevel >= 0 && dish.spiceLevel <= 3, `Dish ${dish?.id} has an invalid spice level.`);
  check(typeof dish.popular === 'boolean', `Dish ${dish?.id} has an invalid popular flag.`);
  check(typeof dish.image === 'string' && dish.image.startsWith('/images/dishes/'), `Dish ${dish?.id} has an invalid image path.`);
}

const dataSource = fs.readFileSync(path.join(root, 'src/lib/data.js'), 'utf8');
const fallbackMap = new Map([...dataSource.matchAll(/['"]([^'"]+)['"]\s*:\s*['"](\/images\/dishes\/[^'"]+)['"]/g)].map((m) => [m[1], m[2]]));
for (const dish of dishes) {
  const desired = path.join(root, 'public', dish.image.replace(/^\//, ''));
  const fallback = fallbackMap.get(dish.id);
  const fallbackExists = fallback ? fs.existsSync(path.join(root, 'public', fallback.replace(/^\//, ''))) : false;
  check(fs.existsSync(desired) || fallbackExists, `Dish ${dish.id} has neither its uploaded image nor a valid fallback.`);
  const shareImage = path.join(root, 'public/images/social/dishes', `${dish.id}.jpg`);
  check(fs.existsSync(shareImage), `Dish ${dish.id} is missing its raster social preview image.`);
  if (fs.existsSync(shareImage)) check(fs.statSync(shareImage).size < 150 * 1024, `Dish ${dish.id} social preview exceeds 150 KB.`);
}

for (const [file, label] of [
  ['public/images/hero/addis-eats-delivery.webp', 'Hero image'],
  ['public/og-image.jpg', 'Open Graph image']
]) {
  const target = path.join(root, file);
  check(fs.existsSync(target), `${label} is missing.`);
  if (fs.existsSync(target)) check(fs.statSync(target).size < 150 * 1024, `${label} exceeds 150 KB.`);
}

const homepage = fs.readFileSync(path.join(root, 'src/app/page.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
check((homepage.match(/<h1\b/g) || []).length === 1, 'Homepage must render exactly one h1.');
check(/alt\s*=/.test(homepage), 'Homepage images should include alt attributes.');
check(packageJson.dependencies?.next === '15.5.27', 'Expected the pinned Next.js 15.5.27 release line.');
check(packageJson.dependencies?.react === packageJson.dependencies?.['react-dom'], 'React and React DOM versions must match.');
check(fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8').startsWith('@import "tailwindcss";'), 'Tailwind CSS v4 must be enabled in globals.css.');


const dashboardPage = fs.readFileSync(path.join(root, 'src/app/dashboard/page.js'), 'utf8');
const menuAdminPage = fs.readFileSync(path.join(root, 'src/app/admin/menu/page.js'), 'utf8');
const menuAction = fs.readFileSync(path.join(root, 'src/app/actions/menu.js'), 'utf8');
const menuManager = fs.readFileSync(path.join(root, 'src/components/menu-availability-manager.jsx'), 'utf8');
const dishDetail = fs.readFileSync(path.join(root, 'src/app/menu/[id]/page.js'), 'utf8');
const dishSearch = fs.readFileSync(path.join(root, 'src/components/search-menu.jsx'), 'utf8');
const revenueChart = fs.readFileSync(path.join(root, 'src/app/dashboard/RevenueChart.jsx'), 'utf8');
const orderTable = fs.readFileSync(path.join(root, 'src/app/orders/OrderTable.jsx'), 'utf8');
const orderLoading = fs.readFileSync(path.join(root, 'src/app/orders/loading.js'), 'utf8');
const orderPage = fs.readFileSync(path.join(root, 'src/app/orders/page.js'), 'utf8');
const robots = fs.readFileSync(path.join(root, 'src/app/robots.js'), 'utf8');
const middleware = fs.readFileSync(path.join(root, 'middleware.js'), 'utf8');
check(/getAllOrders\(\)/.test(dashboardPage) && /summarizeDashboard/.test(dashboardPage), 'Dashboard aggregation must run in the server page.');
check(/session\.role\s*!==\s*'staff'/.test(dashboardPage), 'Dashboard must enforce staff access on the server.');
check(/'use client'/.test(revenueChart) && /Revenue by neighbourhood/.test(revenueChart) && /Orders per day/.test(revenueChart), 'RevenueChart must be the client chart leaf and include both chart headings.');
check((revenueChart.match(/<table className="ops-summary-table"/g) || []).length === 2, 'Each chart must include its own accessible summary table.');
check(/role="img"/.test(revenueChart) && /maxValue/.test(revenueChart), 'Charts must include accessible SVG descriptions and a zero-based revenue axis.');
check(/<table\b/.test(orderTable) && /<caption>/.test(orderTable) && /<thead>/.test(orderTable) && /scope="col"/.test(orderTable) && /scope="row"/.test(orderTable), 'Order table must use semantic table markup and scoped headers.');
check(/next\/link/.test(orderTable) && /sort/.test(orderTable) && /page/.test(orderTable) && /URLSearchParams/.test(orderTable), 'Order sorting and pagination must be URL based and use Link elements.');
check((orderLoading.match(/length: 5/g) || []).length >= 1 && /<table/.test(orderLoading), 'Orders loading state must use a table-shaped five-row skeleton.');
check(/demoState === 'loading'/.test(orderPage) && /demoState === 'empty'/.test(orderPage) && /demoState === 'error'/.test(orderPage), 'Orders page must provide loading, empty, and error demo states.');
check(/demoState === 'loading'/.test(dashboardPage) && /demoState === 'empty'/.test(dashboardPage) && /demoState === 'error'/.test(dashboardPage), 'Dashboard must provide loading, empty, and error demo states.');
check(/dashboard/.test(robots) && /admin/.test(robots), 'Robots should disallow indexing staff dashboard and admin URLs.');
check(/session\.role !== 'staff'/.test(menuAdminPage) && /robots:/.test(menuAdminPage), 'Menu availability manager must be staff-only and noindex.');
check(/requireStaff/.test(menuAction) && /setStoredDishAvailability/.test(menuAction), 'Menu availability writes must re-check staff authorization server-side.');
check(/isAvailable/.test(menuManager) && /useFormStatus/.test(menuManager), 'Menu manager must show status and disable its action while pending.');
check(/dish\.isAvailable/.test(fs.readFileSync(path.join(root, 'src/app/actions/orders.js'), 'utf8')), 'Server-side order validation must reject disabled dishes.');
check(/twitter/.test(dishDetail) && /social\/dishes/.test(dishDetail) && /https:\/\//.test(dishDetail), 'Dish pages need absolute raster Open Graph/Twitter preview image URLs.');
check(/flex-wrap:nowrap/.test(css) && /overflow-x:auto/.test(css), 'Menu category filters must be horizontally scrollable.');
check(/role="group" aria-label="Filter menu by category"/.test(dishSearch), 'Menu category filters need an accessible group label.');
check(/dashboard\/:path\*/.test(middleware) && /admin\/:path\*/.test(middleware) && /isStaffRoute/.test(middleware) && /session\.role !== 'staff'/.test(middleware), 'Dashboard and admin middleware must require a staff session.');
check(/money\(tick\)/.test(revenueChart), 'Revenue chart axis ticks must be formatted as ETB values.');
check(/demo=pages/.test(fs.readFileSync(path.join(root, 'DASHBOARD.md'), 'utf8')), 'Dashboard documentation must include the reproducible page-three URL.');

const trackingPage = fs.readFileSync(path.join(root, 'src/app/track/[id]/page.js'), 'utf8');
const trackingMap = fs.readFileSync(path.join(root, 'src/app/track/[id]/DeliveryMap.jsx'), 'utf8');
const trackingMapLoader = fs.readFileSync(path.join(root, 'src/app/track/[id]/DeliveryMapLoader.jsx'), 'utf8');
const trackingClient = fs.readFileSync(path.join(root, 'src/app/track/[id]/DeliveryTrackingClient.jsx'), 'utf8');
const streamRoute = fs.readFileSync(path.join(root, 'src/app/api/orders/[id]/stream/route.js'), 'utf8');
const formatModule = fs.readFileSync(path.join(root, 'src/lib/format.js'), 'utf8');
const csvModule = fs.readFileSync(path.join(root, 'src/lib/csv.js'), 'utf8');
const checkoutForm = fs.readFileSync(path.join(root, 'src/components/checkout-form.jsx'), 'utf8');
const orderActions = fs.readFileSync(path.join(root, 'src/app/actions/orders.js'), 'utf8');
const trackingDoc = fs.readFileSync(path.join(root, 'TRACKING.md'), 'utf8');
check(packageJson.dependencies?.leaflet, 'Leaflet must be listed as a dependency.');
check(/ssr:\s*false/.test(trackingMapLoader) && /height:\s*360/.test(trackingMapLoader), 'Delivery map must be dynamically loaded without SSR and reserve a fixed-height placeholder.');
check(/leaflet\/dist\/leaflet\.css/.test(trackingMap) && /MAP_HEIGHT = 360/.test(trackingMap) && /openstreetmap\.org\/copyright/.test(trackingMap), 'Delivery map must import Leaflet CSS, set an explicit height, and keep map attribution.');
check(/fitBounds/.test(trackingMap) && /courierMarkerRef/.test(trackingMap) && /deliveryMarkerRef/.test(trackingMap), 'Delivery map must mark courier and destination and fit both in view.');
check(/getTrackingSnapshot/.test(trackingPage) && /getOrderForUser/.test(trackingPage) && /etb\(/.test(trackingPage) && /when\(/.test(trackingPage) && /relative\(/.test(trackingPage), 'Tracking page must be user-scoped, server-seeded, and use shared display formatters.');
check(/data: \$\{packet\}\\n\\n/.test(streamRoute) && /text\/event-stream/.test(streamRoute) && /getOrderForUser/.test(streamRoute), 'SSE route must authorize the user and frame data events with data: and two newlines.');
check(/new EventSource/.test(trackingClient) && /source\.close\(\)/.test(trackingClient) && /aria-live=/.test(trackingClient), 'Tracking client must show stream state and close EventSource on completion/unmount.');
check(/export function etb/.test(formatModule) && /export function when/.test(formatModule) && /export function relative/.test(formatModule), 'Shared formatting module must export etb, when, and relative.');
check(/replaceAll\('"', '""'\)/.test(csvModule) && /\[",\\r\\n\]/.test(csvModule) && /export function downloadCsv/.test(csvModule), 'CSV exporter must quote commas, quotes and newlines and include a download helper.');
check(/name=\"deliveryAddress\"/.test(checkoutForm) && /deliveryAddress/.test(orderActions), 'Checkout and server action must collect and validate the delivery address.');
check(/ExportOrdersButton/.test(orderPage) && /deliveryAddress/.test(orderPage), 'Order history must offer an export including the saved delivery address.');
check(/EventSource|GPS|OpenStreetMap/.test(trackingDoc), 'Tracking documentation must explain the tracking integration and its limitations.');

if (errors.length) {
  console.error('Addis Eats validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const heroKB = Math.round(fs.statSync(path.join(root, 'public/images/hero/addis-eats-delivery.webp')).size / 1024);
  const ogKB = Math.round(fs.statSync(path.join(root, 'public/og-image.jpg')).size / 1024);
  console.log(`Addis Eats validation passed: ${dishes.length} dishes, image fallbacks available, one homepage h1, Tailwind enabled.`);
  const shareFiles = fs.readdirSync(path.join(root, 'public/images/social/dishes')).filter((name) => name.endsWith('.jpg'));
  const largestShareKB = Math.max(...shareFiles.map((name) => fs.statSync(path.join(root, 'public/images/social/dishes', name)).size)) / 1024;
  console.log(`Image budgets: hero ${heroKB} KB, homepage social card ${ogKB} KB; ${shareFiles.length} dish social cards, largest ${largestShareKB.toFixed(1)} KB (target < 150 KB each).`);
  console.log('This is a static project check; run npm run build and deployed Lighthouse checks separately.');
}
