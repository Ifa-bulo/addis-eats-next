import { getDishes } from '@/lib/data';
import FavoritesView from '@/components/favorites-view';

export const metadata = {
  title: 'Saved Favorites',
  description: 'Your saved Addis Eats dishes on this device.',
  robots: { index: false, follow: false }
};

export default function FavoritesPage() {
  const dishes = getDishes();
  return (
    <section className="qe-container qe-inner-page">
      <div className="qe-page-intro"><span className="qe-eyebrow">YOUR PERSONAL SHORTLIST</span><h1>Your favorites</h1><p>Keep the dishes you love close, then add them to your cart whenever you are ready.</p></div>
      <FavoritesView dishes={dishes} />
    </section>
  );
}
