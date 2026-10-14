import { getDishes } from '@/lib/data';
import { blogPosts } from '@/lib/blog-data';
import { SITE_URL } from '@/lib/site-url';

export default function sitemap() {
  const base = SITE_URL;
  const publicRoutes = ['', '/menu', '/about', '/blog', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date()
  }));
  const dishRoutes = getDishes().filter((dish) => dish.isAvailable).map((dish) => ({
    url: `${base}/menu/${dish.id}`,
    lastModified: new Date()
  }));
  return [...publicRoutes, ...blogRoutes, ...dishRoutes];
}
