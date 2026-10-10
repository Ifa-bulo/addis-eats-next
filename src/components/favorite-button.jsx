'use client';

import { useEffect, useState } from 'react';

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

export default function FavoriteButton({ dishId, dishName, className = '' }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readFavorites().includes(dishId));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [dishId]);

  function toggleFavorite() {
    const current = readFavorites();
    const next = current.includes(dishId) ? current.filter((id) => id !== dishId) : [...current, dishId];
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* The button still works in memory for this click. */ }
    setSaved(next.includes(dishId));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      className={`qe-favorite-button ${saved ? 'saved' : ''} ${className}`.trim()}
      onClick={toggleFavorite}
      aria-pressed={saved}
      aria-label={`${saved ? 'Remove' : 'Save'} ${dishName} ${saved ? 'from' : 'to'} favorites`}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
    </button>
  );
}
