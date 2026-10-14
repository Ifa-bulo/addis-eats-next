'use client';

import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { setDishAvailability } from '@/app/actions/menu';
import { etb } from '@/lib/format';

function AvailabilityButton({ nextAvailability, dishName }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={nextAvailability ? 'button button-primary menu-availability-action' : 'button button-dark menu-availability-action'}
      disabled={pending}
      aria-label={`${nextAvailability ? 'Enable' : 'Disable'} ${dishName}`}
    >
      {pending ? 'Saving…' : nextAvailability ? 'Enable dish' : 'Disable dish'}
    </button>
  );
}

export default function MenuAvailabilityManager({ dishes }) {
  const availableCount = dishes.filter((dish) => dish.isAvailable).length;
  return (
    <div className="admin-menu-manager">
      <div className="admin-menu-summary" aria-live="polite">
        <strong>{availableCount} of {dishes.length} dishes enabled</strong>
        <span>Disabling a dish keeps its record and details. Customers cannot add it to an order while it is unavailable.</span>
      </div>
      <div className="admin-menu-list">
        {dishes.map((dish) => (
          <article className={`admin-menu-row ${dish.isAvailable ? '' : 'is-unavailable'}`} key={dish.id}>
            <div className="admin-menu-dish-image">
              <Image src={dish.image} alt="" width={100} height={80} />
            </div>
            <div className="admin-menu-dish-copy">
              <div className="admin-menu-dish-topline">
                <h2>{dish.name}</h2>
                <span className={`admin-menu-status ${dish.isAvailable ? 'is-enabled' : 'is-disabled'}`}>
                  <span aria-hidden="true" /> {dish.isAvailable ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p>{dish.description}</p>
              <div className="admin-menu-meta"><span>{dish.category.replaceAll('-', ' ')}</span><strong>{etb(dish.price)}</strong></div>
            </div>
            <form action={setDishAvailability} className="admin-menu-toggle-form">
              <input type="hidden" name="dishId" value={dish.id} />
              <input type="hidden" name="isAvailable" value={dish.isAvailable ? 'false' : 'true'} />
              <AvailabilityButton nextAvailability={!dish.isAvailable} dishName={dish.name} />
            </form>
          </article>
        ))}
      </div>
      <p className="admin-menu-note">Changes use the current in-memory demo data store. For permanent changes across Vercel instances and deployments, persist availability in a database.</p>
    </div>
  );
}
