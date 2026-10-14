'use client';

import { useRef, useState } from 'react';
import { cancelOrder } from '@/app/actions/orders';

export default function CancelOrderForm({ orderId }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    inFlight.current = true;
    setPending(true);
    setError('');
    try {
      const formData = new FormData();
      formData.set('orderId', orderId);
      await cancelOrder(formData);
    } catch {
      setError('We could not cancel this order. Refresh the page and check its latest status.');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return <div className="ae-cancel-order-wrap"><form onSubmit={handleSubmit} aria-busy={pending}><button className="button button-ghost" type="submit" disabled={pending}>{pending ? 'Cancelling…' : 'Cancel order'}</button></form>{error ? <p className="field-error" role="alert">{error}</p> : null}</div>;
}
