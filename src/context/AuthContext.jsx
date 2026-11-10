import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import insforge from '../lib/insforge';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // On mount — restore session from httpOnly cookie or URL query parameter
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Parse token from URL if redirected from auth website
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('insforge_access_token');
        if (urlToken) {
          console.log('Detected access token in callback URL, setting session...');
          insforge.setAccessToken(urlToken);
          // Clean the access token parameter from the browser address bar
          urlParams.delete('insforge_access_token');
          const newSearch = urlParams.toString();
          const cleanUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        const userPromise = insforge.auth.getCurrentUser();
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ data: null }), 1000));
        const res = await Promise.race([userPromise, timeoutPromise]);
        const data = res?.data;
        setUser(data?.user ?? null);
      } catch (err) {
        console.error('Failed to restore session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Sign Up ──────────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, name }) => {
    setAuthError(null);
    const { data, error } = await insforge.auth.signUp({ email, password, name });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    if (data?.requireEmailVerification) {
      // OTP code sent — caller should navigate to /verify-email
      return { data, requireVerification: true };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { data };
  }, []);

  // ── Sign In ──────────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }) => {
    setAuthError(null);
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { data };
  }, []);

  // ── Verify Email OTP ─────────────────────────────────────────
  const verifyEmail = useCallback(async ({ email, otp }) => {
    setAuthError(null);
    const { data, error } = await insforge.auth.verifyEmail({ email, otp });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    if (data?.user) {
      setUser(data.user);
    }
    return { data };
  }, []);

  // ── Resend Verification ──────────────────────────────────────
  const resendVerification = useCallback(async ({ email }) => {
    setAuthError(null);
    const { data, error } = await insforge.auth.resendVerificationEmail({ email });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    return { data };
  }, []);

  // ── Forgot Password ──────────────────────────────────────────
  const sendResetEmail = useCallback(async ({ email }) => {
    setAuthError(null);
    const { data, error } = await insforge.auth.sendResetPasswordEmail({ email });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    return { data };
  }, []);

  const resetPassword = useCallback(async ({ email, code, newPassword }) => {
    setAuthError(null);
    // Step 1: exchange code for token
    const { data: tokenData, error: tokenError } = await insforge.auth.exchangeResetPasswordToken({
      email,
      code,
    });
    if (tokenError) {
      setAuthError(tokenError.message);
      return { error: tokenError };
    }
    // Step 2: reset password using the token
    const { data, error } = await insforge.auth.resetPassword({
      newPassword,
      otp: tokenData.token,
    });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    return { data };
  }, []);

  // ── Sign Out ─────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await insforge.auth.signOut();
    setUser(null);
  }, []);

  // ── Update InsForge profile fields ───────────────────────────
  const updateInsforgeProfile = useCallback(async (fields) => {
    const { data, error } = await insforge.auth.setProfile(fields);
    if (!error && data) {
      setUser(prev => prev ? { ...prev, profile: { ...prev.profile, ...fields } } : prev);
    }
    return { data, error };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      isAuthenticated: !!user,
      signUp,
      signIn,
      verifyEmail,
      resendVerification,
      sendResetEmail,
      resetPassword,
      signOut,
      updateInsforgeProfile,
      insforge,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
