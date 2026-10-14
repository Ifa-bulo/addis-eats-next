import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDishes } from '@/lib/data';
import { getSession } from '@/lib/session';
import MenuAvailabilityManager from '@/components/menu-availability-manager';

export const metadata = {
  title: 'Manage menu',
  description: 'Staff menu availability controls for Addis Eats.',
  robots: { index: false, follow: false }
};

export default async function AdminMenuPage() {
  const session = await getSession();
  if (!session) redirect('/signin?next=/admin/menu');
  if (session.role !== 'staff') redirect('/');
  const dishes = getDishes().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="section container page-top admin-menu-page">
      <Link href="/dashboard" className="back-link">← Back to dashboard</Link>
      <div className="page-intro admin-menu-intro">
        <div><span className="eyebrow dark">ADDIS EATS · ADMIN</span><h1>Menu availability</h1><p>Enable dishes when you can serve them. Disable a dish temporarily without deleting its details, price, or menu record.</p></div>
        <Link className="button button-dark" href="/menu">Preview customer menu ↗</Link>
      </div>
      <MenuAvailabilityManager dishes={dishes} />
    </section>
  );
}
