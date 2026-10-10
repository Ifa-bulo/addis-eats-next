'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-provider';

export default function ComboDeals({ dishes }) {
  const { addItem } = useCart();
  const byId = new Map(dishes.map((dish) => [dish.id, dish]));

  const combos = [
    {
      title: 'A classic Addis pairing',
      subtitle: 'Doro wat + Ethiopian coffee',
      ids: ['doro-wat', 'buna'],
    },
    {
      title: 'Burger break',
      subtitle: 'Special burger + fresh juice',
      ids: ['special-burger', 'fresh-juice'],
    },
  ]
    .map((combo) => ({
      ...combo,
      items: combo.ids.map((id) => byId.get(id)).filter(Boolean),
    }))
    .filter((combo) => combo.items.length === 2);

  return (
    <section className="qe-combo-panel">
      <div className="qe-panel-heading">
        <div>
          <span className="qe-eyebrow">GOOD TOGETHER</span>
          <h2>Build your own combo</h2>
        </div>
        <Link href="/menu">
          Full menu <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="qe-combo-list">
        {combos.map((combo) => (
          <article className="qe-combo-row" key={combo.title}>
            <div className="qe-combo-images">
              {combo.items.map((dish) => (
                <Image
                  key={dish.id}
                  src={dish.image}
                  alt={dish.name}
                  width={72}
                  height={64}
                />
              ))}
              <span aria-hidden="true">＋</span>
            </div>

            <div className="qe-combo-copy">
              <strong>{combo.title}</strong>
              <span>{combo.subtitle}</span>
              <b>
                ETB {combo.items.reduce((sum, dish) => sum + dish.price, 0)}
              </b>
            </div>

            <button
              type="button"
              className="qe-combo-add"
              aria-label={`Add ${combo.subtitle} to cart`}
              onClick={() => combo.items.forEach(addItem)}
            >
              ＋
            </button>
          </article>
        ))}
      </div>

      <p className="qe-combo-note">
        Prices are the sum of the listed dishes. No hidden combo discount is
        assumed.
      </p>
    </section>
  );
}