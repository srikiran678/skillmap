import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/profile', label: 'Profile', icon: '📄' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { to: '/mindmap', label: 'Mind Map', icon: '🧠' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { hasProfile } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

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
              {(link.to === '/dashboard' || link.to === '/roadmap' || link.to === '/mindmap') && !hasProfile && (
                <span className="navbar__lock">🔒</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {hasProfile ? (
            <NavLink to="/dashboard" className="btn btn-primary btn-sm">
              My Dashboard
            </NavLink>
          ) : (
            <NavLink to="/profile" className="btn btn-primary btn-sm">
              Get Started
            </NavLink>
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
