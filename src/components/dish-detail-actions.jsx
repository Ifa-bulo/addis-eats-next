'use client';

import Link from 'next/link';
import { useCart } from './cart-provider';

export default function DishDetailActions({ dish }) {
  const { addItem } = useCart();

  return (
    <div className="detail-actions">
      <button className="button button-primary" onClick={() => addItem(dish)}>
        Add to cart <span>+</span>
      </button>
      <Link className="button button-dark" href="/checkout">
        Go to checkout →
      </Link>
    </div>
  );
}