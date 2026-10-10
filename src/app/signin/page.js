import SignInForm from '@/components/signin-form';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to access your private Addis Eats orders.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === 'string' ? params.next : '/orders';

  return (
    <section className="auth-shell qe-auth-shell">
      <div className="auth-side qe-auth-side">
        <span className="eyebrow">GOOD FOOD, GOOD COMPANY</span>
        <h2>From the kitchen to your door.</h2>
        <p>
          Sign in once. Stay signed in. Track every order from received to
          delivered.
        </p>

        <div className="auth-art" aria-hidden="true">
          🛵
        </div>

        <div className="qe-auth-perks">
          <span>✓ Clear ETB prices</span>
          <span>✓ Private order history</span>
          <span>✓ Live status updates</span>
        </div>
      </div>

      <SignInForm next={next} />
    </section>
  );
}