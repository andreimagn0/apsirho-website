import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './About.css';

export default function About() {
  const [eboard, setEboard] = useState([]);

  useEffect(() => {
  async function fetchExecutiveBoard() {
    const { data: eboardData, error: eboardError } = await supabase
      .from('executive_board')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    const { data: brothersData, error: brothersError } = await supabase
      .from('brothers')
      .select('*');

    console.log('EBOARD DATA:', eboardData);
    console.log('EBOARD ERROR:', eboardError);
    console.log('BROTHERS DATA:', brothersData);
    console.log('BROTHERS ERROR:', brothersError);

    if (eboardError || brothersError) {
      console.error('Error fetching executive board:', eboardError || brothersError);
      return;
    }

    const brothersById = {};

    brothersData.forEach((brother) => {
      brothersById[brother.id] = brother;
    });

    const mappedBoard = eboardData.map((row) => {
      const brother = brothersById[row.brother_id];

      return {
        id: row.id,
        role: row.position_title,
        name: brother?.name || 'Vacant',
        profileImageUrl: brother?.profile_image_url || null,
      };
    });

  setEboard(mappedBoard);
}

    fetchExecutiveBoard();
  }, []);

  const initials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

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
                desc: "To be able to endure and overcome both mental and physical challenges that present itself during a brother's lifetime."
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
          <h2 className="section-title" style={{ textAlign: 'center' }}>2026–2027 Executive Board</h2>
          <div className="divider center" />

          <div className="about__eboard-grid">
            {eboard.map((member) => (
              <div className="about__eboard-card" key={member.id}>
                <div className="about__eboard-avatar">
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.name}
                      className="about__eboard-avatar-img"
                    />
                  ) : (
                    initials(member.name)
                  )}
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