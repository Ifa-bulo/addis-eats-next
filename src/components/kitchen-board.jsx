'use client';

import { useRef, useState } from 'react';
import { setOrderStatus } from '@/app/actions/orders';
import { etb } from '@/lib/format';

const nextStatus = { received: 'preparing', preparing: 'out-for-delivery', 'out-for-delivery': 'delivered' };

function StatusForm({ order }) {
  const [state, setState] = useState({ error: '' });
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const selectId = `status-${order.id}`;

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current || order.status === 'delivered') return;
    inFlight.current = true;
    setPending(true);
    setState({ error: '' });
    try {
      const result = await setOrderStatus(null, new FormData(event.currentTarget));
      setState(result || { error: '' });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="kitchen-status-form" aria-busy={pending}>
      <input type="hidden" name="orderId" value={order.id} />
      <label className="sr-only" htmlFor={selectId}>Set status for order {order.id}</label>
      <select id={selectId} name="status" defaultValue={nextStatus[order.status] ?? 'received'} disabled={pending || order.status === 'delivered'}>
        <option value="received">Received</option><option value="preparing">Preparing</option><option value="out-for-delivery">On the way</option><option value="delivered">Delivered</option>
      </select>
      <button type="submit" className="button button-dark" disabled={pending || order.status === 'delivered'}>{pending ? 'Updating…' : order.status === 'delivered' ? 'Complete' : 'Update'}</button>
      {state.error && <small className="field-error" role="alert">{state.error}</small>}
      {pending && <span className="sr-only" role="status">Updating order status.</span>}
    </form>
  );
}

export default function KitchenBoard({ orders }) {
  return <div className="kitchen-grid">{orders.map((order)=><article className="kitchen-card" key={order.id}><div className="kitchen-card-head"><span>#{order.id}</span><span className={`order-badge ${order.status}`}>{order.status.replaceAll('-', ' ')}</span></div><h3>{order.customerName}</h3><p>{order.area} · {order.phone}</p><div className="kitchen-items">{order.items.map((item)=><div key={item.dishId}>{item.quantity}× {item.name}<span>{etb(item.price * item.quantity)}</span></div>)}</div><StatusForm order={order} /></article>)}</div>;
}
