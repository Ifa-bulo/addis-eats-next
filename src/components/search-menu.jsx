'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import DishCard from './dish-card';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Search failed');
  return res.json();
});

const categories = ['All', 'main-dishes', 'vegetarian', 'burgers', 'pizzas', 'drinks', 'desserts'];
const categoryLabel = (value) => value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function SearchMenu({ initialDishes, initialQuery = '', initialCategory = '', initialPopular = false }) {
  const [term, setTerm] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [popularOnly, setPopularOnly] = useState(initialPopular);
  const [debounced, setDebounced] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), 450);
    return () => clearTimeout(timer);
  }, [term]);

  const key = debounced || popularOnly ? `/api/dishes?${new URLSearchParams({ ...(debounced ? { query: debounced } : {}), ...(popularOnly ? { popular: 'true' } : {}) }).toString()}` : null;
  const { data, error, isValidating } = useSWR(key, fetcher, {
    fallbackData: initialDishes,
    keepPreviousData: true,
    revalidateOnFocus: false
  });

  const activeQuery = debounced.trim().toLowerCase();
  const results = (data ?? initialDishes).filter((dish) => {
    const matchesQuery = !activeQuery || [dish.name, dish.category, dish.description].join(' ').toLowerCase().includes(activeQuery);
    return matchesQuery && (!category || dish.category.toLowerCase() === category.toLowerCase()) && (!popularOnly || dish.popular);
  });

  return <div>
    <div className="search-panel search-panel-v2">
      <div className="search-field"><span>⌕</span><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search dishes, ingredients or categories..." aria-label="Search menu" /></div>
      <div className="category-selects">{categories.map((item) => { const value = item === 'All' ? '' : item; return <button type="button" key={item} onClick={() => setCategory(value)} className={category === value ? 'selected' : ''} aria-pressed={category === value}>{categoryLabel(item)}</button>; })}<button type="button" onClick={() => setPopularOnly((value) => !value)} className={popularOnly ? 'selected' : ''} aria-pressed={popularOnly}>Popular only</button></div>
      <div className="search-status"><span>{isValidating && (debounced || popularOnly) ? 'Updating results…' : `${results.length} dish${results.length === 1 ? '' : 'es'}`}</span>{error && <span className="error-text">Search is unavailable. Showing the last results.</span>}</div>
    </div>
    {results.length ? <div className="dish-grid">{results.map((dish) => <DishCard key={dish.id} dish={dish} />)}</div> : <div className="empty-state"><div>🍽️</div><h3>Nothing matched that search.</h3><p>Try “doro wat”, “tibs”, “burger”, “pizza” or “coffee”.</p></div>}
  </div>;
}
