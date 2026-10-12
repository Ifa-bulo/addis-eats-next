'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './cart-provider';

const STORAGE_KEY = 'addis-eats-favorites';
const CHANGE_EVENT = 'addis-eats-favorites-change';

function readFavorites() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export default function FavoritesView({ dishes }) {
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const sync = () => { setIds(readFavorites()); setReady(true); };
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const favorites = dishes.filter((dish) => ids.includes(dish.id));

  if (!ready) return <div className="qe-empty-state" aria-live="polite"><span className="qe-empty-icon">♡</span><h2>Loading your saved dishes…</h2><p>Your favorites are stored in this browser.</p></div>;

  if (!favorites.length) {
    return (
      <div className="qe-empty-state">
        <span className="qe-empty-icon" aria-hidden="true">♡</span>
        <h2>Your favorites list is waiting.</h2>
        <p>Tap the heart on any dish to keep it close for your next order. Favorites are saved in this browser, so you do not need an account to use them.</p>
        <Link className="qe-button qe-button-primary" href="/menu">Explore the menu <span aria-hidden="true">→</span></Link>
      </div>
    );
  }

  return (
    <div className="qe-favorite-list">
      {favorites.map((dish) => (
        <article className="qe-favorite-row" key={dish.id}>
          <Link href={`/menu/${dish.id}`} className="qe-favorite-thumb">
            <Image src={dish.image} alt={dish.name} width={120} height={100} />
          </Link>
          <div className="qe-favorite-row-copy"><Link href={`/menu/${dish.id}`}><strong>{dish.name}</strong></Link><span>ETB {dish.price}</span></div>
          <button type="button" className="qe-button qe-button-small" onClick={() => addItem(dish)}>Add to cart <span aria-hidden="true">＋</span></button>
        </article>
      ))}
    </div>
  );
}
