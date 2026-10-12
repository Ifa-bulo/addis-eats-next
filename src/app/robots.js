import { SITE_URL } from '@/lib/site-url';

export default function robots() {
  const base = SITE_URL;
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/orders', '/checkout', '/kitchen', '/signin', '/signup', '/favorites', '/api'] }],
    sitemap: `${base}/sitemap.xml`
  };
}
