'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { signUp } from '@/app/actions/auth';

const initialState = { error: '' };

export default function SignUpForm() {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    inFlight.current = true;
    setPending(true);
    setState(initialState);
    try {
      const result = await signUp(null, new FormData(form));
      if (result) setState(result);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-card qe-auth-card" aria-busy={pending}>
      <div className="auth-logo" aria-hidden="true">🛵</div>
      <span className="eyebrow dark">LET'S GET YOU FED</span>
      <h1>Create your account.</h1>
      <p>Save your favorite dishes and keep your order status in one place.</p>
      <label htmlFor="signup-name">Full name<input id="signup-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required disabled={pending} /></label>
      <label htmlFor="signup-email">Email address<input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required disabled={pending} /></label>
      <label htmlFor="signup-password">Password<input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required disabled={pending} /></label>
      <label htmlFor="signup-confirm">Confirm password<input id="signup-confirm" name="passwordConfirm" type="password" autoComplete="new-password" minLength={8} placeholder="Type it again" required disabled={pending} /></label>
      {state.error && <div className="inline-alert" role="alert" tabIndex={-1}>{state.error}</div>}
      <button type="submit" className="button button-primary wide" disabled={pending}>{pending ? 'Creating account…' : 'Create account →'}</button>
      <div className="qe-auth-switch">Already have an account? <Link href="/signin">Sign in</Link></div>
      <p className="qe-form-note">This portfolio demo uses a temporary process-local account store. Configure a persistent identity/database service before real customer use.</p>
    </form>
  );
}
