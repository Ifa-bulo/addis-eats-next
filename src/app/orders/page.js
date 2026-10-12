import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrdersFor } from '@/lib/data';
import { getSession } from '@/lib/session';
import LogoutButton from '@/components/logout-button';

export const metadata = { title: 'My Orders', description: 'Private order history for the signed-in customer.', robots: { index: false, follow: false } };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/signin?next=/orders');
  const orders = getOrdersFor(session.id);
  return <section className="section container page-top"><div className="account-head"><div><span className="eyebrow dark">YOUR ACCOUNT</span><h1>Hey, {session.name.split(' ')[0]} 👋</h1><p>Your history is private and scoped to your session.</p></div><LogoutButton /></div><div className="orders-list">{orders.length ? orders.map((order)=><Link href={`/orders/${order.id}`} className="order-row" key={order.id}><div className="order-icon">🍽️</div><div><strong>#{order.id}</strong><span>{order.items.reduce((sum,item)=>sum+item.quantity,0)} items · {new Date(order.createdAt).toLocaleDateString()}</span></div><span className={`order-badge ${order.status}`}>{order.status.replaceAll('-', ' ')}</span><span className="arrow">→</span></Link>) : <div className="empty-state"><div>🧾</div><h3>No orders yet.</h3><p>Your next meal is only a few clicks away.</p><Link href="/menu" className="button button-primary">Browse menu</Link></div>}</div></section>;
}
