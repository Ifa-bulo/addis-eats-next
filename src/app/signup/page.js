import SignUpForm from '@/components/signup-form';

export const metadata = {
  title: 'Create an Account',
  description: 'Create an Addis Eats demo account to place orders and track your order status.',
  robots: { index: false, follow: false }
};

export default function SignUpPage() {
  return (
    <section className="auth-shell qe-auth-shell">
      <div className="auth-side qe-auth-side">
        <span className="eyebrow">A BETTER WAY TO ORDER</span>
        <h2>Good food moments start here.</h2>
        <p>Create a demo account to place a sample order, check your private order history, and watch its status update live.</p>
        <div className="auth-art" aria-hidden="true">🛵</div>
        <div className="qe-auth-perks"><span>✓ Clear ETB prices</span><span>✓ Private order history</span><span>✓ Quick reorders</span></div>
      </div>
      <SignUpForm />
    </section>
  );
}
