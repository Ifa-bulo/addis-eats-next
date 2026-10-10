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
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export default function HomeFavorites({ dishes }) {
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const sync = () => {
      setIds(readFavorites());
      setReady(true);
    };

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const favorites = dishes.filter((dish) => ids.includes(dish.id)).slice(0, 2);

  return (
    <section className="qe-home-saved-panel">
      <div className="qe-panel-heading">
        <div>
          <span className="qe-eyebrow">MADE FOR YOUR NEXT ORDER</span>
          <h2>Your saved favorites</h2>
        </div>
        <Link href="/favorites">
          See all <span aria-hidden="true">→</span>
        </Link>
      </div>

      {!ready || !favorites.length ? (
        <div className="qe-mini-empty">
          <span aria-hidden="true">♡</span>
          <div>
            <strong>Keep the good stuff close.</strong>
            <p>
              Tap the heart on any dish and it will appear here for an easy
              reorder.
            </p>
          </div>
          <Link href="/menu">Browse dishes</Link>
        </div>
      ) : (
        favorites.map((dish) => (
          <div className="qe-reorder-row" key={dish.id}>
            <Image src={dish.image} alt={dish.name} width={92} height={82} />
            <div>
              <strong>{dish.name}</strong>
              <span>ETB {dish.price}</span>
            </div>
            <button
              className="qe-mini-button"
              onClick={() => addItem(dish)}
              type="button"
            >
              Reorder
            </button>
          </div>
        ))
      )}
    </section>
  );
}