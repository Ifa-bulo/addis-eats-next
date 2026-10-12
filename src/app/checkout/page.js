import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout-form';

export const metadata = { title: 'Checkout', description: 'Secure Addis Eats checkout for signed-in customers.', robots: { index: false, follow: false } };

export default async function CheckoutPage() { const session = await getSession(); if (!session) redirect('/signin?next=/checkout'); return <section className="section container page-top"><div className="page-intro tight"><div><span className="eyebrow dark">SECURE CHECKOUT</span><h1>One last step.</h1><p>Signed in as {session.email}. Your order write re-checks the session and item data.</p></div></div><CheckoutForm customerName={session.name} /></section>; }
