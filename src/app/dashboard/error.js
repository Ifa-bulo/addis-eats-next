'use client';

import Link from 'next/link';

export default function DashboardError({ reset }) {
  return (
    <section className="section container page-top">
      <div className="ops-state-card ops-error-state" role="alert">
        <span className="ops-state-symbol" aria-hidden="true">!</span>
        <span className="eyebrow dark">DASHBOARD UNAVAILABLE</span>
        <h1>We couldn’t load the dashboard.</h1>
        <p>Your order records have not been changed. Try loading the dashboard again.</p>
        <div className="ops-error-actions"><button className="button button-dark" onClick={() => reset()}>Try again</button><Link className="button button-ghost" href="/dashboard">Exit demo state</Link></div>
      </div>
    </section>
  );
}
