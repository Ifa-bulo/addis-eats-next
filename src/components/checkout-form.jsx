'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { placeOrder } from '@/app/actions/orders';
import { useCart } from './cart-provider';
import { DELIVERY_AREAS, DELIVERY_OPTIONS } from '@/lib/delivery';
import { etb } from '@/lib/format';

const initialState = { error: '', fieldErrors: {} };

export default function CheckoutForm({ customerName = '' }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [state, setState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [orderKey, setOrderKey] = useState('');
  const submitLock = useRef(false);
  const deliveryChoice = DELIVERY_OPTIONS[deliveryOption] || DELIVERY_OPTIONS.standard;

  useEffect(() => {
    // Generate after hydration so the server and client render the same markup.
    setOrderKey(window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitLock.current || submitting || !items.length || !orderKey) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    submitLock.current = true;
    setSubmitting(true);
    setState(initialState);
    try {
      const formData = new FormData(form);
      formData.set('items', JSON.stringify(items));
      formData.set('orderKey', orderKey);
      const result = await placeOrder(null, formData);
      setState(result || { error: 'The order could not be confirmed. Please retry.', fieldErrors: {} });
      if (result?.success && result.orderId) {
        clearCart();
        setSubmitted(true);
      } else {
        submitLock.current = false;
      }
    } catch {
      setState({ error: 'We could not confirm your order. Please try again. If you were charged by an external provider, check its receipt first.', fieldErrors: {} });
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <div className="success-box" role="status"><div className="success-icon" aria-hidden="true">✓</div><span className="eyebrow dark">ORDER CONFIRMED</span><h2>Your food is on the way.</h2><p>Order <strong>#{state.orderId}</strong> has been received. Track it live from your order page.</p><Link className="button button-primary" href={`/track/${encodeURIComponent(state.orderId)}`}>Track order →</Link></div>;
  }

  return <form onSubmit={handleSubmit} className="checkout-grid" aria-busy={submitting}>
    <div className="qe-checkout-main-column">
      <div className="panel-card">
        <div className="panel-head"><div><span className="eyebrow dark">YOUR ORDER</span><h2>Build your meal.</h2></div><span>{items.length} item types</span></div>
        {!items.length ? <div className="empty-state compact"><div aria-hidden="true">🛒</div><h3>Your cart is empty.</h3><p>Add a dish from the menu to continue.</p><Link href="/menu" className="button button-primary">Browse menu</Link></div> : <div className="cart-list">{items.map((item) => <div className="cart-item" key={item.id}><div className="cart-thumb" aria-hidden="true">{item.name.slice(0,1)}</div><div className="cart-info"><strong>{item.name}</strong><span>{etb(item.price)}</span></div><div className="quantity"><button type="button" onClick={() => updateQuantity(item.id,item.quantity-1)} aria-label={`Decrease ${item.name} quantity`} disabled={submitting}>−</button><span aria-live="polite">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id,item.quantity+1)} aria-label={`Increase ${item.name} quantity`} disabled={submitting}>+</button></div><button type="button" className="remove-link" onClick={() => removeItem(item.id)} disabled={submitting}>Remove <span className="sr-only">{item.name}</span></button></div>)}</div>}
      </div>

      <section className="panel-card qe-delivery-choice" aria-labelledby="delivery-options-title">
        <div className="panel-head"><div><span className="eyebrow dark">DELIVERY OPTIONS</span><h2 id="delivery-options-title">Choose your delivery.</h2></div><span aria-hidden="true">🛵</span></div>
        <label className="qe-delivery-area-label" htmlFor="delivery-area">Delivery area</label>
        <select id="delivery-area" name="area" defaultValue="" required disabled={submitting} aria-describedby="delivery-area-help">
          <option value="" disabled>Select your Addis Ababa area</option>
          {DELIVERY_AREAS.map((area) => <option value={area} key={area}>{area}</option>)}
        </select>
        <p id="delivery-area-help" className="qe-delivery-help">Choose the area where your order should arrive.</p>
        {state.fieldErrors?.area && <small className="field-error" id="delivery-area-error">{state.fieldErrors.area}</small>}
        <label className="qe-delivery-area-label" htmlFor="delivery-address">Street, building, or landmark</label>
        <input className="qe-delivery-address" id="delivery-address" name="deliveryAddress" placeholder="e.g. Bole, behind Edna Mall, Blue Building, Apt 4" autoComplete="street-address" minLength={8} maxLength={180} required disabled={submitting} aria-describedby="delivery-address-help" />
        <p id="delivery-address-help" className="qe-delivery-help">Add a nearby landmark or building so the courier can find you.</p>
        {state.fieldErrors?.deliveryAddress && <small className="field-error">{state.fieldErrors.deliveryAddress}</small>}
        <fieldset className="qe-delivery-methods" disabled={submitting}>
          <legend className="qe-delivery-area-label">Delivery method</legend>
          {Object.entries(DELIVERY_OPTIONS).map(([value, option]) => (
            <label className={`qe-delivery-method ${deliveryOption === value ? 'selected' : ''}`} key={value}>
              <input type="radio" name="deliveryOption" value={value} checked={deliveryOption === value} onChange={() => setDeliveryOption(value)} />
              <span className="qe-delivery-method-copy"><strong>{option.label}</strong><small>{option.description}</small><em>{option.eta}</em></span>
              <strong className="qe-delivery-method-price">{etb(option.fee)}</strong>
            </label>
          ))}
        </fieldset>
        {state.fieldErrors?.deliveryOption && <small className="field-error">{state.fieldErrors.deliveryOption}</small>}
      </section>
    </div>

    <aside className="checkout-side"><div className="panel-card">
      <span className="eyebrow dark">CUSTOMER DETAILS</span><h2>Who are we delivering to?</h2>
      <label htmlFor="checkout-customer-name">Name<input id="checkout-customer-name" name="customerName" placeholder="Your full name" defaultValue={customerName} autoComplete="name" required minLength={2} maxLength={80} disabled={submitting} /></label>{state.fieldErrors?.customerName && <small className="field-error">{state.fieldErrors.customerName}</small>}
      <label htmlFor="checkout-phone">Phone<input id="checkout-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0912345678" pattern="09[0-9]{8}" title="Enter a 10-digit Ethiopian mobile number starting with 09" required disabled={submitting} /></label>{state.fieldErrors?.phone && <small className="field-error">{state.fieldErrors.phone}</small>}
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="orderKey" value={orderKey} />
      {state.error && <div className="inline-alert" role="alert" tabIndex={-1}>{state.error}</div>}
      <div className="summary"><div><span>Subtotal</span><strong>{etb(total)}</strong></div><div><span>{deliveryChoice.label}</span><strong>{etb(items.length ? deliveryChoice.fee : 0)}</strong></div><div className="total-row"><span>Total</span><strong>{etb(items.length ? total + deliveryChoice.fee : 0)}</strong></div></div>
      <button type="submit" className="button button-primary wide" disabled={!items.length || !orderKey || submitting}>{submitting ? 'Placing order…' : 'Place order →'}</button>
      <p className="qe-form-note" role="status" aria-live="polite">{submitting ? 'Submitting your order. Please wait and do not submit again.' : ''}</p>
    </div></aside>
  </form>;
}
