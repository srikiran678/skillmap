import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  saveUserProfile, loadUserProfile,
  saveSkillProgress, loadSkillProgress,
  saveGamification, loadGamification,
  saveDailyQuests, loadDailyQuests,
  saveChatHistory, loadChatHistory,
} from '../utils/storage';
import { JOB_SKILLS_DB } from '../data/jobSkillsDB';
import {
  checkStreakStatus,
  generateDailyQuests,
  getTodayDateString,
  checkNewAchievements,
  ACHIEVEMENT_DEFINITIONS,
} from '../utils/gamificationEngine';
import { useAuth } from './AuthContext';
import insforge from '../lib/insforge';

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  academicQualifications: [{ degree: '', field: '', year: '', institution: '' }],
  careerInterests: [],
  skills: [],
  xp: 0,
  badges: [],
  // Gamification
  coins: 50, // start with 50 coins
  streak_current: 0,
  streak_last_date: null,
  streak_freezes: 0,
  weekly_xp: 0,
  week_start: getTodayDateString(),
  // Stats for achievements
  questsCompleted: 0,
  purchases: 0,
  coinsSpent: 0,
  focusSessions: 0,
  aiMessages: 0,
  freezesUsed: 0,
  // Inventory & achievements
  inventory: [],
  earnedAchievementIds: [],
};

const DEFAULT_GAMIFICATION = {
  // separate from profile for faster access
  activeTheme: 'default',
  activeAvatar: '🧑‍💻',
};

// ── Quest refresh helper ──────────────────────────────────────
const getOrRefreshQuests = () => {
  const today = getTodayDateString();
  const saved = loadDailyQuests();
  if (saved && saved.date === today) return saved.quests;
  const fresh = generateDailyQuests();
  saveDailyQuests(fresh, today);
  return fresh;
};

