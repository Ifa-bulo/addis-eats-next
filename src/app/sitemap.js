import { getDishes } from '@/lib/data';
import { blogPosts } from '@/lib/blog-data';

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publicRoutes = ['', '/menu', '/about', '/blog', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date()
  }));
  const dishRoutes = getDishes().map((dish) => ({
    url: `${base}/menu/${dish.id}`,
    lastModified: new Date()
  }));
  return [...publicRoutes, ...blogRoutes, ...dishRoutes];
}
