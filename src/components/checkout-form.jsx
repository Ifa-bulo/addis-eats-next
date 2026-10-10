'use client';

import { useActionState, useEffect, useState } from 'react';
import { placeOrder } from '@/app/actions/orders';
import { useCart } from './cart-provider';

const initialState = { error: '', fieldErrors: {} };

export default function CheckoutForm({ customerName = '' }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [state, action] = useActionState(placeOrder, initialState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state?.success && !submitted) {
      clearCart();
      setSubmitted(true);
    }
  }, [state?.success, submitted, clearCart]);

  if (submitted) {
    return (
      <div className="success-box">
        <div className="success-icon">✓</div>
        <span className="eyebrow dark">ORDER CONFIRMED</span>
        <h2>Your food is on the way.</h2>
        <p>
          Order <strong>#{state.orderId}</strong> has been received. Track it live
          from your order page.
        </p>
        <a className="button button-primary" href={`/orders/${state.orderId}`}>
          Track order →
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="checkout-grid">
      <div>
        <div className="panel-card">
          <div className="panel-head">
            <div>
              <span className="eyebrow dark">YOUR ORDER</span>
              <h2>Build your meal.</h2>
            </div>
            <span>{items.length} item types</span>
          </div>

          {!items.length ? (
            <div className="empty-state compact">
              <div>🛒</div>
              <h3>Your cart is empty.</h3>
              <p>Add a dish from the menu to continue.</p>
              <a href="/menu" className="button button-primary">
                Browse menu
              </a>
            </div>
          ) : (
            <div className="cart-list">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-thumb">{item.name.slice(0, 1)}</div>
                  <div className="cart-info">
                    <strong>{item.name}</strong>
                    <span>ETB {item.price}</span>
                  </div>
                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="checkout-side">
        <div className="panel-card">
          <span className="eyebrow dark">DELIVERY DETAILS</span>
          <h2>Where should we bring it?</h2>

          <label>
            Name
            <input
              name="customerName"
              placeholder="Your full name"
              defaultValue={customerName}
            />
          </label>
          {state.fieldErrors?.customerName && (
            <small className="field-error">{state.fieldErrors.customerName}</small>
          )}

          <label>
            Phone
            <input name="phone" placeholder="09xxxxxxxx" />
          </label>
          {state.fieldErrors?.phone && (
            <small className="field-error">{state.fieldErrors.phone}</small>
          )}

          <label>
            Area
            <input name="area" placeholder="Bole, Kazanchis, CMC..." />
          </label>
          {state.fieldErrors?.area && (
            <small className="field-error">{state.fieldErrors.area}</small>
          )}

          <input type="hidden" name="items" value={JSON.stringify(items)} />

          {state.error && <div className="inline-alert">{state.error}</div>}

          <div className="summary">
            <div>
              <span>Subtotal</span>
              <strong>ETB {total}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>ETB {items.length ? 60 : 0}</strong>
            </div>
            <div className="total-row">
              <span>Total</span>
              <strong>ETB {items.length ? total + 60 : 0}</strong>
            </div>
          </div>

          <button
            className="button button-primary wide"
            disabled={!items.length}
          >
            Place order →
          </button>
        </div>
      </aside>
    </form>
  );
}