// ── Weekly XP reset helper ────────────────────────────────────
const getWeekStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => loadUserProfile() || DEFAULT_PROFILE);
  const [skillProgress, setSkillProgress] = useState(() => loadSkillProgress());
  const [hasProfile, setHasProfile] = useState(() => !!loadUserProfile()?.careerInterests?.length);
  const [gamification, setGamification] = useState(() => loadGamification() || DEFAULT_GAMIFICATION);
  const [dailyQuests, setDailyQuests] = useState(() => getOrRefreshQuests());
  const [chatHistory, setChatHistory] = useState(() => loadChatHistory());

  // ── Load cloud data on sign-in ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    const loadFromCloud = async () => {
      try {
        // Load profile
        const { data: rows } = await insforge.database
          .from('skillmap_profiles')
          .select()
          .eq('user_id', user.id)
          .maybeSingle();
        if (rows) {
          const cloudProfile = {
            name: rows.name || '',
            email: rows.email || user.email || '',
            academicQualifications: rows.academic_qualifications || DEFAULT_PROFILE.academicQualifications,
            careerInterests: rows.career_interests || [],
            skills: rows.skills || [],
            xp: rows.xp || 0,
            badges: rows.badges || [],
            coins: rows.coins ?? 50,
            streak_current: rows.streak_current || 0,
            streak_last_date: rows.streak_last_date || null,
            streak_freezes: rows.streak_freezes || 0,
            weekly_xp: rows.weekly_xp || 0,
            week_start: rows.week_start || getTodayDateString(),
            questsCompleted: rows.quests_completed || 0,
            purchases: rows.purchases || 0,
            coinsSpent: rows.coins_spent || 0,
            focusSessions: rows.focus_sessions || 0,
            aiMessages: rows.ai_messages || 0,
            freezesUsed: rows.freezes_used || 0,
            inventory: rows.inventory || [],
            earnedAchievementIds: rows.earned_achievement_ids || [],
          };
          setProfile(cloudProfile);
          saveUserProfile(cloudProfile);
          setHasProfile(!!(cloudProfile.careerInterests?.length || cloudProfile.name));
        } else if (loadUserProfile()) {
          // Migrate existing localStorage data to cloud
          const local = loadUserProfile();
          if (local) upsertProfileToCloud(user.id, local);
        }

        // Load skill progress
        const { data: spRows } = await insforge.database
          .from('skillmap_skill_progress')
          .select()
          .eq('user_id', user.id);
        if (spRows?.length) {
          const sp = {};
          spRows.forEach(r => { sp[r.skill_name] = { status: r.status }; });
          setSkillProgress(sp);
          saveSkillProgress(sp);
        }

        // Load gamification prefs
        const { data: gRow } = await insforge.database
          .from('skillmap_gamification')
          .select()
          .eq('user_id', user.id)
          .maybeSingle();
        if (gRow) {
          const g = { activeTheme: gRow.active_theme || 'default', activeAvatar: gRow.active_avatar || '🧑\u200d💻' };
          setGamification(g);
          saveGamification(g);
        }

        // Load daily quests
        const today = getTodayDateString();
        const { data: qRow } = await insforge.database
          .from('skillmap_daily_quests')
          .select()
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();
        if (qRow?.quests) {
          setDailyQuests(qRow.quests);
          saveDailyQuests(qRow.quests, today);
        }
      } catch (err) {
        console.warn('[SkillMap] Cloud load failed, using local cache:', err);
      }
    };
    loadFromCloud();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Cloud upsert helpers ─────────────────────────────────────
  const upsertProfileToCloud = useCallback(async (userId, profileData) => {
    if (!userId) return;
    await insforge.database
      .from('skillmap_profiles')
      .upsert([{
        user_id: userId,
        name: profileData.name || '',
        email: profileData.email || '',
        academic_qualifications: profileData.academicQualifications || [],
        career_interests: profileData.careerInterests || [],
        skills: profileData.skills || [],
        xp: profileData.xp || 0,
        badges: profileData.badges || [],
        coins: profileData.coins ?? 50,
        streak_current: profileData.streak_current || 0,
        streak_last_date: profileData.streak_last_date || null,
        streak_freezes: profileData.streak_freezes || 0,
        weekly_xp: profileData.weekly_xp || 0,
        week_start: profileData.week_start || getTodayDateString(),
        quests_completed: profileData.questsCompleted || 0,
        purchases: profileData.purchases || 0,
        coins_spent: profileData.coinsSpent || 0,
        focus_sessions: profileData.focusSessions || 0,
        ai_messages: profileData.aiMessages || 0,
        freezes_used: profileData.freezesUsed || 0,
        inventory: profileData.inventory || [],
        earned_achievement_ids: profileData.earnedAchievementIds || [],
        updated_at: new Date().toISOString(),
      }]);
  }, []);

  const upsertGamificationToCloud = useCallback(async (userId, g) => {
    if (!userId) return;
    await insforge.database
      .from('skillmap_gamification')
      .upsert([{ user_id: userId, active_theme: g.activeTheme, active_avatar: g.activeAvatar }]);
  }, []);

  const upsertQuestsToCloud = useCallback(async (userId, quests, date) => {
    if (!userId) return;
    await insforge.database
      .from('skillmap_daily_quests')
      .upsert([{ user_id: userId, date, quests }]);
  }, []);
  // Track completed lessons and challenges globally
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillmap_completed_lessons') || '{}');
    } catch {
      return {};
    }
  });
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillmap_completed_challenges') || '{}');
    } catch {
      return {};
    }
  });
  // For achievement toast notifications
  const [newAchievements, setNewAchievements] = useState([]);

  // Persist profile (localStorage + debounced cloud)
  useEffect(() => {
    if (profile.careerInterests?.length || profile.skills?.length || profile.name) {
      saveUserProfile(profile);
      const nextHasProfile = !!(profile.careerInterests?.length || profile.name);
      if (hasProfile !== nextHasProfile) {
        setTimeout(() => setHasProfile(nextHasProfile), 0);
      }
      // Debounce cloud upsert
      const t = setTimeout(() => {
        if (user?.id) upsertProfileToCloud(user.id, profile);
      }, 1500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, hasProfile, user?.id]);

  // Persist skill progress
  useEffect(() => {
    saveSkillProgress(skillProgress);
    // Debounce skill progress cloud upsert
    if (user?.id && Object.keys(skillProgress).length) {
      const t = setTimeout(async () => {
        const rows = Object.entries(skillProgress).map(([skill_name, val]) => ({
          user_id: user.id,
          skill_name,
          status: val.status,
          updated_at: new Date().toISOString(),
        }));
        // Delete old rows and re-insert (simplest upsert for skill list)
        await insforge.database.from('skillmap_skill_progress')
          .delete().eq('user_id', user.id);
        if (rows.length) {
          await insforge.database.from('skillmap_skill_progress').insert(rows);
        }
      }, 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillProgress, user?.id]);

  // Persist gamification (localStorage + cloud)
  useEffect(() => {
    saveGamification(gamification);
    const t = setTimeout(() => {
      if (user?.id) upsertGamificationToCloud(user.id, gamification);
    }, 1500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamification, user?.id]);

  // Persist quests (localStorage + cloud)
  useEffect(() => {
    const today = getTodayDateString();
    saveDailyQuests(dailyQuests, today);
    const t = setTimeout(() => {
      if (user?.id) upsertQuestsToCloud(user.id, dailyQuests, today);
    }, 1500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyQuests, user?.id]);

  // Persist chat
  useEffect(() => {
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  // Persist completed lessons
  useEffect(() => {
    localStorage.setItem('skillmap_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Persist completed challenges
  useEffect(() => {
    localStorage.setItem('skillmap_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  // ── Achievement checker ──────────────────────────────────────
  const triggerAchievementCheck = useCallback((updatedProfile) => {
    const earnedIds = updatedProfile.earnedAchievementIds || [];
    const newIds = checkNewAchievements(updatedProfile, earnedIds);
    if (newIds.length > 0) {
      const newDefs = newIds.map(id => ACHIEVEMENT_DEFINITIONS.find(a => a.id === id)).filter(Boolean);
      setNewAchievements(prev => [...prev, ...newDefs]);
      setProfile(prev => ({
        ...prev,
        earnedAchievementIds: [...(prev.earnedAchievementIds || []), ...newIds],
      }));
      // Auto-clear after 5s
      setTimeout(() => setNewAchievements([]), 5000);
    }
  }, []);

  // ── Profile actions ──────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  const saveProfile = useCallback((data) => {
    const merged = { ...DEFAULT_PROFILE, ...data };
    setProfile(merged);
    saveUserProfile(merged);
    setHasProfile(true);
    triggerAchievementCheck(merged);
  }, [triggerAchievementCheck]);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setSkillProgress({});
    setHasProfile(false);
    setDailyQuests(generateDailyQuests());
    setChatHistory([]);
    setCompletedLessons({});
    setCompletedChallenges({});
    localStorage.removeItem('skillmap_user_profile');
    localStorage.removeItem('skillmap_skill_progress');
    localStorage.removeItem('skillmap_gamification');
    localStorage.removeItem('skillmap_daily_quests');
    localStorage.removeItem('skillmap_chat_history');
    localStorage.removeItem('skillmap_completed_lessons');
    localStorage.removeItem('skillmap_completed_challenges');
  }, []);

  // ── Skill actions ────────────────────────────────────────────
  const selectedJobs = profile.careerInterests?.map(title => {
    const found = JOB_SKILLS_DB.find(j => j.jobTitle === title);
    if (found) return found;
    return {
      jobTitle: title, domain: 'Custom', icon: '✨',
      description: 'Custom career goal', avgSalary: 'Variable', skillsRequired: [],
    };
  }) || [];

  const updateSkillStatus = useCallback((skillName, status) => {
    setSkillProgress(prev => ({ ...prev, [skillName]: { ...prev[skillName], status } }));
  }, []);

  const updateSkillLevel = useCallback((skillName, level) => {
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
      const next = { ...prev, skills: [...prev.skills, { skillName, level }] };
      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  const removeSkill = useCallback((skillName) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillName.toLowerCase() !== skillName.toLowerCase()),
    }));
  }, []);

  // ── XP & Coins ───────────────────────────────────────────────
  const addXP = useCallback((amount) => {
    setProfile(prev => {
      // Check if week changed
      const currentWeekStart = getWeekStart();
      const weekStart = prev.week_start || currentWeekStart;
      const weeklyXP = weekStart === currentWeekStart ? (prev.weekly_xp || 0) + amount : amount;
      const next = {
        ...prev,
        xp: (prev.xp || 0) + amount,
        weekly_xp: weeklyXP,
        week_start: currentWeekStart,
      };
      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  const addCoins = useCallback((amount) => {
    setProfile(prev => ({ ...prev, coins: (prev.coins || 0) + amount }));
  }, []);

  const awardBadge = useCallback((badge) => {
    setProfile(prev => {
      const badges = prev.badges || [];
      if (badges.includes(badge)) return prev;
      return { ...prev, badges: [...badges, badge] };
    });
  }, []);

  // ── Streak ───────────────────────────────────────────────────
  const extendStreak = useCallback(() => {
    setProfile(prev => {
      const status = checkStreakStatus(prev.streak_last_date);
      if (status === 'same_day') return prev; // already extended today

      const today = getTodayDateString();
      let newStreak;

      if (status === 'broken') {
        // Check if freeze available
        if ((prev.streak_freezes || 0) > 0) {
          // Freeze auto-applied (one-time forgiveness)
          newStreak = prev.streak_current;
          return {
            ...prev,
            streak_current: newStreak,
            streak_last_date: today,
            streak_freezes: prev.streak_freezes - 1,
            freezesUsed: (prev.freezesUsed || 0) + 1,
          };
        }
        newStreak = 1; // reset
      } else {
        newStreak = (prev.streak_current || 0) + 1;
      }

      const next = { ...prev, streak_current: newStreak, streak_last_date: today };
      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  const useStreakFreeze = useCallback(() => {
    setProfile(prev => {
      if ((prev.streak_freezes || 0) <= 0) return prev;
      const today = getTodayDateString();
      return {
        ...prev,
        streak_freezes: prev.streak_freezes - 1,
        streak_last_date: today,
        freezesUsed: (prev.freezesUsed || 0) + 1,
      };
    });
  }, []);

  // ── Store ────────────────────────────────────────────────────
  const purchaseItem = useCallback((item) => {
    setProfile(prev => {
      if ((prev.coins || 0) < item.cost) return prev; // not enough coins

      let updates = {
        coins: prev.coins - item.cost,
        purchases: (prev.purchases || 0) + 1,
        coinsSpent: (prev.coinsSpent || 0) + item.cost,
      };

      // Apply effect
      if (item.effect === 'streak_freeze') {
        updates.streak_freezes = (prev.streak_freezes || 0) + 1;
      } else if (item.effect === 'bundle_sprint') {
        updates.streak_freezes = (prev.streak_freezes || 0) + 2;
      } else if (item.effect === 'bundle_legend') {
        updates.streak_freezes = (prev.streak_freezes || 0) + 3;
      }

      // Add to inventory
      const inv = [...(prev.inventory || [])];
      const existingIdx = inv.findIndex(i => i.itemId === item.id);
      if (existingIdx >= 0) {
        inv[existingIdx] = { ...inv[existingIdx], quantity: inv[existingIdx].quantity + 1 };
      } else {
        inv.push({ itemId: item.id, quantity: 1, name: item.name, icon: item.icon });
      }
      updates.inventory = inv;

      const next = { ...prev, ...updates };

      // Apply theme/avatar immediately
      if (item.effect.startsWith('theme_') || item.effect.startsWith('avatar_')) {
        setGamification(g => ({ ...g, [item.effect.startsWith('theme_') ? 'activeTheme' : 'activeAvatar']: item.effect }));
      }

      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  // ── Quests ───────────────────────────────────────────────────
  const updateQuestProgress = useCallback((questId, progressDelta) => {
    setDailyQuests(prev => prev.map(q => {
      if (q.id !== questId || q.completed) return q;
      const newProgress = Math.min(q.goal, (q.progress || 0) + progressDelta);
      return { ...q, progress: newProgress, completed: newProgress >= q.goal };
    }));
  }, []);

  const claimQuestReward = useCallback((questId) => {
    setDailyQuests(prev => prev.map(q => {
      if (q.id !== questId || !q.completed || q.claimed) return q;
      // Award XP + coins
      addXP(q.reward_xp);
      addCoins(q.reward_coins);
      setProfile(p => {
        const next = { ...p, questsCompleted: (p.questsCompleted || 0) + 1 };
        triggerAchievementCheck(next);
        return next;
      });
      return { ...q, claimed: true };
    }));
  }, [addXP, addCoins, triggerAchievementCheck]);

  const markQuestVisit = useCallback((questId) => {
    updateQuestProgress(questId, 1);
  }, [updateQuestProgress]);

  // ── Chat ─────────────────────────────────────────────────────
  const addChatMessage = useCallback((message) => {
    setChatHistory(prev => [...prev, message]);
    // Track AI message count
    if (message.role === 'user') {
      setProfile(prev => {
        const next = { ...prev, aiMessages: (prev.aiMessages || 0) + 1 };
        triggerAchievementCheck(next);
        return next;
      });
    }
  }, [triggerAchievementCheck]);

  const trackFocusSession = useCallback(() => {
    setProfile(prev => {
      const next = { ...prev, focusSessions: (prev.focusSessions || 0) + 1 };
      triggerAchievementCheck(next);
      return next;
    });
  }, [triggerAchievementCheck]);

  const completeLesson = useCallback((lessonId, lessonXp) => {
    setCompletedLessons(prev => {
      if (prev[lessonId]?.completed) return prev;
      return {
        ...prev,
        [lessonId]: { completed: true, date: new Date().toISOString() }
      };
    });
    addXP(lessonXp);
    addCoins(Math.round(lessonXp / 5));
    extendStreak();
    updateQuestProgress('q1', 1);
    updateQuestProgress('q8', lessonXp);
    updateQuestProgress('q2', lessonXp);
  }, [addXP, addCoins, extendStreak, updateQuestProgress]);

  const completeChallenge = useCallback((challengeId, challengeXp, challengeCoins, score = 100) => {
    setCompletedChallenges(prev => {
      if (prev[challengeId]?.completed) return prev;
      return {
        ...prev,
        [challengeId]: { completed: true, score, date: new Date().toISOString() }
      };
    });
    addXP(challengeXp);
    addCoins(challengeCoins);
    extendStreak();
    updateQuestProgress('q1', 1);
    updateQuestProgress('q8', challengeXp);
    updateQuestProgress('q2', challengeXp);
  }, [addXP, addCoins, extendStreak, updateQuestProgress]);

  const clearNewAchievements = useCallback(() => setNewAchievements([]), []);

  return (
    <UserContext.Provider value={{
      profile,
      selectedJobs,
      hasProfile,
      skillProgress,
      gamification,
      dailyQuests,
      chatHistory,
      newAchievements,
      completedLessons,
      completedChallenges,
      // Profile
      updateProfile,
      saveProfile,
      resetProfile,
      // Skills
      updateSkillStatus,
      updateSkillLevel,
      addMasteredSkill,
      removeSkill,
      // XP & Coins
      addXP,
      addCoins,
      awardBadge,
      // Streak
      extendStreak,
      useStreakFreeze,
      // Store
      purchaseItem,
      // Quests
      updateQuestProgress,
      claimQuestReward,
      markQuestVisit,
      // Chat
      addChatMessage,
      // Focus
      trackFocusSession,
      // Achievements
      clearNewAchievements,
      // Lessons & Challenges
      completeLesson,
      completeChallenge,
    }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
