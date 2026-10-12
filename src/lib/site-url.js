const PRODUCTION_SITE_URL = 'https://addis-eats-next-omega.vercel.app';
const LOCAL_SITE_URL = 'http://localhost:3000';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isProduction = process.env.NODE_ENV === 'production';
const configuredUrlIsSafe = configuredSiteUrl && (!isProduction || /^https:\/\//i.test(configuredSiteUrl));

export const SITE_URL = (configuredUrlIsSafe
  ? configuredSiteUrl
  : isProduction
    ? PRODUCTION_SITE_URL
    : LOCAL_SITE_URL
).replace(/\/+$/, '');
