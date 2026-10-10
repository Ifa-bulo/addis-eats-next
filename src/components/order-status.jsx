'use client';

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Unable to load order');
    return res.json();
  });

const steps = [
  ['received', 'Order received', 'We have your order.'],
  ['preparing', 'Preparing', 'The kitchen is cooking.'],
  ['out-for-delivery', 'On the way', 'Your rider is heading over.'],
  ['delivered', 'Delivered', 'Enjoy your meal!'],
];

export default function OrderStatus({ orderId, initialOrder }) {
  const {
    data: order,
    error,
    isValidating,
  } = useSWR(`/api/orders/${orderId}`, fetcher, {
    refreshInterval: 5000,
    fallbackData: initialOrder,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  if (order?.status === 'cancelled') {
    return (
      <div className="status-card" role="status">
        <div className="status-head">
          <div>
            <span className="eyebrow dark">ORDER STATUS</span>
            <h2>#{order.id}</h2>
          </div>
          <span className="order-badge cancelled">Cancelled</span>
        </div>
        <div className="empty-state compact">
          <div>↶</div>
          <h3>This order was cancelled.</h3>
          <p>If this was a mistake, browse the menu to create a new order.</p>
        </div>
        <p className="poll-note">
          The order record remains in your history for reference.
        </p>
      </div>
    );
  }

  const statusIndex = Math.max(
    0,
    steps.findIndex(([value]) => value === order?.status)
  );

  return (
    <div className="status-card">
      <div className="status-head">
        <div>
          <span className="eyebrow dark">LIVE ORDER STATUS</span>
          <h2>#{order?.id}</h2>
        </div>
        <span className="live-chip">● {isValidating ? 'syncing' : 'live'}</span>
      </div>

      {error ? (
        <div className="inline-alert" role="status">
          Could not refresh right now. Your last known status is still shown.
        </div>
      ) : null}

      <div className="timeline">
        {steps.map(([value, title, text], index) => (
          <div
            className={`timeline-step ${index <= statusIndex ? 'done' : ''}`}
            key={value}
          >
            <span className="timeline-dot">
              {index < statusIndex ? '✓' : index === statusIndex ? '●' : ''}
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="poll-note">
        Status refreshes automatically every 5 seconds. No manual reload needed.
      </p>
    </div>
  );
}