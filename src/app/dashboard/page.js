import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAllOrders } from '@/lib/data';
import { getSession } from '@/lib/session';
import RevenueChart from './RevenueChart';
import DashboardLoading from './loading';
import { etb, when } from '@/lib/format';

export const metadata = {
  title: 'Operations dashboard',
  description: 'Staff-only Addis Eats revenue and order activity dashboard.',
  robots: { index: false, follow: false }
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function toUtcDay(key) {
  return new Date(`${key}T00:00:00.000Z`);
}

function addDays(key, count) {
  const day = toUtcDay(key);
  day.setUTCDate(day.getUTCDate() + count);
  return day.toISOString().slice(0, 10);
}

function orderSubtotal(order) {
  return (Array.isArray(order.items) ? order.items : []).reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
}

function orderGross(order) {
  const fallbackDeliveryFee = 60;
  const deliveryFee = Number.isFinite(Number(order.deliveryFee))
    ? Number(order.deliveryFee)
    : fallbackDeliveryFee;
  return orderSubtotal(order) + deliveryFee;
}

function summarizeDashboard(orders) {
  // Cancelled orders are excluded from operational totals and revenue.
  const activeOrders = orders.filter((order) => order.status !== 'cancelled');
  const revenueByArea = new Map();
  for (const order of activeOrders) {
    const area = String(order.area || 'Area not specified').trim() || 'Area not specified';
    const current = revenueByArea.get(area) || { area, revenue: 0, orders: 0 };
    current.revenue += orderGross(order);
    current.orders += 1;
    revenueByArea.set(area, current);
  }

  // Keep a useful 7-day sample window when the included seed data is older
  // than a week; otherwise use the current UTC calendar day as the endpoint.
  const todayKey = new Date().toISOString().slice(0, 10);
  const orderDays = activeOrders.map((order) => dateKey(order.createdAt)).filter(Boolean).sort();
  let endKey = todayKey;
  if (orderDays.length) {
    const latestKey = orderDays[orderDays.length - 1];
    if ((toUtcDay(todayKey).getTime() - toUtcDay(latestKey).getTime()) / DAY_MS > 6) {
      endKey = latestKey;
    }
  }
  const startKey = addDays(endKey, -6);
  const countsByDay = new Map();
  for (const order of activeOrders) {
    const key = dateKey(order.createdAt);
    if (!key || key < startKey || key > endKey) continue;
    countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
  }
  const ordersByDay = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(startKey, index);
    return { date, orders: countsByDay.get(date) || 0 };
  });
  const totalRevenue = activeOrders.reduce((sum, order) => sum + orderGross(order), 0);
  const inProgress = activeOrders.filter((order) => ['preparing', 'out-for-delivery'].includes(order.status)).length;

  return {
    revenueByArea: [...revenueByArea.values()].sort((a, b) => b.revenue - a.revenue || a.area.localeCompare(b.area)),
    ordersByDay,
    range: { start: startKey, end: endKey },
    stats: {
      totalRevenue,
      totalOrders: activeOrders.length,
      inProgress,
      areasServed: revenueByArea.size
    }
  };
}

function formatDateRange(range) {
  const start = when(`${range.start}T00:00:00.000Z`, 'date');
  const end = when(`${range.end}T00:00:00.000Z`, 'date');
  return `${start} – ${end}`;
}

export default async function DashboardPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect('/signin?next=/dashboard');
  if (session.role !== 'staff') redirect('/');

  const query = await searchParams;
  const demoState = typeof query?.demo === 'string' ? query.demo : '';
  if (demoState === 'error') throw new Error('Demonstration error requested by staff.');
  if (demoState === 'loading') return <DashboardLoading />;

  const sourceOrders = demoState === 'empty' ? [] : getAllOrders();
  const summary = summarizeDashboard(sourceOrders);

  return (
    <section className="section container page-top ops-dashboard">
      <div className="ops-dashboard-top">
        <div className="ops-dashboard-intro">
          <span className="eyebrow dark">ADDIS EATS · OPERATIONS</span>
          <h1>Dashboard<span aria-hidden="true">.</span></h1>
          <p>Good service starts with a clear view of today’s orders and where they are coming from.</p>
          <div className="ops-dashboard-meta"><span className="ops-status-dot" aria-hidden="true" /> Staff workspace <span aria-hidden="true">·</span> Signed in as {session.name}</div>
        </div>
        <div className="ops-dashboard-actions">
          <Link className="button button-dark" href="/kitchen">Open service board <span aria-hidden="true">↗</span></Link>
          <Link className="button button-ghost" href="/admin/menu">Manage menu</Link>
          <Link className="button button-ghost" href="/menu">View menu</Link>
        </div>
      </div>

      <div className="ops-stat-grid" aria-label="Order business summary">
        <article className="ops-stat-card"><div className="ops-stat-label"><span>Gross order value</span><span className="ops-stat-icon" aria-hidden="true">ETB</span></div><strong>{etb(summary.stats.totalRevenue)}</strong><small>Includes items and delivery fees; cancelled orders excluded.</small></article>
        <article className="ops-stat-card"><div className="ops-stat-label"><span>Active orders</span><span className="ops-stat-icon" aria-hidden="true">#</span></div><strong>{summary.stats.totalOrders}</strong><small>Orders excluding cancelled orders.</small></article>
        <article className="ops-stat-card"><div className="ops-stat-label"><span>In progress</span><span className="ops-stat-icon" aria-hidden="true">↗</span></div><strong>{summary.stats.inProgress}</strong><small>Preparing or out for delivery.</small></article>
        <article className="ops-stat-card"><div className="ops-stat-label"><span>Neighbourhoods</span><span className="ops-stat-icon" aria-hidden="true">⌖</span></div><strong>{summary.stats.areasServed}</strong><small>Areas with active orders in this data set.</small></article>
      </div>

      <div className="ops-dashboard-section-head">
        <div><span className="eyebrow dark">PERFORMANCE</span><h2>Orders at a glance</h2></div>
        <span className="ops-range-chip">Order activity range: {formatDateRange(summary.range)}</span>
      </div>
      <p className="ops-data-note">Revenue is calculated on the server from item totals plus delivery fees. Charts receive only aggregated rows, not individual customer orders. Cancelled orders are excluded.</p>
      <RevenueChart revenueByArea={summary.revenueByArea} ordersByDay={summary.ordersByDay} range={summary.range} hasOrders={summary.stats.totalOrders > 0} />

      <div className="ops-bottom-strip">
        <div><strong>Want to update an order?</strong><span>Manage incoming tickets and advance delivery status on the staff board.</span></div>
        <Link className="button button-primary" href="/kitchen">Manage orders <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
