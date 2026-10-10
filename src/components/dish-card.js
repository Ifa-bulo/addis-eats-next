'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-provider';
import FavoriteButton from './favorite-button';

const categoryLabel = (value) =>
  value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const spiceLabel = (level) =>
  ['No spice', 'Mild', 'Medium', 'Hot'][
    Math.max(0, Math.min(3, Number(level) || 0))
  ];

export default function DishCard({ dish }) {
  const { addItem } = useCart();

  return (
    <article className="dish-card dish-card-v2 qe-dish-card">
      <div className="qe-dish-photo">
        <Link
          href={`/menu/${dish.id}`}
          className="dish-image-wrap"
          aria-label={`View ${dish.name}`}
        >
          <Image
            src={dish.image}
            alt={dish.name}
            width={900}
            height={620}
            className="dish-image"
            sizes="(max-width: 640px) 90vw, (max-width: 980px) 45vw, 25vw"
          />
        </Link>
        <FavoriteButton dishId={dish.id} dishName={dish.name} />
        {dish.popular && (
          <span className="qe-popular-tag">
            <span aria-hidden="true">★</span> Popular
          </span>
        )}
      </div>

      <div className="dish-body qe-dish-body">
        <div className="dish-meta">
          <span>{categoryLabel(dish.category)}</span>
          <span className="qe-spice-pill">{spiceLabel(dish.spiceLevel)}</span>
        </div>

        <Link href={`/menu/${dish.id}`} className="qe-dish-title-link">
          <h3>{dish.name}</h3>
        </Link>

        <p>{dish.description}</p>

        <div className="dish-bottom qe-dish-bottom">
          <strong>ETB {dish.price}</strong>
          <button
            type="button"
            className="add-button"
            onClick={() => addItem(dish)}
            aria-label={`Add ${dish.name} to cart`}
          >
            Add <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  );
}