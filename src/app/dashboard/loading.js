export default function DashboardLoading() {
  return (
    <section className="section container page-top ops-dashboard" aria-busy="true" aria-live="polite">
      <span className="eyebrow dark">ADDIS EATS · OPERATIONS</span>
      <h1 className="ops-loading-title"><span className="ops-skeleton ops-skeleton-title" /></h1>
      <div className="ops-stat-grid">
        {Array.from({ length: 4 }, (_, index) => <div className="ops-stat-card" key={index}><span className="ops-skeleton ops-skeleton-line" /><span className="ops-skeleton ops-skeleton-value" /><span className="ops-skeleton ops-skeleton-line wide" /></div>)}
      </div>
      <div className="ops-charts-grid">{[0, 1].map((item) => <div className="ops-chart-card ops-loading-chart" key={item}><span className="ops-skeleton ops-skeleton-line" /><span className="ops-skeleton ops-skeleton-line wide" /><span className="ops-skeleton ops-skeleton-chart" /><span className="ops-skeleton ops-skeleton-line wide" /></div>)}</div>
      <p className="sr-only">Loading dashboard summaries…</p>
    </section>
  );
}
