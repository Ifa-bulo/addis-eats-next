import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';

export const metadata = { title: 'Food & Product Notes', description: 'Notes on food, product design and the engineering choices behind Addis Eats.' };

export default function BlogPage() {
  return <section className="section container page-top"><div className="page-intro"><div><span className="eyebrow dark">FROM THE KITCHEN</span><h1>Stories, tips &amp; tasty details.</h1><p>Short notes about the experience and the engineering behind Addis Eats.</p></div></div><div className="post-grid">{blogPosts.map((post) => <article className="post-card" key={post.slug}><span>{post.number}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">→</span></Link></article>)}</div></section>;
}
