// ============================================================
// SKILL ENGINE — Core gap analysis & roadmap generation
// ============================================================

const LEVEL_ORDER = { Beginner: 1, Intermediate: 2, Advanced: 3 };

/**
 * Calculate how many "level points" a user has for a skill
 * compared to what's needed.
 */
const getLevelScore = (level) => LEVEL_ORDER[level] || 0;

/**
 * Determine if the user meets the required level for a skill.
 */
const meetsLevel = (userLevel, requiredLevel) =>
  getLevelScore(userLevel) >= getLevelScore(requiredLevel);

/**
 * Normalize skill name for comparison (case-insensitive, trimmed).
 */
const normalize = (s) => s.trim().toLowerCase();

/**
 * Find a user skill by name (case-insensitive).
 */
const findUserSkill = (userSkills, skillName) =>
  userSkills.find(us => normalize(us.skillName) === normalize(skillName));

/**
 * For a given job profile, compute the skill gap against user skills.
 * Returns:
 *   - mastered: skills the user has at or above required level
 *   - toLearn: skills the user lacks or needs to level up
 *   - matchPercent: 0–100 score of readiness
 */
export const computeSkillGap = (jobProfile, userSkills = []) => {
  const mastered = [];
  const toLearn = [];

  for (const req of jobProfile.skillsRequired) {
    const userSkill = findUserSkill(userSkills, req.skill);
    if (userSkill && meetsLevel(userSkill.level, req.levelNeeded)) {
      mastered.push({ skill: req.skill, levelNeeded: req.levelNeeded, userLevel: userSkill.level });
    } else {
      const priority = getPriority(req, jobProfile);
      toLearn.push({
        skill: req.skill,
        levelNeeded: req.levelNeeded,
        userLevel: userSkill ? userSkill.level : null,
        priority,
        isUpgrade: !!userSkill,
      });
    }
  }

  const total = jobProfile.skillsRequired.length;
  const matchPercent = total > 0 ? Math.round((mastered.length / total) * 100) : 0;

  return { mastered, toLearn, matchPercent, total, masteredCount: mastered.length };
};

/**
 * Assign priority (High / Medium / Low) to a missing skill
 * based on its index position (first skills in the list = most important).
 */
const getPriority = (req, jobProfile) => {
  const idx = jobProfile.skillsRequired.findIndex(r => r.skill === req.skill);
  if (idx < 3) return 'High';
  if (idx < 6) return 'Medium';
  return 'Low';
};

/**
 * Given user's career interests, compute gaps across all selected jobs.
 * Returns an array of job gap objects sorted by match%.
 */
export const computeAllGaps = (jobProfiles, userSkills = []) =>
  jobProfiles
    .map(job => ({ job, ...computeSkillGap(job, userSkills) }))
    .sort((a, b) => b.matchPercent - a.matchPercent);

/**
 * Generate a consolidated roadmap across multiple job targets.
 * De-duplicates skills, merges priorities, and sorts by importance.
 */
export const generateRoadmap = (jobProfiles, userSkills = []) => {
  const skillMap = new Map();

  for (const job of jobProfiles) {
    const { toLearn, mastered } = computeSkillGap(job, userSkills);

    const processItem = (item, isMastered) => {
      const key = normalize(item.skill);
      if (skillMap.has(key)) {
        const existing = skillMap.get(key);
        // Upgrade priority if needed
        const existingPriority = existing.priority;
        const newPriority = item.priority;
        if (getLevelScore(newPriority === 'High' ? 3 : newPriority === 'Medium' ? 2 : 1) >
            getLevelScore(existingPriority === 'High' ? 3 : existingPriority === 'Medium' ? 2 : 1)) {
          existing.priority = newPriority;
        }
        if (!existing.jobs.includes(job.jobTitle)) {
          existing.jobs.push(job.jobTitle);
        }
        if (!isMastered) existing.isMastered = false;
      } else {
        skillMap.set(key, {
          skill: item.skill,
          levelNeeded: item.levelNeeded,
          userLevel: item.userLevel,
          priority: item.priority || 'Medium',
          isUpgrade: item.isUpgrade || false,
          jobs: [job.jobTitle],
          status: isMastered ? 'Achieved' : 'To Learn',
          isMastered: isMastered
        });
      }
    };

    toLearn.forEach(item => processItem(item, false));
    mastered.forEach(item => processItem(item, true));
  }

  const roadmap = Array.from(skillMap.values());

  // Sort: High -> Medium -> Low, then by level needed (lower first)
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  roadmap.sort((a, b) => {
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pd !== 0) return pd;
    return getLevelScore(a.levelNeeded) - getLevelScore(b.levelNeeded);
  });

  return roadmap;
};

/**
 * Calculate overall profile stats.
 */
export const computeProfileStats = (jobProfiles, userSkills = []) => {
  if (!jobProfiles.length) return { totalSkillsNeeded: 0, totalMastered: 0, overallMatch: 0 };

  const allRequired = new Set();
  const allMastered = new Set();

  for (const job of jobProfiles) {
    const { mastered, toLearn } = computeSkillGap(job, userSkills);
    mastered.forEach(m => { allRequired.add(normalize(m.skill)); allMastered.add(normalize(m.skill)); });
    toLearn.forEach(t => allRequired.add(normalize(t.skill)));
  }

  const overallMatch = allRequired.size > 0
    ? Math.round((allMastered.size / allRequired.size) * 100)
    : 0;

  return {
    totalSkillsNeeded: allRequired.size,
    totalMastered: allMastered.size,
    totalToLearn: allRequired.size - allMastered.size,
    overallMatch,
    userSkillCount: userSkills.length,
  };
};

/**
 * Level progress percentage (user level -> required level)
 */
export const getLevelProgress = (userLevel, requiredLevel) => {
  if (!userLevel) return 0;
  const user = getLevelScore(userLevel);
  const req = getLevelScore(requiredLevel);
  if (user >= req) return 100;
  return Math.round((user / req) * 100);
};

/**
 * Estimate rough learning time string for a skill.
 */
export const estimateLearningTime = (levelNeeded, isUpgrade) => {
  if (isUpgrade) return '2–4 weeks';
  if (levelNeeded === 'Beginner') return '1–3 weeks';
  if (levelNeeded === 'Intermediate') return '1–3 months';
  return '3–6 months';
};
