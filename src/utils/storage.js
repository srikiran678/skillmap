// ============================================================
// STORAGE — localStorage wrapper
// ============================================================

const KEYS = {
  USER_PROFILE: 'skillmap_user_profile',
  SKILL_PROGRESS: 'skillmap_skill_progress',
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
