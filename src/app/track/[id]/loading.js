export default function TrackingLoading() {
  return (
    <section className="section container page-top ae-track-page" aria-busy="true" aria-label="Loading delivery tracking">
      <div className="ae-track-page-heading"><div><span className="eyebrow dark">ADDIS EATS · DELIVERY TRACKING</span><h1>Loading your delivery…</h1><p>Getting the latest order status and delivery details.</p></div></div>
      <div className="ae-track-layout"><div className="ae-track-live-panel"><div className="ae-track-map-and-text"><div className="ae-track-map-card"><div className="ae-delivery-map-placeholder" style={{ height: 360 }}><strong>Loading delivery map…</strong></div></div><div className="ae-track-text-card"><span className="ops-skeleton ops-skeleton-line" /><span className="ops-skeleton ops-skeleton-line wide" /><span className="ops-skeleton ops-skeleton-line wide" /></div></div></div><aside className="panel-card ae-track-order-summary"><span className="ops-skeleton ops-skeleton-line" /><div className="ops-skeleton ops-skeleton-value" /><div className="ops-skeleton ops-skeleton-chart" /></aside></div>
    </section>
  );
}
