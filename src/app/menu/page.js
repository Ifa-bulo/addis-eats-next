import { getDishes } from '@/lib/data';
import SearchMenu from '@/components/search-menu';

export const metadata = {
  title: 'Menu',
  description: 'Browse Ethiopian mains, vegetarian plates, burgers, pizza, drinks and desserts from Addis Eats.'
};

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const query = String(params?.query || '').trim();
  const category = String(params?.category || '').trim();
  const popular = String(params?.popular || '') === 'true';
  const allDishes = getDishes();
  const initial = allDishes;

  return <section className="section container page-top"><div className="page-intro page-intro-v2"><div><span className="eyebrow dark">THE ADDIS EATS MENU</span><h1>Find your next favorite.</h1><p>A focused menu of carefully described dishes. Search instantly, filter by category and add to your cart in one tap.</p></div><div className="mini-stat"><strong>{allDishes.length}</strong><span>signature dishes</span></div></div><SearchMenu initialDishes={initial} initialQuery={query} initialCategory={category} initialPopular={popular} /></section>;
}
