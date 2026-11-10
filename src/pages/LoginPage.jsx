import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [portalConnecting, setPortalConnecting] = useState(false);

  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      navigate(redirectTarget);
      return;
    }

    // Check if already in guest mode
    if (localStorage.getItem('skillmap_guest_mode') === 'true') {
      navigate(redirectTarget);
    }
  }, [isAuthenticated, loading, navigate, redirectTarget]);

  const handleGuestLogin = () => {
    localStorage.setItem('skillmap_guest_mode', 'true');
    navigate(redirectTarget);
  };

  const handleConnectPortal = () => {
    setPortalConnecting(true);
    const authPortalUrl = import.meta.env.VITE_AUTH_WEBSITE_URL || 'http://localhost:5174';
    const callbackUrl = `${window.location.origin}${redirectTarget}`;
    window.location.href = `${authPortalUrl}?redirect=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <div className="login-page">
      {/* Background Orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />
      <div className="login-grid-overlay" />

      <div className="login-card gateway-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__icon">🗺️</span>
          <span className="login-logo__text">Skill<span className="text-gradient">Map</span></span>
        </div>

        <div className="gateway-content">
          <h2 className="gateway-title" style={{ marginTop: 8 }}>Access Learning Portal</h2>
          <p className="gateway-status" style={{ marginBottom: 20 }}>
            Choose how you would like to explore SkillMap, access 30+ interactive developer lessons, and collaborate with Sentinel AI Mentor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px 18px', fontSize: '0.92rem', fontWeight: 600 }}
              onClick={handleGuestLogin}
            >
              ⚡ Explore as Guest Operative (No Login Required)
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px 18px', fontSize: '0.88rem' }}
              onClick={handleConnectPortal}
              disabled={portalConnecting}
            >
              {portalConnecting ? 'Connecting to Identity Node...' : '🔐 Connect via Auth Portal'}
            </button>
          </div>

          <span className="gateway-footer" style={{ marginTop: 24 }}>
            SkillMap Security Protocol v2.84 · High-Speed Learning Core
          </span>
        </div>
      </div>
    </div>
  );
}
