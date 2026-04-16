import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Home.css';

const FEATURES = [
  { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Compare your skills against 22+ job profiles and instantly see what you need to learn.' },
  { icon: '📊', title: 'Visual Dashboard', desc: 'Interactive charts showing your readiness, progress, and career match percentages.' },
  { icon: '🗺️', title: 'Smart Roadmap', desc: 'Get a prioritized learning path tailored to your target careers and current skill level.' },
  { icon: '📚', title: 'Curated Resources', desc: 'Access hand-picked free and paid courses, tutorials, and documentation for every skill.' },
  { icon: '⚡', title: 'Real-time Updates', desc: 'Mark skills as learned, update your level, and watch your match score improve instantly.' },
  { icon: '💾', title: 'Persistent Progress', desc: 'Your data is saved locally – pick up right where you left off, every time.' },
];

const DOMAINS = [
  { icon: '🌐', label: 'Web Dev' },
  { icon: '🤖', label: 'AI & ML' },
  { icon: '🛡️', label: 'Cybersecurity' },
  { icon: '🎨', label: 'UI/UX Design' },
  { icon: '☁️', label: 'DevOps' },
  { icon: '📱', label: 'Mobile Dev' },
  { icon: '📊', label: 'Data Science' },
  { icon: '⛓️', label: 'Blockchain' },
];

export default function Home() {
  const navigate = useNavigate();
  const { hasProfile } = useUser();
  const heroRef = useRef(null);

  // Parallax on hero orbs
  useEffect(() => {
    const handler = (e) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
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
          <div className="hero__badge animate-fadeInUp">
            <span>⚡</span> Your Personal Career Intelligence Platform
          </div>
          <h1 className="hero__title animate-fadeInUp" style={{ animationDelay: '80ms' }}>
            Map Your Skills.<br />
            <span className="text-gradient">Land Your Dream Career.</span>
          </h1>
          <p className="hero__sub animate-fadeInUp" style={{ animationDelay: '160ms' }}>
            Discover exactly which skills stand between you and your ideal job.
            Get a personalized roadmap, track your progress, and access the best
            learning resources — all in one place.
          </p>
          <div className="hero__cta animate-fadeInUp" style={{ animationDelay: '240ms' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(hasProfile ? '/dashboard' : '/profile')}
            >
              {hasProfile ? '📊 View My Dashboard' : '🚀 Start Mapping My Skills'}
            </button>
            {!hasProfile && (
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/profile')}>
                See How It Works
              </button>
            )}
          </div>
          <div className="hero__domains animate-fadeInUp" style={{ animationDelay: '320ms' }}>
            {DOMAINS.map(d => (
              <span key={d.label} className="hero__domain-chip">
                {d.icon} {d.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats">
        <div className="container">
          <div className="home-stats__grid stagger-children">
            {[
              { val: '22+', label: 'Career Profiles' },
              { val: '120+', label: 'Skills Tracked' },
              { val: '8', label: 'Industry Domains' },
              { val: '100%', label: 'Free to Use' },
            ].map(s => (
              <div key={s.label} className="home-stat glass animate-fadeInUp">
                <div className="home-stat__val">{s.val}</div>
                <div className="home-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section container">
        <div className="section-header">
          <p className="section-eyebrow">Why SkillMap</p>
          <h2 className="section-title">Everything you need to <span className="text-gradient">grow faster</span></h2>
          <p className="section-desc">A complete career intelligence toolkit built for ambitious learners.</p>
        </div>
        <div className="grid-3 stagger-children" style={{ marginTop: 48 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card glass animate-fadeInUp">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Simple Process</p>
            <h2 className="section-title">From zero to <span className="text-gradient-cyan">career-ready</span></h2>
          </div>
          <div className="steps stagger-children">
            {[
              { step: '01', icon: '📄', title: 'Build Your Profile', desc: 'Enter your academic background, career interests, and current skills in minutes.' },
              { step: '02', icon: '🔍', title: 'Analyze Your Gaps', desc: 'Our engine matches your profile against job requirements and identifies what\'s missing.' },
              { step: '03', icon: '🗺️', title: 'Follow Your Roadmap', desc: 'Get a prioritized list of skills to learn, with curated resources for each one.' },
              { step: '04', icon: '🏆', title: 'Track & Achieve', desc: 'Mark skills complete, track your progress, and watch your career match score rise.' },
            ].map((s, i) => (
              <div key={s.step} className="step animate-fadeInUp">
                <div className="step__number">{s.step}</div>
                <div className="step__icon">{s.icon}</div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.desc}</p>
                {i < 3 && <div className="step__connector" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner glass-bright">
          <div>
            <h2 className="cta-banner__title">Ready to accelerate your career?</h2>
            <p className="cta-banner__sub">Join thousands mapping their path to success.</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(hasProfile ? '/dashboard' : '/profile')}
          >
            {hasProfile ? 'Go to Dashboard →' : 'Get Started Free →'}
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container">
          <span className="navbar__logo-text">⚡ Skill<span className="text-gradient">Map</span></span>
          <p>© 2026 SkillMap. Built for ambitious learners everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
