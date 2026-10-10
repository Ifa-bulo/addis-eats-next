import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section container page-top narrow empty-state">
      <div>🍽️</div>
      <h1>That page got lost in the kitchen.</h1>
      <p>Let’s get you back to the good stuff.</p>
      <Link href="/menu" className="button button-primary">
        Back to menu
      </Link>
    </section>
  );
}