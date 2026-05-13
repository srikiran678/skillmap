import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfileForm from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import MindMap from './pages/MindMap';

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
          <Route path="*" element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
