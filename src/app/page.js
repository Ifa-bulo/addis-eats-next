import Link from 'next/link';
import Image from 'next/image';
import { getDishes } from '@/lib/data';
import DishCard from '@/components/dish-card';
import HomeFavorites from '@/components/home-favorites';
import ComboDeals from '@/components/combo-deals';
import { SITE_URL } from '@/lib/site-url';

export const metadata = {
  title: 'Addis Eats | Your Next Meal Is Almost Here',
  description: 'Discover Ethiopian favorites, vegetarian plates, burgers, pizza, drinks and desserts. Order from the Addis Eats menu and follow your order status.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Addis Eats | Your Next Meal Is Almost Here',
    description: 'Ethiopian favorites and everyday comfort food, delivered with care across Addis Ababa.',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Addis Eats food delivery in Addis Ababa' }]
  }
};

const categories = [
  { label: 'Ethiopian', value: 'main-dishes', image: '/images/dishes/doro-wat.svg', description: 'Local favorites' },
  { label: 'Vegetarian', value: 'vegetarian', image: '/images/dishes/paneer.svg', description: 'Plant-forward plates' },
  { label: 'Burgers', value: 'burgers', image: '/images/dishes/burger.svg', description: 'Juicy and satisfying' },
  { label: 'Pizza', value: 'pizzas', image: '/images/dishes/margherita.svg', description: 'Fresh from the oven' },
  { label: 'Coffee & tea', value: 'drinks', image: '/images/dishes/coffee.svg', description: 'A little pick-me-up' },
  { label: 'Sweet bites', value: 'desserts', image: '/images/dishes/fruit.svg', description: 'Something sweet' }
];

