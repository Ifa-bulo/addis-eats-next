import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDish, getDishes } from '@/lib/data';
import DishDetailActions from '@/components/dish-detail-actions';

export async function generateStaticParams() {
  return getDishes().map((dish) => ({ id: dish.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDish(id);
  if (!dish) return { title: 'Dish not found' };

  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      title: `${dish.name} | Addis Eats`,
      description: `ETB ${dish.price} - ${dish.description}`,
      images: [
        {
          url: dish.image,
          width: 1200,
          height: 900,
          alt: dish.name,
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

const categoryLabel = (value) =>
  value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const spiceLabel = (level) =>
  ['No spice', 'Mild', 'Medium', 'Hot'][
    Math.max(0, Math.min(3, Number(level) || 0))
  ];

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDish(id);

  if (!dish) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: dish.name,
    image: [dish.image],
    description: dish.description,
    category: categoryLabel(dish.category),
    offers: {
      '@type': 'Offer',
      price: dish.price,
      priceCurrency: 'ETB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <section className="section container page-top">
      <Link href="/menu" className="back-link">
        ← Back to menu
      </Link>

      <div className="detail-grid detail-grid-v2">
        <div className="detail-image detail-image-v2">
          <Image
            src={dish.image}
            alt={dish.name}
            width={1200}
            height={900}
            priority
          />
        </div>

        <div className="detail-copy detail-copy-v2">
          {dish.popular && (
            <span className="dish-tag static">Popular choice</span>
          )}
          <span className="eyebrow dark">
            {categoryLabel(dish.category)}
          </span>
          <h1>{dish.name}</h1>

          <div className="dish-detail-facts">
            <span>🌶️ {spiceLabel(dish.spiceLevel)}</span>
            <span>✓ Freshly prepared</span>
          </div>

          <p className="detail-description">{dish.description}</p>
          <div className="detail-price">ETB {dish.price}</div>

          <DishDetailActions dish={dish} />

          <div className="detail-trust">
            <span>✓ Clear pricing</span>
            <span>✓ Secure checkout</span>
            <span>✓ Live order tracking</span>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}