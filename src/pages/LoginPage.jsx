import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

// ── Views ─────────────────────────────────────────────────────
const VIEW = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  VERIFY: 'verify',
  FORGOT: 'forgot',
  RESET: 'reset',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, verifyEmail, resendVerification, sendResetEmail, resetPassword, authError, insforge } = useAuth();

  const [view, setView] = useState(VIEW.SIGN_IN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const err = localError || authError;

  const clearState = () => {
    setLocalError('');
    setSuccessMsg('');
  };

  // ── OAuth Sign In ───────────────────────────────────────────
  const handleOAuthSignIn = async (provider) => {
    clearState();
    setLoading(true);
    const redirectTo = `${window.location.origin}/dashboard`;
    const { data, error } = await insforge.auth.signInWithOAuth(provider, { redirectTo });
    setLoading(false);
    if (error) {
      setLocalError(error.message);
    } else if (data?.url) {
      window.location.href = data.url;
    }
  };

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (!error) navigate('/dashboard');
  };

  // ── Sign Up ──────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearState();
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error, requireVerification } = await signUp({ email, password, name });
    setLoading(false);
    if (!error) {
      if (requireVerification) {
        setSuccessMsg(`A 6-digit code was sent to ${email}. Enter it below.`);
        setView(VIEW.VERIFY);
      } else {
        navigate('/dashboard');
      }
    }
  };

  // ── Verify Email OTP ─────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    const { error } = await verifyEmail({ email, otp });
    setLoading(false);
    if (!error) navigate('/dashboard');
  };

  const handleResend = async () => {
    clearState();
    setLoading(true);
    const { error } = await resendVerification({ email });
    setLoading(false);
    if (!error) setSuccessMsg('Verification code resent! Check your inbox.');
  };

  // ── Forgot Password ──────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    const { error } = await sendResetEmail({ email });
    setLoading(false);
    if (!error) {
      setSuccessMsg(`Reset code sent to ${email}.`);
      setView(VIEW.RESET);
    }
  };

  // ── Reset Password ───────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    clearState();
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword({ email, code: otp, newPassword });
    setLoading(false);
    if (!error) {
      setSuccessMsg('Password reset! Please sign in with your new password.');
      setView(VIEW.SIGN_IN);
      setOtp('');
      setNewPassword('');
    }
  };

  return (
    <div className="login-page">
      {/* Background Orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__icon">🗺️</span>
          <span className="login-logo__text">SkillMap</span>
        </div>

        {/* ── SIGN IN ── */}
        {view === VIEW.SIGN_IN && (
          <>
            <div className="login-header">
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">Sign in to continue your learning journey</p>
            </div>
            <form className="login-form" onSubmit={handleSignIn}>
              <div className="login-field">
                <label htmlFor="signin-email">Email</label>
                <input id="signin-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="login-field">
                <label htmlFor="signin-password">Password</label>
                <div className="login-password-wrap">
                  <input id="signin-password" type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="login-eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="button" className="login-link login-link--right"
                onClick={() => { clearState(); setView(VIEW.FORGOT); }}>
                Forgot password?
              </button>
              {err && <div className="login-error">{err}</div>}
              {successMsg && <div className="login-success">{successMsg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Sign In'}
              </button>
            </form>
            <div className="login-divider">or continue with</div>
            <div className="login-oauth-group">
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('google')} disabled={loading}>
                <span className="login-oauth-icon">🌐</span> Google
              </button>
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('github')} disabled={loading}>
                <span className="login-oauth-icon">🐙</span> GitHub
              </button>
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('facebook')} disabled={loading}>
                <span className="login-oauth-icon">📘</span> Facebook
              </button>
            </div>
            <p className="login-toggle">
              Don&apos;t have an account?{' '}
              <button className="login-link" onClick={() => { clearState(); setView(VIEW.SIGN_UP); }}>
                Create one
              </button>
            </p>
          </>
        )}

        {/* ── SIGN UP ── */}
        {view === VIEW.SIGN_UP && (
          <>
            <div className="login-header">
              <h1 className="login-title">Create account</h1>
              <p className="login-subtitle">Start mapping your skills today</p>
            </div>
            <form className="login-form" onSubmit={handleSignUp}>
              <div className="login-field">
                <label htmlFor="signup-name">Full Name</label>
                <input id="signup-name" type="text" placeholder="Jane Doe" value={name}
                  onChange={e => setName(e.target.value)} required />
              </div>
              <div className="login-field">
                <label htmlFor="signup-email">Email</label>
                <input id="signup-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="login-field">
                <label htmlFor="signup-password">Password</label>
                <div className="login-password-wrap">
                  <input id="signup-password" type={showPassword ? 'text' : 'password'}
                    placeholder="min. 6 characters" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="login-eye" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="login-field">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input id="signup-confirm" type={showPassword ? 'text' : 'password'}
                  placeholder="repeat password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              {err && <div className="login-error">{err}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Create Account'}
              </button>
            </form>
            <div className="login-divider">or continue with</div>
            <div className="login-oauth-group">
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('google')} disabled={loading}>
                <span className="login-oauth-icon">🌐</span> Google
              </button>
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('github')} disabled={loading}>
                <span className="login-oauth-icon">🐙</span> GitHub
              </button>
              <button type="button" className="login-oauth-btn" onClick={() => handleOAuthSignIn('facebook')} disabled={loading}>
                <span className="login-oauth-icon">📘</span> Facebook
              </button>
            </div>
            <p className="login-toggle">
              Already have an account?{' '}
              <button className="login-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                Sign in
              </button>
            </p>
          </>
        )}

        {/* ── VERIFY EMAIL ── */}
        {view === VIEW.VERIFY && (
          <>
            <div className="login-header">
              <div className="login-verify-icon">📧</div>
              <h1 className="login-title">Verify your email</h1>
              <p className="login-subtitle">Enter the 6-digit code sent to<br /><strong>{email}</strong></p>
            </div>
            <form className="login-form" onSubmit={handleVerify}>
              <div className="login-field">
                <label htmlFor="verify-otp">Verification Code</label>
                <input id="verify-otp" type="text" inputMode="numeric" maxLength={6}
                  placeholder="123456" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required
                  className="login-otp-input" />
              </div>
              {err && <div className="login-error">{err}</div>}
              {successMsg && <div className="login-success">{successMsg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Verify Email'}
              </button>
              <button type="button" className="login-btn login-btn--ghost" onClick={handleResend} disabled={loading}>
                Resend Code
              </button>
            </form>
            <p className="login-toggle">
              Wrong email?{' '}
              <button className="login-link" onClick={() => { clearState(); setView(VIEW.SIGN_UP); }}>
                Go back
              </button>
            </p>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {view === VIEW.FORGOT && (
          <>
            <div className="login-header">
              <h1 className="login-title">Reset password</h1>
              <p className="login-subtitle">We&apos;ll email you a 6-digit reset code</p>
            </div>
            <form className="login-form" onSubmit={handleForgot}>
              <div className="login-field">
                <label htmlFor="forgot-email">Email</label>
                <input id="forgot-email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              {err && <div className="login-error">{err}</div>}
              {successMsg && <div className="login-success">{successMsg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Send Reset Code'}
              </button>
            </form>
            <p className="login-toggle">
              <button className="login-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                ← Back to sign in
              </button>
            </p>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {view === VIEW.RESET && (
          <>
            <div className="login-header">
              <h1 className="login-title">New password</h1>
              <p className="login-subtitle">Enter the code from your email and set a new password</p>
            </div>
            <form className="login-form" onSubmit={handleReset}>
              <div className="login-field">
                <label htmlFor="reset-otp">Reset Code</label>
                <input id="reset-otp" type="text" inputMode="numeric" maxLength={6}
                  placeholder="123456" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required
                  className="login-otp-input" />
              </div>
              <div className="login-field">
                <label htmlFor="reset-password">New Password</label>
                <input id="reset-password" type="password" placeholder="min. 6 characters"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              {err && <div className="login-error">{err}</div>}
              {successMsg && <div className="login-success">{successMsg}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : 'Reset Password'}
              </button>
            </form>
            <p className="login-toggle">
              <button className="login-link" onClick={() => { clearState(); setView(VIEW.SIGN_IN); }}>
                ← Back to sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
