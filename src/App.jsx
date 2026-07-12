import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProfileForm from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import MindMap from './pages/MindMap';
import GamificationHub from './pages/GamificationHub';
import LearnPage from './pages/LearnPage';
import ChallengesPage from './pages/ChallengesPage';
import CertificatesPage from './pages/CertificatesPage';

// ── Auth guard: redirect to /login if not signed in ──────────
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a12',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ── Redirect signed-in users away from /login ─────────────────
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />

          {/* Protected */}
          <Route path="/profile" element={
            <RequireAuth>
              <UserProvider><Navbar /><ProfileForm /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/dashboard" element={
            <RequireAuth>
              <UserProvider><Navbar /><Dashboard /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/roadmap" element={
            <RequireAuth>
              <UserProvider><Navbar /><Roadmap /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/mindmap" element={
            <RequireAuth>
              <UserProvider><Navbar /><MindMap /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/hub" element={
            <RequireAuth>
              <UserProvider><Navbar /><GamificationHub /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/learn" element={
            <RequireAuth>
              <UserProvider><Navbar /><LearnPage /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/challenges" element={
            <RequireAuth>
              <UserProvider><Navbar /><ChallengesPage /></UserProvider>
            </RequireAuth>
          } />
          <Route path="/certificates" element={
            <RequireAuth>
              <UserProvider><Navbar /><CertificatesPage /></UserProvider>
            </RequireAuth>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
