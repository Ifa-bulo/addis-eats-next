import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost } from '@/lib/blog-data';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Article not found', robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: `${post.title} | Addis Eats`, description: post.excerpt, images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Addis Eats food delivery' }] }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return (
    <article className="qe-container qe-inner-page qe-article-page">
      <Link href="/blog" className="back-link">← All food notes</Link>
      <header className="qe-article-header"><span className="qe-eyebrow">ADDIS EATS · PRODUCT NOTES</span><h1>{post.title}</h1><p>{post.excerpt}</p></header>
      <div className="qe-article-image"><Image src="/images/hero/addis-eats-delivery.webp" alt="A food delivery courier hands a meal to a smiling customer in Addis Ababa." width={1200} height={675} priority sizes="(max-width: 760px) 100vw, 900px" /></div>
      <div className="qe-article-body">{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<div className="qe-article-cta"><strong>Ready for something good?</strong><p>Browse the current menu and find your next favorite.</p><Link className="qe-button qe-button-primary" href="/menu">Explore the menu <span aria-hidden="true">→</span></Link></div></div>
    </article>
  );
}
