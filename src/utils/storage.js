// ============================================================
// STORAGE — localStorage wrapper
// ============================================================

const KEYS = {
  USER_PROFILE: 'skillmap_user_profile',
  SKILL_PROGRESS: 'skillmap_skill_progress',
  GAMIFICATION: 'skillmap_gamification',
  DAILY_QUESTS: 'skillmap_daily_quests',
  CHAT_HISTORY: 'skillmap_chat_history',
};

export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
  } catch (e) { console.error('Failed to save profile', e); }
};

export const loadUserProfile = () => {
  try {
    const raw = localStorage.getItem(KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};

export const clearUserProfile = () => {
  localStorage.removeItem(KEYS.USER_PROFILE);
};

export const saveSkillProgress = (progress) => {
  try {
    localStorage.setItem(KEYS.SKILL_PROGRESS, JSON.stringify(progress));
  } catch (e) { console.error('Failed to save progress', e); }
};

export const loadSkillProgress = () => {
  try {
    const raw = localStorage.getItem(KEYS.SKILL_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
};

export const hasExistingProfile = () => !!localStorage.getItem(KEYS.USER_PROFILE);

// ── Gamification State ────────────────────────────────────────
export const saveGamification = (state) => {
  try {
    localStorage.setItem(KEYS.GAMIFICATION, JSON.stringify(state));
  } catch (e) { console.error('Failed to save gamification state', e); }
};

export const loadGamification = () => {
  try {
    const raw = localStorage.getItem(KEYS.GAMIFICATION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};

// ── Daily Quests ──────────────────────────────────────────────
export const saveDailyQuests = (quests, dateStr) => {
  try {
    localStorage.setItem(KEYS.DAILY_QUESTS, JSON.stringify({ quests, date: dateStr }));
  } catch (e) { console.error('Failed to save quests', e); }
};

export const loadDailyQuests = () => {
  try {
    const raw = localStorage.getItem(KEYS.DAILY_QUESTS);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};

// ── Chat History ──────────────────────────────────────────────
export const saveChatHistory = (messages) => {
  try {
    // Keep only last 50 messages
    const trimmed = messages.slice(-50);
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
  } catch (e) { console.error('Failed to save chat history', e); }
};

export const loadChatHistory = () => {
  try {
    const raw = localStorage.getItem(KEYS.CHAT_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
};

export const clearAllData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};
