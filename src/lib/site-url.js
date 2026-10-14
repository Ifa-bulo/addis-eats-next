const PRODUCTION_SITE_URL = 'https://addis-eats-next-omega.vercel.app';
const LOCAL_SITE_URL = 'http://localhost:3000';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isProductionBuild = process.env.NODE_ENV === 'production';
const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
const previewDeploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const configuredUrlIsSafe = configuredSiteUrl && (!isProductionBuild || /^https:\/\//i.test(configuredSiteUrl));

// Preview deployments have unique URLs. Prefer Vercel's deployment hostname
// for preview metadata unless a separate custom preview URL is needed.
export const SITE_URL = (
  isPreviewDeployment && previewDeploymentUrl
    ? previewDeploymentUrl
    : configuredUrlIsSafe
      ? configuredSiteUrl
      : isProductionBuild
        ? PRODUCTION_SITE_URL
        : LOCAL_SITE_URL
).replace(/\/+$/, '');
