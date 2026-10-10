import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="qe-footer">
      <div className="qe-container qe-footer-grid">
        <div className="qe-footer-brand-block">
          <Link
            className="qe-brand qe-footer-brand"
            href="/"
            aria-label="Addis Eats home"
          >
            <span className="qe-brand-mark" aria-hidden="true">
              🛵
            </span>
            <span className="qe-brand-words">
              Addis<span>Eats</span>
              <small>GOOD FOOD. RIGHT ON TIME.</small>
            </span>
          </Link>
          <p>
            Ethiopian favorites and everyday comfort food, delivered with care
            across Addis Ababa.
          </p>
        </div>

        <div>
          <h2>Explore</h2>
          <Link href="/menu">Full menu</Link>
          <Link href="/favorites">Your favorites</Link>
          <Link href="/orders">Track an order</Link>
        </div>

        <div>
          <h2>About</h2>
          <Link href="/about">Our story</Link>
          <Link href="/blog">Food notes</Link>
          <Link href="/contact">Contact and support</Link>
        </div>

        <div className="qe-footer-note">
          <h2>Good food, less guesswork.</h2>
          <p>
            Clear prices in ETB, thoughtful menu details, and an order status
            you can follow.
          </p>
          <Link className="qe-footer-cta" href="/menu">
            Explore the menu <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="qe-container qe-footer-bottom">
        <span>© {new Date().getFullYear()} Addis Eats</span>
        <span>Designed for good food moments in Addis Ababa.</span>
        <Link href="/signin">Account access</Link>
      </div>
    </footer>
  );
}