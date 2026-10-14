import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderForUser } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { etb, when, relative } from '@/lib/format';
import { DELIVERY_OPTIONS } from '@/lib/delivery';
import OrderStatus from '@/components/order-status';
import CancelOrderForm from '@/components/cancel-order-form';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }) {
  const session = await requireUser();
  const { id } = await params;
  const order = getOrderForUser(id, session.id);
  if (!order) notFound();

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryOption = DELIVERY_OPTIONS[order.deliveryOption] || DELIVERY_OPTIONS.standard;
  const deliveryFee = Number.isFinite(order.deliveryFee) ? order.deliveryFee : deliveryOption.fee;
  const deliveryLabel = deliveryOption.label;

  return (
    <section className="section container page-top">
      <Link href="/orders" className="back-link">← All orders</Link>
      <div className="page-intro tight">
        <div>
          <span className="eyebrow dark">ORDER TRACKING</span>
          <h1>Good food is on the move.</h1>
          <p>Order #{order.id} · {order.area} · {deliveryLabel}</p>
          <p className="ae-order-date-copy">Placed {when(order.createdAt)} · {relative(order.createdAt)}</p>
          <Link className="button button-primary" href={`/track/${encodeURIComponent(order.id)}`}>Open delivery map →</Link>
        </div>
        {order.status !== 'delivered' && order.status !== 'cancelled' ? <CancelOrderForm orderId={order.id} /> : null}
      </div>
      <div className="order-detail-grid">
        <OrderStatus orderId={order.id} initialOrder={order} />
        <aside className="panel-card">
          <span className="eyebrow dark">ORDER SUMMARY</span><h2>{order.items.length} dishes</h2>
          <div className="cart-list small">{order.items.map((item) => <div className="cart-item" key={item.dishId}><div><strong>{item.quantity}× {item.name}</strong><span>{etb(item.price * item.quantity)}</span></div></div>)}</div>
          <div className="summary"><div><span>Subtotal</span><strong>{etb(subtotal)}</strong></div><div><span>{deliveryLabel}</span><strong>{etb(deliveryFee)}</strong></div><div className="total-row"><span>Total</span><strong>{etb(order.status === 'cancelled' ? 0 : subtotal + deliveryFee)}</strong></div></div>
        </aside>
      </div>
    </section>
  );
}
