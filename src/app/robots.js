import { SITE_URL } from '@/lib/site-url';

export default function robots() {
  const base = SITE_URL;
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/orders', '/track', '/checkout', '/kitchen', '/dashboard', '/admin', '/signin', '/signup', '/favorites', '/api'] }],
    sitemap: `${base}/sitemap.xml`
  };
}
