'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signIn } from '@/app/actions/auth';

const initialState = { error: '' };

export default function SignInForm({ next = '/orders' }) {
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <form action={action} className="auth-card qe-auth-card">
      <div className="auth-logo" aria-hidden="true">
        🛵
      </div>
      <span className="eyebrow dark">WELCOME BACK</span>
      <h1>Sign in to Addis Eats.</h1>
      <p>Track orders, save favorites and check out faster.</p>

      <input type="hidden" name="next" value={next} />

      <label htmlFor="signin-email">
        Email
        <input
          id="signin-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="ifa@example.com"
          required
        />
      </label>

      <label htmlFor="signin-password">
        Password
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </label>

      {state.error && (
        <div className="inline-alert" role="alert">
          {state.error}
        </div>
      )}

      <button className="button button-primary wide" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in →'}
      </button>

      <div className="demo-box">
        <strong>Demo accounts</strong>
        <span>Customer: ifa@example.com / demo123</span>
        <span>Staff: kitchen@example.com / staff123</span>
      </div>

      <div className="qe-auth-switch">
        New to Addis Eats? <Link href="/signup">Create an account</Link>
      </div>
    </form>
  );
}