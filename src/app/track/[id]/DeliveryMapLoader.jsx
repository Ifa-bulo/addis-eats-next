'use client';

import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
  loading: () => <div className="ae-delivery-map-placeholder" style={{ height: 360 }} aria-label="Loading delivery map"><span className="ae-map-placeholder-pulse" aria-hidden="true" /><strong>Loading delivery map…</strong><small>The map area is reserved to prevent layout shift.</small></div>,
});

export default function DeliveryMapLoader(props) {
  return <DeliveryMap {...props} />;
}
