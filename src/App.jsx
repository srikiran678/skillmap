import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfileForm from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import MindMap from './pages/MindMap';
import GamificationHub from './pages/GamificationHub';
import LearnPage from './pages/LearnPage';
import ChallengesPage from './pages/ChallengesPage';
import CertificatesPage from './pages/CertificatesPage';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/hub" element={<GamificationHub />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
