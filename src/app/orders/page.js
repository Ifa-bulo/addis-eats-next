import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOrdersFor } from '@/lib/data';
import { getSession } from '@/lib/session';
import LogoutButton from '@/components/logout-button';
import OrderTable from './OrderTable';
import OrdersLoading from './loading';
import ExportOrdersButton from '@/components/ExportOrdersButton';

const DEMO_AREAS = ['Bole', 'Kazanchis', 'Piassa', 'Lideta', 'Mexico', 'Saris', 'CMC', 'Gerji', 'Megenagna'];
const DEMO_STATUSES = ['received', 'preparing', 'out-for-delivery', 'delivered'];

function createPaginationDemoOrders(userId) {
  const now = Date.now();
  return Array.from({ length: 27 }, (_, index) => ({
    id: `ord_page_demo_${String(index + 1).padStart(2, '0')}`,
    userId,
    customerName: 'Pagination demo customer',
    phone: '0900000000',
    area: DEMO_AREAS[index % DEMO_AREAS.length],
    status: DEMO_STATUSES[index % DEMO_STATUSES.length],
    createdAt: new Date(now - index * 3 * 60 * 60 * 1000).toISOString(),
    deliveryFee: index % 3 === 0 ? 100 : 60,
    items: [{ dishId: 'demo-dish', name: 'Demo dish', price: 160 + ((index * 53) % 440), quantity: 1 + (index % 3) }]
  }));
}

export const metadata = {
  title: 'My Orders',
  description: 'Private order history for the signed-in customer.',
  robots: { index: false, follow: false }
};

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect('/signin?next=/orders');

  const query = await searchParams;
  const demoState = typeof query?.demo === 'string' ? query.demo : '';
  if (demoState === 'error') throw new Error('Demonstration order history error requested by user.');
  if (demoState === 'loading') return <OrdersLoading />;

  // Customer order history must stay scoped to the authenticated account.
  const demoMode = demoState === 'pages';
  const orders = demoState === 'empty' ? [] : demoMode ? createPaginationDemoOrders(session.id) : getOrdersFor(session.id);
  const firstName = String(session.name || 'there').trim().split(/\s+/)[0];
  const exportRows = orders.map((order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    const fee = Number.isFinite(Number(order.deliveryFee)) ? Number(order.deliveryFee) : 60;
    return [order.id, order.createdAt || '', order.status || '', order.area || '', order.deliveryAddress || '', items.map((item) => `${item.quantity}x ${item.name}`).join('; '), subtotal, fee, subtotal + fee];
  });

  return (
    <section className="section container page-top ops-orders-page">
      <div className="ops-orders-heading">
        <div><span className="eyebrow dark">YOUR ACCOUNT</span><h1>My orders<span aria-hidden="true">.</span></h1><p>Hi {firstName}, your order history and delivery details are all in one place.</p></div>
        <div className="ops-orders-heading-actions">{!demoMode && orders.length > 0 ? <ExportOrdersButton rows={exportRows} /> : null}<Link className="button button-ghost" href="/menu">Browse menu</Link><LogoutButton /></div>
      </div>
      <OrderTable orders={orders} searchParams={query} demoMode={demoMode} />
    </section>
  );
}