export default function HomePage() {
  const dishes = getDishes();
  const popularDishes = dishes.filter((dish) => dish.popular).slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Addis Eats',
    url: SITE_URL,
    description: 'Ethiopian favorites and everyday comfort food delivered across Addis Ababa.',
    servesCuisine: ['Ethiopian', 'Vegetarian', 'Burgers', 'Pizza'],
    priceRange: 'ETB',
    potentialAction: {
      '@type': 'OrderAction',
      target: `${SITE_URL}/menu`
    }
  };

  return (
    <div className="qe-home">
      <section className="qe-hero" aria-labelledby="hero-title">
        <div className="qe-hero-media">
          <Image
            src="/images/hero/addis-eats-delivery.webp"
            alt="An Ethiopian woman smiles as a courier hands her a food order outside a modern home."
            fill
            priority
            sizes="(max-width: 760px) 100vw, 74vw"
            className="qe-hero-image"
          />
        </div>
        <div className="qe-hero-wash" aria-hidden="true" />
        <div className="qe-container qe-hero-inner">
          <div className="qe-hero-copy">
            <div className="qe-kicker"><span aria-hidden="true">✦</span> FRESH. FAST. MADE FOR YOU.</div>
            <h1 id="hero-title">Your next meal is <em>almost here.</em></h1>
            <p>Local favorites, bold Ethiopian flavors, and everyday comfort food delivered with care across Addis Ababa.</p>
            <div className="qe-hero-actions">
              <Link className="qe-button qe-button-primary" href="/menu">Order now <span aria-hidden="true">→</span></Link>
              <Link className="qe-button qe-button-outline" href="/orders">Track my order</Link>
            </div>
            <form action="/menu" className="qe-hero-search" role="search">
              <label htmlFor="hero-dish-search" className="sr-only">Search the menu</label>
              <span aria-hidden="true">⌕</span>
              <input id="hero-dish-search" name="query" type="search" placeholder="Doro wat, tibs, burgers, coffee..." />
              <button type="submit" aria-label="Search menu">Search</button>
            </form>
            <div className="qe-social-proof">
              <div className="qe-avatar-stack" aria-hidden="true"><span>F</span><span>S</span><span>M</span><span>A</span></div>
              <div><strong>Made for hungry Addis</strong><span>Thoughtful food, simple ordering</span></div>
              <span className="qe-proof-spark" aria-hidden="true">✦</span>
            </div>
          </div>
        </div>
        <div className="qe-delivery-glance">
          <div className="qe-delivery-time"><span className="qe-clock-icon" aria-hidden="true">◷</span><div><small>TYPICAL DELIVERY WINDOW</small><strong>25–35 <small>min</small></strong><span>Estimated time, varies by area</span></div></div>
          <div className="qe-glance-item"><span aria-hidden="true">⌖</span><strong>Local</strong><small>Addis areas</small></div>
          <div className="qe-glance-item"><span aria-hidden="true">♧</span><strong>Careful</strong><small>Packaging</small></div>
          <div className="qe-glance-item"><span aria-hidden="true">✓</span><strong>Clear</strong><small>Menu &amp; prices</small></div>
        </div>
      </section>

      <section className="qe-container qe-section qe-quick-order" aria-labelledby="quick-order-title">
        <div className="qe-section-heading"><div><span className="qe-eyebrow">A GOOD PLACE TO START</span><h2 id="quick-order-title">Quick order</h2><p>Find the kind of food you are craving.</p></div><Link href="/menu" className="qe-text-link">See all dishes <span aria-hidden="true">→</span></Link></div>
        <div className="qe-category-grid">
          {categories.map((category) => (
            <Link className="qe-category-card" key={category.value} href={`/menu?category=${encodeURIComponent(category.value)}`}>
              <span className="qe-category-art"><Image src={category.image} alt="" width={92} height={64} sizes="92px" /></span>
              <strong>{category.label}</strong><small>{category.description}</small>
            </Link>
          ))}
          <Link className="qe-category-card qe-category-all" href="/menu"><span className="qe-category-all-icon" aria-hidden="true">＋</span><strong>All dishes</strong><small>{dishes.length} menu items</small></Link>
        </div>
      </section>

      <section className="qe-container qe-filter-shortcuts" aria-labelledby="browse-title">
        <div className="qe-section-heading qe-shortcut-heading"><div><span className="qe-eyebrow">PICK YOUR MOOD</span><h2 id="browse-title">What sounds good today?</h2></div></div>
        <nav className="qe-shortcut-tabs" aria-label="Browse dishes by category">
          <Link className="selected" href="/menu">All dishes <span aria-hidden="true">✦</span></Link>
          <Link href="/menu?category=main-dishes">Ethiopian <span aria-hidden="true">☀</span></Link>
          <Link href="/menu?category=vegetarian">Vegetarian <span aria-hidden="true">♧</span></Link>
          <Link href="/menu?category=burgers">Burgers <span aria-hidden="true">◉</span></Link>
          <Link href="/menu?category=drinks">Drinks <span aria-hidden="true">☕</span></Link>
        </nav>
      </section>

      <section className="qe-container qe-delivery-banner" aria-label="Order tracking">
        <div className="qe-scooter-illustration" aria-hidden="true">🛵</div>
        <div className="qe-banner-copy"><span>FROM OUR MENU TO YOUR DOOR</span><h2>We’ll keep you in the loop.</h2><p>Your order page refreshes status automatically after checkout.</p></div>
        <Link href="/orders" className="qe-button qe-button-white">Track my order <span aria-hidden="true">→</span></Link>
      </section>

      <section className="qe-container qe-section qe-popular-section" aria-labelledby="popular-title">
        <div className="qe-section-heading"><div><span className="qe-eyebrow">LOVED FOR A REASON</span><h2 id="popular-title">Popular dishes</h2><p>Start with something the Addis Eats menu loves to show off.</p></div><Link href="/menu?popular=true" className="qe-text-link">View popular <span aria-hidden="true">→</span></Link></div>
        {popularDishes.length ? <div className="qe-dish-grid">{popularDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}</div> : <div className="qe-empty-inline"><h3>Popular picks are coming soon.</h3><p>Explore the full menu in the meantime.</p><Link className="qe-button qe-button-primary" href="/menu">Browse menu</Link></div>}
      </section>

      <section className="qe-container qe-personalize-grid" aria-label="Personal favorites and meal combinations">
        <HomeFavorites dishes={dishes} />
        <ComboDeals dishes={dishes} />
      </section>

      <section className="qe-container qe-section qe-quality-section" aria-labelledby="quality-title">
        <div className="qe-quality-intro"><span className="qe-eyebrow">GOOD FOOD SHOULD FEEL EASY</span><h2 id="quality-title">A better ordering experience, from browse to doorstep.</h2><p>Clear dish details, transparent ETB prices, and private order tracking are part of the experience, not afterthoughts.</p><Link className="qe-button qe-button-primary" href="/menu">Explore the menu <span aria-hidden="true">→</span></Link></div>
        <div className="qe-quality-points">
          <article><span aria-hidden="true">⌕</span><div><h3>Find it quickly</h3><p>Search waits for a pause in typing, so the network does not fire on every keystroke.</p></div></article>
          <article><span aria-hidden="true">♧</span><div><h3>Keep your picks</h3><p>Save favorites in this browser and add them to your cart again in a tap.</p></div></article>
          <article><span aria-hidden="true">✓</span><div><h3>Follow your order</h3><p>Signed-in order pages only show orders that belong to the current account.</p></div></article>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
