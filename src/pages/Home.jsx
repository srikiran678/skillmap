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

      {/* ── Trending AI Videos & Free Courses ── */}
      <section className="section container">
        <div className="section-header">
          <p className="section-eyebrow">Futuristic Knowledge Streams</p>
          <h2 className="section-title">Trending <span className="text-gradient">AI Videos & Free Courses</span></h2>
          <p className="section-desc">Acquire critical AI literacy with curated video resources and industry-backed programs.</p>
        </div>

        <div className="home__ai-section" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          
          {/* Video stream tiles */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, fontSize: '1.4rem', color: 'var(--clr-primary)' }}>
              🎥 Trending Video Broadcasts
            </h3>
            <div className="grid-3">
              {[
                {
                  id: 'vid-google-essential',
                  title: 'Google AI Essentials — Complete Overview',
                  channel: 'Google Career Certificates',
                  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed link
                  desc: 'A complete run-through of how to implement prompt engineering, boost workplace productivity, and use generative AI responsibly.',
                  views: '1.2M views',
                  time: '2 weeks ago'
                },
                {
                  id: 'vid-andrew-ng',
                  title: 'AI for Everyone: Core Concepts',
                  channel: 'DeepLearning.AI',
                  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  desc: 'Andrew Ng breaks down how deep learning algorithms function, where machine learning can be applied, and its true limits.',
                  views: '940K views',
                  time: '1 month ago'
                },
                {
                  id: 'vid-generative-ai',
                  title: 'Generative AI Roadmap in 2026',
                  channel: 'Neural Academy',
                  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  desc: 'The complete mathematical and developmental guide to mastery of Large Language Models (LLMs), Transformer networks, and diffusion tools.',
                  views: '320K views',
                  time: '3 days ago'
                }
              ].map(vid => (
                <div key={vid.id} className="glass" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                    <iframe
                      src={vid.url}
                      title={vid.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-primary)', fontWeight: 700 }}>
                      {vid.channel}
                    </span>
                    <h4 style={{ fontSize: '1rem', marginTop: 6, marginBottom: 8, fontWeight: 700, lineHeight: 1.4 }}>
                      {vid.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', marginBottom: 14, flex: 1 }}>
                      {vid.desc}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>
                      <span>👁️ {vid.views}</span>
                      <span>⏱️ {vid.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Free Courses */}
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, fontSize: '1.4rem', color: 'var(--clr-accent)' }}>
              🎓 Accredited Free AI Courses
            </h3>
            <div className="grid-3">
              {[
                {
                  title: 'Google AI Essentials',
                  provider: 'Google',
                  skills: ['Prompt Engineering', 'Productivity', 'Responsible AI'],
                  desc: 'Learn practical AI skills to help you work more efficiently and solve daily challenges. Designed for all experience levels.',
                  duration: '9 hours',
                  link: 'https://grow.google/ai-essentials/'
                },
                {
                  title: 'AI for Beginners Curriculum',
                  provider: 'Microsoft',
                  skills: ['Machine Learning', 'Neural Networks', 'Computer Vision'],
                  desc: 'A comprehensive 24-lesson curriculum designed for developers starting out in artificial intelligence.',
                  duration: '12 weeks',
                  link: 'https://github.com/microsoft/AI-For-Beginners'
                },
                {
                  title: 'Elements of AI',
                  provider: 'University of Helsinki',
                  skills: ['AI Concepts', 'Algorithms', 'Societal Impact'],
                  desc: 'Free online course for anyone who wants to know what AI is, what is possible with AI, and how it affects our lives.',
                  duration: '6 weeks',
                  link: 'https://www.elementsofai.com/'
                }
              ].map((course, idx) => (
                <div key={idx} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span className="badge badge-intermediate" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        {course.provider}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-dim)' }}>⏱️ {course.duration}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{course.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: 16 }}>{course.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {course.skills.map(skill => (
                        <span key={skill} className="badge" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'var(--clr-border)', color: 'var(--clr-text-muted)', fontSize: '0.68rem', padding: '3px 8px' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
                  >
                    Start Course 🚀
                  </a>
                </div>
              ))}
            </div>
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
