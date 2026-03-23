import './Contact.css';

const RUSH_STEPS = [
  { num: '01', title: 'Rush Events', desc: 'Attend our open rush events to meet the brothers and learn about our fraternity.' },
  { num: '02', title: 'Interest Meeting', desc: 'Attend a formal interest meeting to get a deeper look at what we stand for.' },
  { num: '03', title: 'Interview', desc: 'Meet individually with brothers in a casual interview setting.' },
  { num: '04', title: 'Bid & Pledge', desc: 'If selected, you\'ll receive a bid and begin your pledge process.' },
];

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact__grid">

          <div className="contact__left">
            <p className="section-eyebrow">Join Us</p>
            <h2 className="section-title">Rush Alpha Psi Rho</h2>
            <div className="divider" />

            <p className="contact__intro">
              We are always looking for motivated, culturally aware men who want to be part
              of something greater than themselves. If that sounds like you, we'd love to
              meet you during rush.
            </p>

            <div className="contact__steps">
              {RUSH_STEPS.map((step) => (
                <div className="contact__step" key={step.num}>
                  <span className="contact__step-num">{step.num}</span>
                  <div>
                    <h3 className="contact__step-title">{step.title}</h3>
                    <p className="contact__step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact__right">
            <div className="contact__form-wrapper">
              <p className="contact__form-title">Get In Touch</p>
              <p className="contact__form-sub">
                Questions about rush, the fraternity, or alumni reconnection? Reach out below.
              </p>

              <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
                <div className="contact__field-row">
                  <div className="contact__field">
                    <label>First Name</label>
                    <input type="text" placeholder="John" />
                  </div>
                  <div className="contact__field">
                    <label>Last Name</label>
                    <input type="text" placeholder="Doe" />
                  </div>
                </div>

                <div className="contact__field">
                  <label>Email</label>
                  <input type="email" placeholder="john@sdsu.edu" />
                </div>

                <div className="contact__field">
                  <label>I am a…</label>
                  <select>
                    <option value="">Select one</option>
                    <option>Prospective Rushee</option>
                    <option>Current Student (Non-Rushee)</option>
                    <option>Alumni</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="contact__field">
                  <label>Message</label>
                  <textarea placeholder="Tell us about yourself..." rows={4} />
                </div>

                <button type="submit" className="contact__submit">
                  Send Message
                </button>
              </form>

              <div className="contact__socials">
                <p className="contact__social-label">Follow Us</p>
                <div className="contact__social-links">
                  <a href="https://www.instagram.com/sdsuapsirho/" className="contact__social-link">Instagram</a>
                  <span>·</span>
                  <a href="#" className="contact__social-link">TikTok</a>
                  <span>·</span>
                  <a href="mailto:sdsuapsirho@gmail.com" className="contact__social-link">Email</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
