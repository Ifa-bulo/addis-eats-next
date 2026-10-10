import './globals.css';
import { CartProvider } from '@/components/cart-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Addis Eats | Ethiopian food delivery',
    template: '%s | Addis Eats'
  },
  description: 'Discover Ethiopian favorites, vegetarian plates, burgers, pizza, drinks and desserts from Addis Eats in Addis Ababa.',
  openGraph: {
    title: 'Addis Eats | Ethiopian food delivery',
    description: 'Ethiopian favorites and everyday comfort food, delivered with care across Addis Ababa.',
    url: siteUrl,
    siteName: 'Addis Eats',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Addis Eats food delivery in Addis Ababa' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Addis Eats | Ethiopian food delivery',
    description: 'Modern food delivery in Addis Ababa.',
    images: ['/og-image.jpg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
