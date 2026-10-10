export const metadata = {
  title: 'Contact',
  description: 'Contact Addis Eats for delivery and support questions.',
};

export default function ContactPage() {
  return (
    <section className="section container page-top narrow">
      <span className="eyebrow dark">WE ARE HERE</span>
      <h1>Need a hand?</h1>
      <p>
        For delivery help, account questions or feedback, send us a message.
      </p>

      <div className="contact-card">
        <div>
          <strong>Customer care</strong>
          <span>support@addiseats.example</span>
          <span>+251 900 000 000</span>
        </div>
        <div>
          <strong>Hours</strong>
          <span>Every day · 9:00 AM–10:00 PM</span>
          <span>Addis Ababa, Ethiopia</span>
        </div>
      </div>
    </section>
  );
}