'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createUser, getUserByEmail } from '@/lib/data';
import { createSessionValue } from '@/lib/session-crypto';
import { hashUserPassword, verifyUserPassword } from '@/lib/passwords';
import { SESSION_COOKIE } from '@/lib/session';

function safeNext(next) {
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return '/';
  try {
    const parsed = new URL(next, 'http://addis-eats.local');
    if (parsed.origin !== 'http://addis-eats.local') return '/';
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
}

export async function signIn(_prevState, formData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const next = safeNext(String(formData.get('next') || '/'));
  const user = getUserByEmail(email);

  if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
    return { error: 'Authentication is not configured yet. Set SESSION_SECRET to a random value with at least 32 characters.' };
  }
  if (!user || !verifyUserPassword(user, password)) return { error: 'Email or password is incorrect.' };

  const sessionValue = await createSessionValue({ id: user.id, role: user.role, name: user.name, email: user.email });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  redirect(next);
}


export async function signUp(_prevState, formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const passwordConfirm = String(formData.get('passwordConfirm') || '');

  if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
    return { error: 'Authentication is not configured yet. Set SESSION_SECRET to a random value with at least 32 characters.' };
  }
  if (name.length < 2 || name.length > 80) return { error: 'Enter a name between 2 and 80 characters.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  if (password.length < 8) return { error: 'Use a password with at least 8 characters.' };
  if (password !== passwordConfirm) return { error: 'Your passwords do not match.' };

  const user = createUser({ name, email, passwordHash: hashUserPassword(password) });
  if (!user) return { error: 'An account with that email already exists. Sign in instead.' };

  const sessionValue = await createSessionValue({ id: user.id, role: user.role, name: user.name, email: user.email });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  redirect('/orders');
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/');
}
