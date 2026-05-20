import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import './Home.css';

const FEATURES = [
  { icon: '🌌', title: 'Interactive 3D Galaxy', desc: 'Explore career paths and required skills in a fully interactive 3D universe.' },
  { icon: '🧠', title: 'AI Recommendation Engine', desc: 'Get smart suggestions on your next optimal skill to master.' },
  { icon: '⏱️', title: 'Career Time Simulator', desc: 'Predict the estimated time to reach your futuristic dream job.' },
  { icon: '🏆', title: 'Cyber Badges & XP', desc: 'Gamify your learning journey. Earn XP and unlock holographic badges.' },
  { icon: '📈', title: 'Real-time Market Data', desc: 'Live insights on salaries and demand for cutting-edge tech roles.' },
  { icon: '⚡', title: 'Daily Neural Challenges', desc: '5-minute micro-learning tasks to keep your brain agile.' },
];

const DOMAINS = [
  { icon: '⚛️', label: 'Quantum Computing' },
  { icon: '🤖', label: 'AI & Ethics' },
  { icon: '🛡️', label: 'Cybersecurity' },
  { icon: '✨', label: 'Spatial UI/UX' },
  { icon: '☁️', label: 'Cloud Architecture' },
  { icon: '🧠', label: 'Neural Engineering' },
];

export default function Home() {
  const navigate = useNavigate();
  const { hasProfile } = useUser();
  const heroRef = useRef(null);

  // Parallax on hero orbs
  useEffect(() => {
    const handler = (e) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      heroRef.current.style.setProperty('--mx', `${x}px`);
      heroRef.current.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="home page">
      {/* ── Hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg" aria-hidden>
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>
        <div className="container hero__content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero__badge"
          >
            <span>⚡</span> The Next-Gen Career Intelligence Node
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero__title glitch"
            data-text="Map Your Skills. Define The Future."
          >
            Map Your Skills.<br />
            <span className="text-gradient">Define The Future.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero__sub"
          >
            Access a personalized neural roadmap to master cutting-edge technologies. 
            Gamify your learning, simulate career timelines, and explore your skill galaxy in 3D.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hero__cta"
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(hasProfile ? '/dashboard' : '/profile')}
            >
              {hasProfile ? '📊 Access Mainframe (Dashboard)' : '🚀 Initialize Profile'}
            </button>
            {!hasProfile && (
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/roadmap')}>
                Preview Roadmap
              </button>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="hero__domains"
          >
            {DOMAINS.map(d => (
              <span key={d.label} className="hero__domain-chip">
                {d.icon} {d.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats">
        <div className="container">
          <div className="home-stats__grid stagger-children">
            {[
              { val: '50+', label: 'Next-Gen Careers' },
              { val: '10', label: 'Integrated AI Tools' },
              { val: '3D', label: 'Galaxy Visualizer' },
              { val: '∞', label: 'Possibilities' },
            ].map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="home-stat glass"
              >
                <div className="home-stat__val">{s.val}</div>
                <div className="home-stat__label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section container">
        <div className="section-header">
          <p className="section-eyebrow">Advanced Toolkit</p>
          <h2 className="section-title">Upgrade Your <span className="text-gradient">Hardware & Skills</span></h2>
          <p className="section-desc">Experience 10 cutting-edge features designed to accelerate your growth.</p>
        </div>
        <div className="grid-3" style={{ marginTop: 48 }}>
          {FEATURES.map((f, i) => (
            <motion.div 
              key={f.title} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 243, 255, 0.4)' }}
              transition={{ duration: 0.3 }}
              className="feature-card glass"
            >
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-banner__inner glass-bright"
          >
            <div>
              <h2 className="cta-banner__title">Ready for the Next Paradigm?</h2>
              <p className="cta-banner__sub">Join the neural network of ambitious learners.</p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(hasProfile ? '/dashboard' : '/profile')}
            >
              {hasProfile ? 'Enter Dashboard →' : 'Initialize Sequence →'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container">
          <span className="navbar__logo-text">⚡ Skill<span className="text-gradient">Map</span> 2084</span>
          <p>Built for the cybernetic future. All systems online.</p>
        </div>
      </footer>
    </div>
  );
}
