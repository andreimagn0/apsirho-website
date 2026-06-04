import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './Contact.css';

const HEARD_OPTIONS = [
  'Instagram',
  'Friend / Brother',
  'SDSU Campus Event',
  'Rush Event',
  'Website',
  'Other',
];

const YEAR_OPTIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    year: '',
    major: '',
    heardFrom: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const { error } = await supabase.from('inquiries').insert([{
      first_name:  form.firstName,
      last_name:   form.lastName,
      email:       form.email,
      phone:       form.phone,
      year:        form.year,
      major:       form.major,
      heard_from:  form.heardFrom,
      message:     form.message,
    }]);

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ firstName:'', lastName:'', email:'', phone:'', year:'', major:'', heardFrom:'', message:'' });
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">

        <div className="contact__header contact__header--left">
          <p className="section-eyebrow">Get Involved</p>
          <h2 className="section-title">Contact Us</h2>
          <div className="divider" />
          <p className="contact__intro">
            Interested in Alpha Psi Rho? Fill out the form below and a brother
            will reach out to you with more information about our upcoming rush events.
          </p>
        </div>

        <div className="contact__form-wrap">

          {status === 'success' ? (
            <div className="contact__success">
              <div className="contact__success-icon">✓</div>
              <h4>We got your inquiry!</h4>
              <p>A brother will reach out to you soon. Follow us on Instagram for rush event updates.</p>
              <a href="https://instagram.com/sdsuapsirho" target="_blank" rel="noopener noreferrer" className="contact__ig">
                @sdsuapsirho
              </a>
              <button className="contact__btn" onClick={() => setStatus(null)}>
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact__form">

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label">First Name *</label>
                  <input className="contact__input" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First" />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Last Name *</label>
                  <input className="contact__input" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last" />
                </div>
              </div>

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label">Email *</label>
                  <input className="contact__input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Phone</label>
                  <input className="contact__input" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(619) 000-0000" />
                </div>
              </div>

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label">Year *</label>
                  <select className="contact__input contact__select" name="year" value={form.year} onChange={handleChange} required>
                    <option value="">Select...</option>
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="contact__field">
                  <label className="contact__label">Major *</label>
                  <input className="contact__input" name="major" value={form.major} onChange={handleChange} required placeholder="e.g. Business" />
                </div>
              </div>

              <div className="contact__field">
                <label className="contact__label">How did you hear about us?</label>
                <select className="contact__input contact__select" name="heardFrom" value={form.heardFrom} onChange={handleChange}>
                  <option value="">Select...</option>
                  {HEARD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="contact__field">
                <label className="contact__label">Message / Questions</label>
                <textarea className="contact__input contact__textarea" name="message" value={form.message} onChange={handleChange} placeholder="Any questions about Alpha Psi Rho? Feel free to introduce yourself..." rows={4} />
              </div>

              {status === 'error' && (
                <p className="contact__error">Something went wrong. DM us on Instagram @sdsuapsirho.</p>
              )}

              <button type="submit" className="contact__btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
              </button>

            </form>
          )}

          <div className="contact__footer-links">
            <a href="https://instagram.com/sdsuapsirho" target="_blank" rel="noopener noreferrer" className="contact__footer-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              @sdsuapsirho
            </a>
            <span className="contact__footer-sep">·</span>
            <a href="mailto:sdsuapsirho@gmail.com" className="contact__footer-link">
              sdsuapsirho@gmail.com
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
