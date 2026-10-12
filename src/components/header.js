'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './cart-provider';

const navigation = [
  ['Home', '/'],
  ['Menu', '/menu'],
  ['About', '/about'],
  ['Track order', '/orders']
];

export default function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('addis-eats-theme');
      const initial = saved === 'dark' ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {
      document.documentElement.dataset.theme = 'light';
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem('addis-eats-theme', next); } catch { /* Private browsing may disable storage. */ }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="qe-utility">
        <div className="qe-container qe-utility-inner">
          <span><span className="qe-live-dot" aria-hidden="true" /> Fresh, fast, and full of flavor.</span>
          <div><Link href="/orders">Track order</Link><span aria-hidden="true">·</span><Link href="/contact">Help &amp; contact</Link></div>
        </div>
      </div>
      <header className="qe-header">
        <div className="qe-container qe-header-main">
          <Link className="qe-brand" href="/" aria-label="Addis Eats home">
            <span className="qe-brand-mark" aria-hidden="true">🛵</span>
            <span className="qe-brand-words">Addis<span>Eats</span><small>GOOD FOOD. RIGHT ON TIME.</small></span>
          </Link>

          <Link className="qe-location" href="/contact" aria-label="Delivery area: Addis Ababa, City Center">
            <span className="qe-location-pin" aria-hidden="true">⌖</span>
            <span><strong>Addis Ababa</strong><small>City Center</small></span>
            <span className="qe-chevron" aria-hidden="true">⌄</span>
          </Link>

          <nav className="qe-desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, href]) => (
              <Link className={pathname === href ? 'active' : ''} key={href} href={href}>{label}</Link>
            ))}
          </nav>

          <div className="qe-header-actions">
            <Link className="qe-icon-action" href="/menu" aria-label="Search menu" title="Search menu"><span aria-hidden="true">⌕</span></Link>
            <Link className={`qe-icon-action ${pathname === '/favorites' ? 'active' : ''}`} href="/favorites" aria-label="Saved favorites" title="Favorites"><span aria-hidden="true">♡</span></Link>
            <Link className="qe-cart-action" href="/checkout" aria-label={`Shopping cart, ${count} items`} title="Shopping cart">
              <span aria-hidden="true">🛍</span><b>{count}</b>
            </Link>
            <button type="button" className="qe-theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            </button>
            <Link className="qe-account-link" href="/signin">Sign in</Link>
          </div>
        </div>
      </header>
      <nav className="qe-mobile-nav" aria-label="Mobile navigation">
        <Link className={pathname === '/' ? 'active' : ''} href="/"><span aria-hidden="true">⌂</span><small>Home</small></Link>
        <Link className={pathname.startsWith('/menu') ? 'active' : ''} href="/menu"><span aria-hidden="true">▦</span><small>Menu</small></Link>
        <Link className="qe-mobile-order" href="/checkout" aria-label={`Order now, ${count} items in cart`}><span aria-hidden="true">＋</span><small>Order</small></Link>
        <Link className={pathname.startsWith('/orders') ? 'active' : ''} href="/orders"><span aria-hidden="true">▤</span><small>Orders</small></Link>
        <Link className={pathname === '/signin' ? 'active' : ''} href="/signin"><span aria-hidden="true">♙</span><small>Account</small></Link>
      </nav>
    </>
  );
}
