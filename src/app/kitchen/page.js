import { getAllOrders } from '@/lib/data';
import { requireStaff } from '@/lib/session';
import KitchenBoard from '@/components/kitchen-board';
import LogoutButton from '@/components/logout-button';

export const metadata = { title: 'Kitchen', description: 'Staff-only order management board.', robots: { index: false, follow: false } };

export default async function KitchenPage() { const session = await requireStaff(); const orders = getAllOrders(); return <section className="section container page-top"><div className="account-head"><div><span className="eyebrow dark">STAFF KITCHEN</span><h1>Service board.</h1><p>Signed in as {session.name}. Status writes are checked again inside each action.</p></div><LogoutButton /></div><KitchenBoard orders={orders} /></section>; }
