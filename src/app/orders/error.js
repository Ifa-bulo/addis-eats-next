'use client';

import Link from 'next/link';

export default function OrdersError({ reset }) {
  return (
    <section className="section container page-top">
      <div className="ops-state-card ops-error-state" role="alert">
        <span className="ops-state-symbol" aria-hidden="true">!</span>
        <span className="eyebrow dark">ORDER HISTORY UNAVAILABLE</span>
        <h1>We couldn’t load your orders.</h1>
        <p>Your account and orders have not been changed. Try again in a moment.</p>
        <div className="ops-error-actions"><button className="button button-dark" onClick={() => reset()}>Try again</button><Link className="button button-ghost" href="/orders">Exit demo state</Link></div>
      </div>
    </section>
  );
}
