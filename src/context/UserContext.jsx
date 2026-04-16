import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveUserProfile, loadUserProfile, saveSkillProgress, loadSkillProgress } from '../utils/storage';
import { JOB_SKILLS_DB } from '../data/jobSkillsDB';

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  academicQualifications: [{ degree: '', field: '', year: '', institution: '' }],
  careerInterests: [],
  skills: [],
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => loadUserProfile() || DEFAULT_PROFILE);
  const [skillProgress, setSkillProgress] = useState(() => loadSkillProgress());
  const [hasProfile, setHasProfile] = useState(() => !!loadUserProfile()?.careerInterests?.length);

  // Persist on profile change
  useEffect(() => {
    if (profile.careerInterests?.length || profile.skills?.length) {
      saveUserProfile(profile);
      setHasProfile(true);
    }
  }, [profile]);

  // Persist on progress change
  useEffect(() => {
    saveSkillProgress(skillProgress);
  }, [skillProgress]);

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const saveProfile = useCallback((data) => {
    setProfile(data);
    saveUserProfile(data);
    setHasProfile(true);
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setSkillProgress({});
    setHasProfile(false);
    localStorage.removeItem('skillmap_user_profile');
    localStorage.removeItem('skillmap_skill_progress');
  }, []);

  // Get selected job profiles from DB
  const selectedJobs = JOB_SKILLS_DB.filter(j => profile.careerInterests?.includes(j.jobTitle));

  // Skill progress actions
  const updateSkillStatus = useCallback((skillName, status) => {
    setSkillProgress(prev => ({ ...prev, [skillName]: { ...prev[skillName], status } }));
  }, []);

  const updateSkillLevel = useCallback((skillName, level) => {
    // Also update in profile skills if it exists there
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.skillName.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
      ),
    }));
  }, []);

  const addMasteredSkill = useCallback((skillName, level = 'Beginner') => {
    setProfile(prev => {
      const exists = prev.skills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());
      if (exists) return prev;
      return { ...prev, skills: [...prev.skills, { skillName, level }] };
    });
  }, []);

  const removeSkill = useCallback((skillName) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillName.toLowerCase() !== skillName.toLowerCase()),
    }));
  }, []);

  return (
    <UserContext.Provider value={{
      profile,
      selectedJobs,
      hasProfile,
      skillProgress,
      updateProfile,
      saveProfile,
      resetProfile,
      updateSkillStatus,
      updateSkillLevel,
      addMasteredSkill,
      removeSkill,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
