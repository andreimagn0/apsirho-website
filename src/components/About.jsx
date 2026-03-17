import './About.css';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">

        <div className="about__header">
          <p className="section-eyebrow">Who We Are</p>
          <h2 className="section-title">About Alpha Psi Rho</h2>
          <div className="divider" />
        </div>

        <p className="about__foundation">
          The Foundation of this Fraternity was created on Brotherhood, Academics, Prosperity, and Strength.
          These ideas are to be preached and upheld by each Pledge Dogg to their fullest ability.
        </p>

        <div className="about__grid">
          <div className="about__mission">
            <div className="about__quote-mark">"</div>
            <blockquote className="about__mission-text">
              We, the Gentlemen of Alpha Psi Rho, strive to achieve Brotherhood through active
              participation in the community by promoting Asian/Pacific Islander awareness.
              Through fostering scholastic achievement, we shall mold future leaders who will
              actively pursue the apex of life. Our cultural background shall provide us with
              the strength and unity to attain greatness. Through Brhotherhood, we will produce
              high-caliber men who will be triumphant in the face of adversity. We are the
              gentlemen of Alpha Psi Rho.
            </blockquote>
            <p className="about__mission-label">— Mission Statement</p>
          </div>

          <div className="about__pillars">
            {[
              {
                icon: '❖',
                title: 'Brotherhood',
                desc: 'It is the strongest bond that unites the brothers of this Fraternity. It is a lifetime commitment that entails self-sacrifice, valor, and integrity for its brothers.',
              },
              {
                icon: '❖',
                title: 'Academics',
                desc: 'The ultimate goal for its members is to graduate from the University with a degree. To maintain a high standard of Academic life while attending college.',
              },
              {
                icon: '❖',
                title: 'Prosperity',
                desc: 'Being a member of Alpha Psi Rho is to be successful in all aspects of life: Academically, Socially, and Physically.',
              },
              {
                icon: '❖',
                title: 'Strength',
                desc: 'To be able to endure and overcome both mental and physical challenges that present itself during a brother's lifetime.',
              },
            ].map((p) => (
              <div className="about__pillar" key={p.title}>
                <span className="about__pillar-icon">{p.icon}</span>
                <div>
                  <h3 className="about__pillar-title">{p.title}</h3>
                  <p className="about__pillar-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about__eboard">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Leadership</p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>2025–2026 Executive Board</h2>
          <div className="divider center" />

          <div className="about__eboard-grid">
            {[
              { role: 'President', name: 'Jordan Louangxaysongkham' },
              { role: 'Vice President', name: 'Carson Mandigma' },
              { role: 'Secretary', name: 'Riley Coladilla' },
              { role: 'Treasurer', name: 'Trevor Bananal' },
              { role: 'Sergeant At Arms', name: 'Isiah Summerhill' },
              { role: 'Director of Recruitment', name: 'Brandon Tam' },
            ].map((member) => (
              <div className="about__eboard-card" key={member.role}>
                <div className="about__eboard-avatar">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <p className="about__eboard-role">{member.role}</p>
                <p className="about__eboard-name">
                  {member.name.split(' ').map((part, i) => (
                    <span key={i}>{part}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
