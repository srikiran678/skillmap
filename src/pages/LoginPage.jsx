import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    const authPortalUrl = import.meta.env.VITE_AUTH_WEBSITE_URL || 'http://localhost:5174';
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    console.log(`Redirecting to secure auth portal: ${authPortalUrl} with callback: ${redirectUrl}`);
    
    // Navigate to the auth portal
    window.location.href = `${authPortalUrl}?redirect=${encodeURIComponent(redirectUrl)}`;
  }, [isAuthenticated, loading, navigate]);

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
          <span className="login-logo__text">SkillMap</span>
        </div>

        <div className="gateway-content">
          <div className="gateway-spinner" />
          <h2 className="gateway-title">Secure Portal Connection</h2>
          <p className="gateway-status">Establishing encrypted handshake with identity node...</p>
          <span className="gateway-footer">SkillMap Security Protocol v2.84</span>
        </div>
      </div>
    </div>
  );
}
