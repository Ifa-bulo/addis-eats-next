'use client';

import { useActionState, useEffect, useState } from 'react';
import { placeOrder } from '@/app/actions/orders';
import { useCart } from './cart-provider';
import { DELIVERY_AREAS, DELIVERY_OPTIONS } from '@/lib/delivery';

const initialState = { error: '', fieldErrors: {} };

export default function CheckoutForm({ customerName = '' }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [state, action] = useActionState(placeOrder, initialState);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const deliveryChoice = DELIVERY_OPTIONS[deliveryOption] || DELIVERY_OPTIONS.standard;

  useEffect(() => {
    if (state?.success && !submitted) {
      clearCart();
      setSubmitted(true);
    }
  }, [state?.success, submitted, clearCart]);

  if (submitted) {
    return <div className="success-box"><div className="success-icon">✓</div><span className="eyebrow dark">ORDER CONFIRMED</span><h2>Your food is on the way.</h2><p>Order <strong>#{state.orderId}</strong> has been received. Track it live from your order page.</p><a className="button button-primary" href={`/orders/${state.orderId}`}>Track order →</a></div>;
  }

  return <form action={action} className="checkout-grid">
    <div className="qe-checkout-main-column">
      <div className="panel-card">
        <div className="panel-head"><div><span className="eyebrow dark">YOUR ORDER</span><h2>Build your meal.</h2></div><span>{items.length} item types</span></div>
        {!items.length ? <div className="empty-state compact"><div>🛒</div><h3>Your cart is empty.</h3><p>Add a dish from the menu to continue.</p><a href="/menu" className="button button-primary">Browse menu</a></div> : <div className="cart-list">{items.map((item) => <div className="cart-item" key={item.id}><div className="cart-thumb">{item.name.slice(0,1)}</div><div className="cart-info"><strong>{item.name}</strong><span>ETB {item.price}</span></div><div className="quantity"><button type="button" onClick={() => updateQuantity(item.id,item.quantity-1)} aria-label={`Decrease ${item.name} quantity`}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id,item.quantity+1)} aria-label={`Increase ${item.name} quantity`}>+</button></div><button type="button" className="remove-link" onClick={() => removeItem(item.id)}>Remove</button></div>)}</div>}
      </div>

      <section className="panel-card qe-delivery-choice" aria-labelledby="delivery-options-title">
        <div className="panel-head"><div><span className="eyebrow dark">DELIVERY OPTIONS</span><h2 id="delivery-options-title">Choose your delivery.</h2></div><span aria-hidden="true">🛵</span></div>
        <label className="qe-delivery-area-label" htmlFor="delivery-area">Delivery area</label>
        <select id="delivery-area" name="area" defaultValue="" required aria-describedby="delivery-area-help">
          <option value="" disabled>Select your Addis Ababa area</option>
          {DELIVERY_AREAS.map((area) => <option value={area} key={area}>{area}</option>)}
        </select>
        <p id="delivery-area-help" className="qe-delivery-help">Choose the area where your order should arrive.</p>
        {state.fieldErrors?.area && <small className="field-error">{state.fieldErrors.area}</small>}
        <div className="qe-delivery-methods" role="radiogroup" aria-label="Delivery method">
          {Object.entries(DELIVERY_OPTIONS).map(([value, option]) => (
            <label className={`qe-delivery-method ${deliveryOption === value ? 'selected' : ''}`} key={value}>
              <input type="radio" name="deliveryOption" value={value} checked={deliveryOption === value} onChange={() => setDeliveryOption(value)} />
              <span className="qe-delivery-method-copy"><strong>{option.label}</strong><small>{option.description}</small><em>{option.eta}</em></span>
              <strong className="qe-delivery-method-price">ETB {option.fee}</strong>
            </label>
          ))}
        </div>
        {state.fieldErrors?.deliveryOption && <small className="field-error">{state.fieldErrors.deliveryOption}</small>}
      </section>
    </div>

    <aside className="checkout-side"><div className="panel-card">
      <span className="eyebrow dark">CUSTOMER DETAILS</span><h2>Who are we delivering to?</h2>
      <label>Name<input name="customerName" placeholder="Your full name" defaultValue={customerName} autoComplete="name" required /></label>{state.fieldErrors?.customerName && <small className="field-error">{state.fieldErrors.customerName}</small>}
      <label>Phone<input name="phone" placeholder="09xxxxxxxx" inputMode="tel" autoComplete="tel" required /></label>{state.fieldErrors?.phone && <small className="field-error">{state.fieldErrors.phone}</small>}
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      {state.error && <div className="inline-alert" role="alert">{state.error}</div>}
      <div className="summary"><div><span>Subtotal</span><strong>ETB {total}</strong></div><div><span>{deliveryChoice.label}</span><strong>ETB {items.length ? deliveryChoice.fee : 0}</strong></div><div className="total-row"><span>Total</span><strong>ETB {items.length ? total + deliveryChoice.fee : 0}</strong></div></div>
      <button className="button button-primary wide" disabled={!items.length}>Place order →</button>
    </div></aside>
  </form>;
}
