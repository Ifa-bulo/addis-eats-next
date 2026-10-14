export default function OrdersLoading() {
  return (
    <section className="section container page-top ops-orders-page" aria-busy="true" aria-live="polite">
      <span className="eyebrow dark">YOUR ACCOUNT</span>
      <h1 className="ops-loading-title"><span className="ops-skeleton ops-skeleton-title" /></h1>
      <p className="ops-skeleton ops-skeleton-line wide" />
      <div className="ops-order-table-wrap ops-table-loading">
        <div className="ops-table-toolbar"><span className="ops-skeleton ops-skeleton-line wide" /><span className="ops-skeleton ops-skeleton-line" /></div>
        <div className="ops-table-scroll"><table className="ops-orders-table" aria-label="Loading order history"><thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Delivery area</th><th scope="col">Status</th><th scope="col">Total (ETB)</th><th scope="col">Details</th></tr></thead><tbody>{Array.from({ length: 5 }, (_, index) => <tr key={index}><td><span className="ops-skeleton ops-skeleton-line" /></td><td><span className="ops-skeleton ops-skeleton-line" /></td><td><span className="ops-skeleton ops-skeleton-line" /></td><td><span className="ops-skeleton ops-skeleton-line" /></td><td><span className="ops-skeleton ops-skeleton-line" /></td><td><span className="ops-skeleton ops-skeleton-line" /></td></tr>)}</tbody></table></div>
      </div>
      <p className="sr-only">Loading order history…</p>
    </section>
  );
}
