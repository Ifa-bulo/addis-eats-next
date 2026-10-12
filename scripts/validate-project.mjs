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
  'src/app/favorites/page.js', 'src/app/blog/[slug]/page.js', 'AUTH.md', 'DATA.md', 'PERF.md', 'docs/TESTING.md'
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
check((homepage.match(/<h1\b/g) || []).length === 1, 'Homepage must render exactly one h1.');
check(/alt\s*=/.test(homepage), 'Homepage images should include alt attributes.');
check(packageJson.dependencies?.next === '15.5.27', 'Expected the pinned Next.js 15.5.27 release line.');
check(packageJson.dependencies?.react === packageJson.dependencies?.['react-dom'], 'React and React DOM versions must match.');
check(fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8').startsWith('@import "tailwindcss";'), 'Tailwind CSS v4 must be enabled in globals.css.');

if (errors.length) {
  console.error('Addis Eats validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const heroKB = Math.round(fs.statSync(path.join(root, 'public/images/hero/addis-eats-delivery.webp')).size / 1024);
  const ogKB = Math.round(fs.statSync(path.join(root, 'public/og-image.jpg')).size / 1024);
  console.log(`Addis Eats validation passed: ${dishes.length} dishes, image fallbacks available, one homepage h1, Tailwind enabled.`);
  console.log(`Image budgets: hero ${heroKB} KB, social preview ${ogKB} KB (target < 150 KB each).`);
  console.log('This is a static project check; run npm run build and deployed Lighthouse checks separately.');
}
