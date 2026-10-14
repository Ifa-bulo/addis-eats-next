'use client';

import { useRef, useState } from 'react';
import { logout } from '@/app/actions/auth';

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      await logout();
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return <form onSubmit={handleSubmit} aria-busy={pending}><button className="button button-ghost" type="submit" disabled={pending}>{pending ? 'Signing out…' : 'Sign out'}</button></form>;
}
