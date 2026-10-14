import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

function listFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...listFiles(full));
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) result.push(full);
  }
  return result;
}

const sourceFiles = listFiles('src');
const css = read('src/app/globals.css');
const layout = read('src/app/layout.js');
const checkout = read('src/components/checkout-form.jsx');
const actions = read('src/app/actions/orders.js');
const data = read('src/lib/data.js');
const signin = read('src/components/signin-form.jsx');
const signup = read('src/components/signup-form.jsx');
const kitchen = read('src/components/kitchen-board.jsx');
const logout = read('src/components/logout-button.jsx');
const cancelOrder = read('src/components/cancel-order-form.jsx');
const readme = read('README.md');
const envExample = read('.env.example');

check(/:focus-visible/.test(css), 'Global visible keyboard focus styles are missing.');
check(/min-height:\s*44px/.test(css) && /min-width:\s*44px/.test(css), 'Interactive controls must have minimum 44px targets.');
check(/prefers-reduced-motion/.test(css), 'Respect prefers-reduced-motion.');
check(/className="skip-link"/.test(read('src/components/header.js')) && /id="main-content"/.test(layout) && /tabIndex=\{-1\}/.test(layout), 'Skip-to-content link and main landmark must both exist.');
check(/<form\s+onSubmit=/.test(checkout) && /submitLock/.test(checkout) && /disabled=\{[^}]*submitting/.test(checkout), 'Checkout must use onSubmit, block duplicate submissions, and disable controls while pending.');
check(/name="orderKey"/.test(checkout) && /orderKey/.test(actions) && /idempotencyKey/.test(actions) && /__ADDIS_EATS_ORDER_IDEMPOTENCY__/.test(data), 'Order creation needs an idempotency key and server-side deduplication.');
check(/type="tel"/.test(checkout), 'Checkout phone input must use type="tel".');
for (const [file, source] of [['sign-in form', signin], ['sign-up form', signup], ['kitchen status form', kitchen], ['logout form', logout], ['cancel-order form', cancelOrder]]) {
  check(/onSubmit=/.test(source) && /inFlight/.test(source), `${file} must use onSubmit and block a rapid duplicate submission.`);
}
check(/ENABLE_DEMO_ACCOUNTS/.test(data), 'Seeded demo accounts must be gated by environment.');
check(/^SESSION_SECRET=$/m.test(envExample), '.env.example must leave SESSION_SECRET blank, not ship a sample signing key.');
check(!/DEVELOPMENT_SECRET\s*=\s*['"][^'"]+['"]/.test(read('src/lib/session-crypto.js')), 'Do not ship a hard-coded session signing secret.');
check(!/NEXT_PUBLIC_[A-Z0-9_]*(SECRET|PASSWORD|TOKEN|PRIVATE_KEY)/i.test(envExample), 'A secret-like environment variable must not use NEXT_PUBLIC_.');
check(readme.includes('https://addis-eats-next-omega.vercel.app'), 'README must include the live deployment URL.');
check(/vercel rollback/.test(readme), 'README must explain how to roll back a Vercel deployment.');

for (const file of sourceFiles) {
  const source = read(file);
  check(!/<div\b[^>]*\bonClick\s*=/.test(source), `Clickable div found in ${file}; use a button or link.`);
  check(!/<(?:div|span|p|li)\b[^>]*\brole\s*=\s*["']button["']/.test(source), `Non-semantic element used as a button in ${file}.`);
}

if (errors.length) {
  console.error('Accessibility/security preflight failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Accessibility/security static preflight passed across ${sourceFiles.length} source files.`);
  console.log('This static check does not replace keyboard, real-phone, double-tap, private-window, or deployed-route testing.');
}
