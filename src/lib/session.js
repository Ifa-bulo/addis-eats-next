import { cookies } from 'next/headers';
import { verifySessionValue } from './session-crypto';
import { SESSION_COOKIE } from './session-constants';

export { SESSION_COOKIE } from './session-constants';

export async function getSession() {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  return verifySessionValue(value);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session;
}

export async function requireStaff() {
  const session = await requireUser();
  if (session.role !== 'staff') throw new Error('FORBIDDEN');
  return session;
}
