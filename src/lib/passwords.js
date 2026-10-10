import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/** Encodes a password as scrypt$salt$hexDigest for storage. */
export function hashUserPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const digest = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${digest}`;
}

/** Verifies an encoded scrypt hash using a timing-safe comparison. */
export function verifyUserPassword(user, candidate) {
  if (!user?.passwordHash || typeof candidate !== 'string' || !candidate) return false;
  const [scheme, salt, storedHex] = user.passwordHash.split('$');
  if (scheme !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(storedHex || '')) return false;
  try {
    const expected = Buffer.from(storedHex, 'hex');
    const actual = scryptSync(candidate, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
