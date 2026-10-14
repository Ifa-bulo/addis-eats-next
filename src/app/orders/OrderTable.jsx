import Link from 'next/link';
import { etb, when } from '@/lib/format';

const PAGE_SIZE = 10;
const ALLOWED_SORTS = new Set(['date', 'total', 'status', 'id', 'area']);

function totalFor(order) {
  const subtotal = (Array.isArray(order.items) ? order.items : []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const fee = Number.isFinite(Number(order.deliveryFee)) ? Number(order.deliveryFee) : 60;
  return subtotal + fee;
}

function orderDate(order) {
  const value = new Date(order.createdAt).getTime();
  return Number.isNaN(value) ? 0 : value;
}

function sortOrders(orders, sort, direction) {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...orders].sort((a, b) => {
    let comparison = 0;
    if (sort === 'total') comparison = totalFor(a) - totalFor(b);
    else if (sort === 'status') comparison = String(a.status).localeCompare(String(b.status));
    else if (sort === 'id') comparison = String(a.id).localeCompare(String(b.id));
    else if (sort === 'area') comparison = String(a.area || '').localeCompare(String(b.area || ''));
    else comparison = orderDate(a) - orderDate(b);
    return (comparison * multiplier) || String(a.id).localeCompare(String(b.id));
  });
}

function queryHref({ sort, direction, page, demoMode = false }) {
  const params = new URLSearchParams();
  if (demoMode) params.set('demo', 'pages');
  params.set('sort', sort);
  params.set('dir', direction);
  params.set('page', String(page));
  return `/orders?${params.toString()}`;
}

function SortHeading({ label, field, sort, direction, demoMode }) {
  const isCurrent = sort === field;
  const nextDirection = isCurrent && direction === 'asc' ? 'desc' : 'asc';
  const ariaSort = isCurrent ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';
  return <th scope="col" aria-sort={ariaSort}><Link className="ops-sort-link" href={queryHref({ sort: field, direction: nextDirection, page: 1, demoMode })}>{label}<span aria-hidden="true">{isCurrent ? (direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span></Link></th>;
}

export default function OrderTable({ orders, searchParams, demoEmpty = false, demoMode = false }) {
  const params = searchParams || {};
  const sort = ALLOWED_SORTS.has(params.sort) ? params.sort : 'date';
  const direction = params.dir === 'asc' ? 'asc' : 'desc';
  const requestedPage = Number.parseInt(params.page || '1', 10);
  const safePage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const visibleOrders = demoEmpty ? [] : sortOrders(orders, sort, direction);
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
  const currentPage = Math.min(safePage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageOrders = visibleOrders.slice(startIndex, startIndex + PAGE_SIZE);
  const hasOrders = visibleOrders.length > 0;

  return (
    <div className="ops-order-table-wrap">
      {demoMode && <div className="ops-demo-note" role="note"><strong>Pagination demo data</strong><span>These 27 sample rows are generated for testing sorting and page links only. They are not saved as real customer orders.</span></div>}
      <div className="ops-table-toolbar">
        <div><h2>Order history</h2><p>Only orders placed by your signed-in account are shown.</p></div>
        {hasOrders && <span className="ops-result-count">Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, visibleOrders.length)} of {visibleOrders.length}</span>}
      </div>
      {!hasOrders ? (
        <div className="ops-state-card ops-empty-state">
          <span className="ops-state-symbol" aria-hidden="true">▤</span>
          <span className="eyebrow dark">YOUR ORDER HISTORY</span>
          <h2>No orders yet</h2>
          <p>Your first order will appear here. Discover a favourite dish and we’ll keep its status and total together in your history.</p>
          <Link className="button button-primary" href="/menu">Browse the menu <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <>
          <div className="ops-table-scroll">
            <table className="ops-orders-table">
              <caption>Your Addis Eats order history. Use the column headings to change sorting.</caption>
              <thead><tr><th scope="col">Order</th><SortHeading label="Date" field="date" sort={sort} direction={direction} demoMode={demoMode} /><SortHeading label="Delivery area" field="area" sort={sort} direction={direction} demoMode={demoMode} /><SortHeading label="Status" field="status" sort={sort} direction={direction} demoMode={demoMode} /><SortHeading label="Total (ETB)" field="total" sort={sort} direction={direction} demoMode={demoMode} /><th scope="col">Details</th></tr></thead>
              <tbody>{pageOrders.map((order) => <tr key={order.id}><th scope="row"><span className="ops-order-id">#{order.id}</span><span className="ops-order-item-count">{(order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} items</span></th><td><time dateTime={order.createdAt}>{when(order.createdAt, 'date')}</time></td><td>{order.area || 'Not specified'}</td><td><span className={`order-badge ${String(order.status).replace(/[^a-z-]/g, '')}`}>{String(order.status).replaceAll('-', ' ')}</span></td><td className="num-cell"><strong>{etb(totalFor(order))}</strong></td><td>{demoMode ? <span className="ops-demo-row-label">Sample row</span> : <Link className="ops-details-link" href={`/track/${encodeURIComponent(order.id)}`}>Track delivery <span aria-hidden="true">↗</span></Link>}</td></tr>)}</tbody>
            </table>
          </div>
          <nav className="ops-pagination" aria-label="Order history pages">
            <span>Page {currentPage} of {totalPages}</span>
            <div>
              <Link aria-disabled={currentPage <= 1} className={`ops-page-link ${currentPage <= 1 ? 'disabled' : ''}`} href={queryHref({ sort, direction, page: Math.max(1, currentPage - 1), demoMode })} tabIndex={currentPage <= 1 ? -1 : undefined}>← Previous</Link>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link key={page} aria-current={page === currentPage ? 'page' : undefined} className={`ops-page-link ${page === currentPage ? 'active' : ''}`} href={queryHref({ sort, direction, page, demoMode })}>{page}</Link>)}
              <Link aria-disabled={currentPage >= totalPages} className={`ops-page-link ${currentPage >= totalPages ? 'disabled' : ''}`} href={queryHref({ sort, direction, page: Math.min(totalPages, currentPage + 1), demoMode })} tabIndex={currentPage >= totalPages ? -1 : undefined}>Next →</Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
