'use client';

export default function TrackingError({ reset }) {
  return (
    <section className="section container page-top ae-track-page">
      <div className="ops-state-card ops-error-state">
        <span className="ops-state-symbol" aria-hidden="true">!</span>
        <span className="eyebrow dark">DELIVERY TRACKING</span>
        <h1>Tracking is temporarily unavailable.</h1>
        <p>Your order is not changed. Try loading its status again.</p>
        <button className="button button-primary" onClick={() => reset()}>Try again</button>
      </div>
    </section>
  );
}
