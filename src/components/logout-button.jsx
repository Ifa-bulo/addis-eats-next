'use client';

import { logout } from '@/app/actions/auth';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button className="button button-ghost" type="submit">
        Sign out
      </button>
    </form>
  );
}