'use client';

import { useActionState } from 'react';
import { setOrderStatus } from '@/app/actions/orders';

const initialState = { error: '' };
const nextStatus = {
  received: 'preparing',
  preparing: 'out-for-delivery',
  'out-for-delivery': 'delivered',
};

function StatusForm({ order }) {
  const [state, action] = useActionState(setOrderStatus, initialState);

  return (
    <form action={action} className="kitchen-status-form">
      <input type="hidden" name="orderId" value={order.id} />
      <select
        name="status"
        defaultValue={nextStatus[order.status] ?? 'received'}
        disabled={order.status === 'cancelled'}
      >
        <option value="received">Received</option>
        <option value="preparing">Preparing</option>
        <option value="out-for-delivery">On the way</option>
        <option value="delivered">Delivered</option>
      </select>
      <button
        className="button button-dark"
        disabled={order.status === 'delivered' || order.status === 'cancelled'}
      >
        {order.status === 'delivered'
          ? 'Complete'
          : order.status === 'cancelled'
          ? 'Cancelled'
          : 'Update'}
      </button>
      {state.error && <small className="field-error">{state.error}</small>}
    </form>
  );
}

export default function KitchenBoard({ orders }) {
  return (
    <div className="kitchen-grid">
      {orders.map((order) => (
        <article className="kitchen-card" key={order.id}>
          <div className="kitchen-card-head">
            <span>#{order.id}</span>
            <span className={`order-badge ${order.status}`}>
              {order.status.replaceAll('-', ' ')}
            </span>
          </div>
          <h3>{order.customerName}</h3>
          <p>
            {order.area} · {order.phone}
          </p>
          <div className="kitchen-items">
            {order.items.map((item) => (
              <div key={item.dishId}>
                {item.quantity}× {item.name}
                <span>ETB {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <StatusForm order={order} />
        </article>
      ))}
    </div>
  );
}