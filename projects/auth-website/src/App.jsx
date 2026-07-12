import React, { useState, useEffect } from 'react';
import insforge from './lib/insforge';
import './App.css';

const VIEW = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  VERIFY: 'verify',
  FORGOT: 'forgot',
  RESET: 'reset',
  OAUTH_REDIRECTING: 'oauth_redirecting',
};

export default function App() {
  const [view, setView] = useState(VIEW.SIGN_IN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Parse redirect and provider from URL
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect') || 'http://localhost:5173/dashboard';
  const initialProvider = urlParams.get('provider');

  useEffect(() => {
    // If a provider is specified in the URL, automatically start the OAuth flow
    if (initialProvider) {
      handleOAuth(initialProvider);
    }
  }, [initialProvider]);

  const clearState = () => {
    setError('');
    setSuccess('');
  };

  // ── OAuth Sign In ───────────────────────────────────────────
  const handleOAuth = async (provider) => {
    clearState();
    setLoading(true);
    setView(VIEW.OAUTH_REDIRECTING);
    try {
      console.log(`Initiating OAuth sign-in for: ${provider}, redirecting back to: ${redirectTarget}`);
      const { data, error } = await insforge.auth.signInWithOAuth(provider, {
        redirectTo: redirectTarget,
      });
      if (error) {
        setError(error.message);
        setView(VIEW.SIGN_IN);
        setLoading(false);
      } else if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to initiate login provider redirect.');
        setView(VIEW.SIGN_IN);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during OAuth redirect.');
      setView(VIEW.SIGN_IN);
      setLoading(false);
    }
  };

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    try {
      const { data, error: authError } = await insforge.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else if (data?.accessToken) {
        setSuccess('Authentication successful! Redirecting...');
        // Append access token to redirect URL
        const redirectUrl = new URL(redirectTarget);
        redirectUrl.searchParams.set('insforge_access_token', data.accessToken);
        window.location.href = redirectUrl.toString();
      } else {
        setError('No access token returned from server.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
      setLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearState();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: authError } = await insforge.auth.signUp({ email, password, name });
      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else if (data?.requireEmailVerification) {
        setSuccess(`Verification code sent to ${email}. Check your inbox.`);
        setView(VIEW.VERIFY);
        setLoading(false);
      } else if (data?.accessToken) {
        setSuccess('Account created successfully! Redirecting...');
        const redirectUrl = new URL(redirectTarget);
        redirectUrl.searchParams.set('insforge_access_token', data.accessToken);
        window.location.href = redirectUrl.toString();
      } else {
        setSuccess('Signup successful! Check email or sign in.');
        setView(VIEW.SIGN_IN);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  // ── Verify Email OTP ─────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    try {
      const { data, error: authError } = await insforge.auth.verifyEmail({ email, otp });
      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else if (data?.accessToken) {
        setSuccess('Email verified successfully! Redirecting...');
        const redirectUrl = new URL(redirectTarget);
        redirectUrl.searchParams.set('insforge_access_token', data.accessToken);
        window.location.href = redirectUrl.toString();
      } else {
        setSuccess('Email verified successfully! You can now sign in.');
        setView(VIEW.SIGN_IN);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify code.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clearState();
    setLoading(true);
    try {
      const { error: authError } = await insforge.auth.resendVerificationEmail({ email });
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess('Verification code resent! Check your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
      setLoading(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    try {
      const { error: authError } = await insforge.auth.sendResetPasswordEmail({ email });
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        setSuccess(`Reset code sent to ${email}.`);
        setView(VIEW.RESET);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
      setLoading(false);
    }
  };

  // ── Reset Password ───────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    clearState();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      // Step 1: exchange code for token
      const { data: tokenData, error: tokenError } = await insforge.auth.exchangeResetPasswordToken({
        email,
        code: otp,
      });
      if (tokenError) {
        setError(tokenError.message);
        setLoading(false);
        return;
      }
      // Step 2: reset password
      const { error: resetError } = await insforge.auth.resetPassword({
        newPassword,
        otp: tokenData.token,
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess('Password updated! Please sign in.');
        setView(VIEW.SIGN_IN);
        setOtp('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
      setLoading(false);
    }
  };

  return (
    <div className="login-portal">
      {/* Aurora Background Orbs */}
      <div className="portal-orb portal-orb--1" />
      <div className="portal-orb portal-orb--2" />
      <div className="portal-orb portal-orb--3" />
      <div className="portal-grid" />

      <div className="portal-card">
        {/* Logo */}
        <div className="portal-logo">
          <span className="portal-logo__icon">⚡</span>
          <span className="portal-logo__text">Skill<span className="text-gradient">Map</span></span>
        </div>

        {/* Global Loading Spinner / Status for Automatic Redirection */}
        {view === VIEW.OAUTH_REDIRECTING && (
          <div className="portal-loading-screen">
            <div className="portal-spinner" />
            <h2 className="portal-title" style={{ marginTop: 24 }}>Connecting Identity</h2>
            <p className="portal-subtitle">Redirecting to login provider securely...</p>
            {error && <div className="portal-error" style={{ marginTop: 16 }}>{error}</div>}
          </div>
        )}

        {/* ── SIGN IN ── */}
        {view === VIEW.SIGN_IN && (
          <>
            <div className="portal-header">
              <h1 className="portal-title">Secure Portal</h1>
              <p className="portal-subtitle">Access your cybernetic learning nodes</p>
            </div>
            <form className="portal-form" onSubmit={handleSignIn}>
              <div className="portal-field">
                <label htmlFor="signin-email">Neural Address (Email)</label>
                <input id="signin-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="portal-field">
                <label htmlFor="signin-password">Access Cipher (Password)</label>
                <div className="portal-password-wrap">
                  <input id="signin-password" type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="portal-eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="button" className="portal-link portal-link--right"
                onClick={() => { clearState(); setView(VIEW.FORGOT); }}>
                Forgot cipher?
              </button>
              
              {error && <div className="portal-error">{error}</div>}
              {success && <div className="portal-success">{success}</div>}
              
              <button className="portal-btn" type="submit" disabled={loading}>
                {loading ? <span className="portal-spinner-btn" /> : 'Decrypt & Sign In'}
              </button>
            </form>
            
            <div className="portal-divider">or synchronize via</div>
            <div className="portal-oauth-group">
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('google')} disabled={loading}>
                <span className="portal-oauth-icon">🌐</span> Google
              </button>
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('github')} disabled={loading}>
                <span className="portal-oauth-icon">🐙</span> GitHub
              </button>
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('facebook')} disabled={loading}>
                <span className="portal-oauth-icon">📘</span> Facebook
              </button>
            </div>
            
            <p className="portal-toggle">
              New node operator?{' '}
              <button className="portal-link" onClick={() => { clearState(); setView(VIEW.SIGN_UP); }}>
                Initialize Account
              </button>
            </p>
          </>
        )}

        {/* ── SIGN UP ── */}
        {view === VIEW.SIGN_UP && (
          <>
            <div className="portal-header">
              <h1 className="portal-title">Initialize Node</h1>
              <p className="portal-subtitle">Register your cryptographic access</p>
            </div>
            <form className="portal-form" onSubmit={handleSignUp}>
              <div className="portal-field">
                <label htmlFor="signup-name">Operator Name</label>
                <input id="signup-name" type="text" placeholder="Jane Doe" value={name}
                  onChange={e => setName(e.target.value)} required />
              </div>
              <div className="portal-field">
                <label htmlFor="signup-email">Neural Address (Email)</label>
                <input id="signup-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="portal-field">
                <label htmlFor="signup-password">Access Cipher (Password)</label>
                <div className="portal-password-wrap">
                  <input id="signup-password" type={showPassword ? 'text' : 'password'}
                    placeholder="min. 6 characters" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="portal-eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="portal-field">
                <label htmlFor="signup-confirm">Verify Cipher</label>
                <input id="signup-confirm" type={showPassword ? 'text' : 'password'}
                  placeholder="repeat password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              
              {error && <div className="portal-error">{error}</div>}
              {success && <div className="portal-success">{success}</div>}

              <button className="portal-btn" type="submit" disabled={loading}>
                {loading ? <span className="portal-spinner-btn" /> : 'Provision Node'}
              </button>
            </form>
            
            <div className="portal-divider">or synchronize via</div>
            <div className="portal-oauth-group">
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('google')} disabled={loading}>
                <span className="portal-oauth-icon">🌐</span> Google
              </button>
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('github')} disabled={loading}>
                <span className="portal-oauth-icon">🐙</span> GitHub
              </button>
              <button type="button" className="portal-oauth-btn" onClick={() => handleOAuth('facebook')} disabled={loading}>
                <span className="portal-oauth-icon">📘</span> Facebook
              </button>
            </div>
            
            <p className="portal-toggle">
              Already registered?{' '}
              <button className="portal-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                Decrypt Session
              </button>
            </p>
          </>
        )}

        {/* ── VERIFY EMAIL ── */}
        {view === VIEW.VERIFY && (
          <>
            <div className="portal-header">
              <div className="portal-verify-icon">📧</div>
              <h1 className="portal-title">Address Verification</h1>
              <p className="portal-subtitle">Enter the 6-digit decrypt key sent to<br /><strong>{email}</strong></p>
            </div>
            <form className="portal-form" onSubmit={handleVerify}>
              <div className="portal-field">
                <label htmlFor="verify-otp">Verification Cipher Key</label>
                <input id="verify-otp" type="text" inputMode="numeric" maxLength={6}
                  placeholder="123456" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required
                  className="portal-otp-input" />
              </div>
              
              {error && <div className="portal-error">{error}</div>}
              {success && <div className="portal-success">{success}</div>}
              
              <button className="portal-btn" type="submit" disabled={loading}>
                {loading ? <span className="portal-spinner-btn" /> : 'Confirm Verification'}
              </button>
              <button type="button" className="portal-btn portal-btn--ghost" onClick={handleResend} disabled={loading}>
                Resend Code
              </button>
            </form>
            <p className="portal-toggle">
              Wrong address?{' '}
              <button className="portal-link" onClick={() => { clearState(); setView(VIEW.SIGN_UP); }}>
                Correct Email
              </button>
            </p>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {view === VIEW.FORGOT && (
          <>
            <div className="portal-header">
              <h1 className="portal-title">Reset Cipher</h1>
              <p className="portal-subtitle">Enter your neural address to receive a reset key</p>
            </div>
            <form className="portal-form" onSubmit={handleForgot}>
              <div className="portal-field">
                <label htmlFor="forgot-email">Neural Address (Email)</label>
                <input id="forgot-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              
              {error && <div className="portal-error">{error}</div>}
              {success && <div className="portal-success">{success}</div>}
              
              <button className="portal-btn" type="submit" disabled={loading}>
                {loading ? <span className="portal-spinner-btn" /> : 'Transmit Reset Key'}
              </button>
            </form>
            <p className="portal-toggle">
              <button className="portal-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                ← Abort & Return
              </button>
            </p>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {view === VIEW.RESET && (
          <>
            <div className="portal-header">
              <h1 className="portal-title">New Access Cipher</h1>
              <p className="portal-subtitle">Input the reset key and configure a new cipher</p>
            </div>
            <form className="portal-form" onSubmit={handleReset}>
              <div className="portal-field">
                <label htmlFor="reset-otp">Reset Key</label>
                <input id="reset-otp" type="text" inputMode="numeric" maxLength={6}
                  placeholder="123456" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required
                  className="portal-otp-input" />
              </div>
              <div className="portal-field">
                <label htmlFor="reset-password">New Access Cipher</label>
                <input id="reset-password" type="password" placeholder="min. 6 characters"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              
              {error && <div className="portal-error">{error}</div>}
              {success && <div className="portal-success">{success}</div>}

              <button className="portal-btn" type="submit" disabled={loading}>
                {loading ? <span className="portal-spinner-btn" /> : 'Overwrite Cipher'}
              </button>
            </form>
            <p className="portal-toggle">
              <button className="portal-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                ← Abort & Return
              </button>
            </p>
          </>
        )}
        
        {/* Footer info/abort */}
        {view !== VIEW.OAUTH_REDIRECTING && (
          <div className="portal-abort-footer">
            <a href={new URL(redirectTarget).origin} className="portal-abort-link">
              ← Return to SkillMap Node
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
