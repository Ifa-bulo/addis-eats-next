'use client';

import { useEffect, useRef, useState } from 'react';
import DeliveryMapLoader from './DeliveryMapLoader';
import { relative, when } from '@/lib/format';

const STATUS_LABELS = {
  received: 'Order received',
  preparing: 'Preparing your food',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function DeliveryTrackingClient({ initialSnapshot, initialRelative }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [relativeLabel, setRelativeLabel] = useState(initialRelative);
  const [connection, setConnection] = useState(initialSnapshot.terminal ? 'closed' : 'connecting');
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (snapshot.status === 'delivered' || snapshot.status === 'cancelled') {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setConnection('closed');
      return undefined;
    }

    setConnection('connecting');
    const source = new EventSource(`/api/orders/${encodeURIComponent(snapshot.orderId)}/stream`);
    eventSourceRef.current = source;

    source.onopen = () => setConnection('live');
    source.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        if (!update || update.orderId !== initialSnapshot.orderId) return;
        if (update.error) {
          source.close();
          if (eventSourceRef.current === source) eventSourceRef.current = null;
          setConnection('closed');
          return;
        }
        if (typeof update.status !== 'string' || !update.courierCoordinates || !update.deliveryCoordinates) return;
        setSnapshot(update);
        setRelativeLabel(relative(update.updatedAt));
        if (update.status === 'delivered' || update.status === 'cancelled' || update.terminal) {
          source.close();
          if (eventSourceRef.current === source) eventSourceRef.current = null;
          setConnection('closed');
        }
      } catch {
        // Ignore a malformed packet and leave the last server-seeded state visible.
      }
    };
    source.onerror = () => setConnection(source.readyState === EventSource.CLOSED ? 'closed' : 'reconnecting');

    return () => {
      source.close();
      if (eventSourceRef.current === source) eventSourceRef.current = null;
    };
  // EventSource identity is tied to this order. Stream events update the snapshot without reconnecting.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSnapshot.orderId, initialSnapshot.terminal]);

  const statusLabel = STATUS_LABELS[snapshot.status] || snapshot.status.replaceAll('-', ' ');
  const connectionLabel = connection === 'live'
    ? 'Live connection'
    : connection === 'connecting'
      ? 'Connecting…'
      : connection === 'reconnecting'
        ? 'Reconnecting…'
        : 'Stream closed';

  return (
    <section className="ae-track-live-panel" aria-labelledby="ae-live-status-title">
      <div className="ae-track-status-heading">
        <div>
          <span className="eyebrow dark">LIVE DELIVERY STATUS</span>
          <h2 id="ae-live-status-title">{statusLabel}</h2>
          <p>Latest update {when(snapshot.updatedAt)} · {relativeLabel}</p>
        </div>
        <span className={`ae-stream-indicator ${connection}`} aria-live="polite"><span aria-hidden="true" />{connectionLabel}</span>
      </div>

      {connection === 'reconnecting' && snapshot.status !== 'delivered' && snapshot.status !== 'cancelled' ? (
        <p className="ae-stream-note" role="status">Connection interrupted. The last known delivery status remains visible while the browser reconnects.</p>
      ) : null}
      {snapshot.terminal ? <p className="ae-stream-note" role="status">This delivery is complete or cancelled, so the live connection has been closed.</p> : null}

      <div className="ae-track-map-and-text">
        <section className="ae-track-map-card" aria-labelledby="ae-map-title">
          <div className="ae-track-section-title"><h3 id="ae-map-title">Delivery map</h3><span>Neighbourhood estimate</span></div>
          <DeliveryMapLoader courier={snapshot.courierCoordinates} destination={snapshot.deliveryCoordinates} area={snapshot.area} />
        </section>

        <section className="ae-track-text-card" aria-labelledby="ae-location-details-title">
          <div className="ae-track-section-title"><h3 id="ae-location-details-title">Delivery details</h3><span>Text alternative</span></div>
          <dl className="ae-track-details-list">
            <div><dt>Delivery address</dt><dd>{snapshot.deliveryAddress}</dd></div>
            <div><dt>Neighbourhood</dt><dd>{snapshot.area}</dd></div>
            <div><dt>Courier position</dt><dd>Approximate demo location near {snapshot.area}. Live rider GPS is not connected.</dd></div>
            <div><dt>Delivery method</dt><dd>{snapshot.deliveryOption === 'express' ? 'Express delivery' : 'Standard delivery'}</dd></div>
            <div><dt>Last server update</dt><dd><time dateTime={snapshot.updatedAt}>{when(snapshot.updatedAt)}</time><span className="ae-relative-time">{relativeLabel}</span></dd></div>
          </dl>
          <div className="ae-track-estimate-note"><strong>About this map</strong><p>The destination pin marks the centre of the selected neighbourhood because this project does not yet geocode street addresses or receive GPS from a courier device. Use the address text above for the actual delivery instructions.</p></div>
        </section>
      </div>
    </section>
  );
}
