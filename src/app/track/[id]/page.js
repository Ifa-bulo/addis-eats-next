import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrderForUser } from '@/lib/data';
import { getSession } from '@/lib/session';
import { etb, relative, when } from '@/lib/format';
import { getTrackingSnapshot } from '@/lib/tracking';
import DeliveryTrackingClient from './DeliveryTrackingClient';

export async function generateMetadata() {
  return {
    title: 'Track delivery',
    description: 'Track the status and delivery details of your Addis Eats order.',
    robots: { index: false, follow: false },
  };
}

function subtotalFor(order) {
  return (Array.isArray(order.items) ? order.items : []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
}

export default async function TrackDeliveryPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/signin?next=${encodeURIComponent(`/track/${id}`)}`);

  const order = getOrderForUser(id, session.id);
  if (!order) notFound();

  const tracking = getTrackingSnapshot(order);
  const subtotal = subtotalFor(order);
  const deliveryFee = Number.isFinite(Number(order.deliveryFee)) ? Number(order.deliveryFee) : 60;
  const total = order.status === 'cancelled' ? 0 : subtotal + deliveryFee;
  const deliveryLabel = order.deliveryOption === 'express' ? 'Express delivery' : 'Standard delivery';

  return (
    <section className="section container page-top ae-track-page">
      <Link href={`/orders/${encodeURIComponent(order.id)}`} className="back-link">← Back to order details</Link>
      <div className="ae-track-page-heading">
        <div>
          <span className="eyebrow dark">ADDIS EATS · DELIVERY TRACKING</span>
          <h1>Your order is on its way<span aria-hidden="true">.</span></h1>
          <p>Order <strong>#{order.id}</strong> · {order.area || 'Area not specified'} · {deliveryLabel}</p>
        </div>
        <Link href="/orders" className="button button-ghost">All my orders</Link>
      </div>

      <div className="ae-track-layout">
        <DeliveryTrackingClient initialSnapshot={tracking} initialRelative={relative(tracking.updatedAt)} />
        <aside className="panel-card ae-track-order-summary" aria-labelledby="ae-track-summary-title">
          <span className="eyebrow dark">ORDER SUMMARY</span>
          <h2 id="ae-track-summary-title">Your meal</h2>
          <p className="ae-track-placed">Placed <time dateTime={order.createdAt}>{when(order.createdAt)}</time> · {relative(order.createdAt)}</p>
          <div className="ae-track-summary-items">
            {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
              <div className="ae-track-summary-item" key={`${item.dishId || item.name || 'dish'}-${index}`}>
                <span><strong>{Number(item.quantity) || 0}×</strong> {String(item.name || 'Menu item')}</span>
                <strong>{etb((Number(item.price) || 0) * (Number(item.quantity) || 0))}</strong>
              </div>
            ))}
          </div>
          <div className="summary ae-track-totals">
            <div><span>Subtotal</span><strong>{etb(subtotal)}</strong></div>
            <div><span>{deliveryLabel}</span><strong>{etb(deliveryFee)}</strong></div>
            <div className="total-row"><span>Total</span><strong>{etb(total)}</strong></div>
          </div>
          <Link className="button button-primary wide ae-track-order-link" href={`/orders/${encodeURIComponent(order.id)}`}>View order details</Link>
        </aside>
      </div>
    </section>
  );
}
