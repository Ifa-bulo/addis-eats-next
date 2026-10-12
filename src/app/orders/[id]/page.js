import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrderForUser } from '@/lib/data';
import { getSession } from '@/lib/session';
import OrderStatus from '@/components/order-status';
import { cancelOrder } from '@/app/actions/orders';

export async function generateMetadata({ params }) { return { title: 'Track Order', description: 'Live private order tracking for Addis Eats.', robots: { index: false, follow: false } }; }

export default async function OrderDetailPage({ params }) {
  const session = await getSession();
  if (!session) redirect('/signin');
  const { id } = await params;
  const order = getOrderForUser(id, session.id);
  if (!order) notFound();
  const subtotal = order.items.reduce((sum,item)=>sum + item.price*item.quantity, 0);
  const deliveryFee = Number.isFinite(Number(order.deliveryFee)) ? Number(order.deliveryFee) : 60;
  const deliveryLabel = order.deliveryOption === 'express' ? 'Express delivery' : 'Standard delivery';
  return <section className="section container page-top"><Link href="/orders" className="back-link">← All orders</Link><div className="page-intro tight"><div><span className="eyebrow dark">ORDER TRACKING</span><h1>Good food is on the move.</h1><p>Order #{order.id} · {order.area} · {deliveryLabel}</p></div>{order.status !== 'delivered' && order.status !== 'cancelled' ? <form action={cancelOrder}><input type="hidden" name="orderId" value={order.id} /><button className="button button-ghost">Cancel order</button></form> : null}</div><div className="order-detail-grid"><OrderStatus orderId={order.id} initialOrder={order} /><aside className="panel-card"><span className="eyebrow dark">ORDER SUMMARY</span><h2>{order.items.length} dishes</h2><div className="cart-list small">{order.items.map(item=><div className="cart-item" key={item.dishId}><div><strong>{item.quantity}× {item.name}</strong><span>ETB {item.price*item.quantity}</span></div></div>)}</div><div className="summary"><div><span>Subtotal</span><strong>ETB {subtotal}</strong></div><div><span>{deliveryLabel}</span><strong>ETB {deliveryFee}</strong></div><div className="total-row"><span>Total</span><strong>ETB {order.status === 'cancelled' ? 0 : subtotal+deliveryFee}</strong></div></div></aside></div></section>;
}
