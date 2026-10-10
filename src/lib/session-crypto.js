const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEVELOPMENT_SECRET = 'addis-eats-local-demo-secret-change-me';

function getSecret() {
  const configured = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production' && (!configured || configured.length < 32)) return null;
  return configured || DEVELOPMENT_SECRET;
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value) {
  const secret = getSecret();
  if (!secret) throw new Error('SESSION_SECRET must be configured in production before signing in.');
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionValue(session) {
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64Url(encoder.encode(JSON.stringify({ ...session, iat: now, exp: now + SESSION_TTL_SECONDS })));
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionValue(value) {
  const secret = getSecret();
  if (!secret || !value || !value.includes('.')) return null;
  const [payload, signature, extra] = value.split('.');
  if (!payload || !signature || extra) return null;
  try {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(payload));
    if (!valid) return null;
    const session = JSON.parse(decoder.decode(fromBase64Url(payload)));
    const now = Math.floor(Date.now() / 1000);
    if (!session || typeof session.exp !== 'number' || session.exp <= now || typeof session.id !== 'string') return null;
    return session;
  } catch {
    return null;
  }
}
