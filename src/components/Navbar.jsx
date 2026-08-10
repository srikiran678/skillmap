import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/ai-tools', label: 'AI Tools', icon: '🤖' },
  { to: '/github-repos', label: 'GitHub Repos', icon: '🐙' },
  { to: '/profile', label: 'Profile', icon: '📄' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { to: '/mindmap', label: 'Mind Map', icon: '🧠' },
  { to: '/learn', label: 'Learn', icon: '📚' },
  { to: '/challenges', label: 'Arena', icon: '⚔️' },
  { to: '/certificates', label: 'Vault', icon: '🏆' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { hasProfile, profile } = useUser();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setTimeout(() => setMenuOpen(false), 0);
  }, [location]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">Skill<span className="text-gradient">Map</span></span>
        </NavLink>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              <span className="navbar__link-icon">{link.icon}</span>
              <span>{link.label}</span>
              {(link.to === '/dashboard' || link.to === '/roadmap' || link.to === '/mindmap' || link.to === '/learn' || link.to === '/challenges' || link.to === '/certificates') && !hasProfile && (
                <span className="navbar__lock">🔒</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {hasProfile && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
              <span style={{ color: '#ff8c00' }}>🔥{profile?.streak_current || 0}</span>
              <span style={{ color: 'var(--clr-primary)' }}>⚡{profile?.xp || 0}</span>
            </span>
          )}
          {hasProfile ? (
            <NavLink to="/hub" className="btn btn-primary btn-sm">
              🎮 Game Hub
            </NavLink>
          ) : (
            <NavLink to="/profile" className="btn btn-primary btn-sm">
              Get Started
            </NavLink>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="btn btn-sm"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                fontWeight: 500,
              }}
              title={`Signed in as ${user.email}`}
            >
              Sign Out
            </button>
          )}
          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
