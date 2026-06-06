// ============================================================
// GAMIFICATION ENGINE — SkillMap
// Pure functions for XP, streaks, quests, achievements, leagues
// ============================================================

// ── XP Level Thresholds ──────────────────────────────────────
export const LEVEL_THRESHOLDS = [
  0, 200, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500, 8500,
  11000, 14000, 17500, 21500, 26000, 31000, 37000, 44000, 52000,
];

export const getLevelFromXP = (xp) => {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
};

export const getXPProgressForLevel = (xp) => {
  const level = getLevelFromXP(xp);
  const idx = level - 1;
  const current = xp - LEVEL_THRESHOLDS[idx];
  const needed = (LEVEL_THRESHOLDS[idx + 1] || LEVEL_THRESHOLDS[idx] + 5000) - LEVEL_THRESHOLDS[idx];
  return { level, current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) };
};

export const LEVEL_TITLES = [
  '', 'Rookie', 'Apprentice', 'Explorer', 'Analyst', 'Strategist',
  'Engineer', 'Architect', 'Specialist', 'Expert', 'Maestro',
  'Visionary', 'Virtuoso', 'Pioneer', 'Champion', 'Legend',
  'Oracle', 'Titan', 'Sovereign', 'Apex', 'Transcendent',
];

// ── Streak Logic ─────────────────────────────────────────────
export const checkStreakStatus = (lastDateISO) => {
  if (!lastDateISO) return 'new';
  const today = new Date();
  const last = new Date(lastDateISO);
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - last) / 86400000);
  if (diffDays === 0) return 'same_day';
  if (diffDays === 1) return 'can_extend';
  return 'broken';
};

// ── Quest Pool ───────────────────────────────────────────────
export const QUEST_POOL = [
  { id: 'q1',  name: 'Morning Drill',      icon: '☀️', desc: 'Complete 1 skill activity today',         goal: 1,  unit: 'activities', reward_xp: 20,  reward_coins: 5  },
  { id: 'q2',  name: 'Double Down',        icon: '⚡', desc: 'Earn 100 XP in a single session',         goal: 100,unit: 'xp',         reward_xp: 30,  reward_coins: 10 },
  { id: 'q3',  name: 'Skill Hunter',       icon: '🎯', desc: 'Add a new skill to your profile',         goal: 1,  unit: 'skills',     reward_xp: 40,  reward_coins: 15 },
  { id: 'q4',  name: 'Deep Dive',          icon: '🌊', desc: 'Review your roadmap for 5 minutes',       goal: 1,  unit: 'sessions',   reward_xp: 25,  reward_coins: 8  },
  { id: 'q5',  name: 'Knowledge Burst',    icon: '💥', desc: 'Complete a focus session on the dashboard',goal: 1, unit: 'timers',     reward_xp: 50,  reward_coins: 20 },
  { id: 'q6',  name: 'Career Compass',     icon: '🧭', desc: 'Check your job readiness score',          goal: 1,  unit: 'checks',     reward_xp: 15,  reward_coins: 5  },
  { id: 'q7',  name: 'Social Boost',       icon: '🤝', desc: 'Visit the Leaderboard tab',               goal: 1,  unit: 'visits',     reward_xp: 10,  reward_coins: 3  },
  { id: 'q8',  name: 'XP Grinder',         icon: '🔥', desc: 'Earn 50 XP today',                       goal: 50, unit: 'xp',         reward_xp: 25,  reward_coins: 8  },
  { id: 'q9',  name: 'Badge Chaser',       icon: '🏅', desc: 'View your achievements page',             goal: 1,  unit: 'visits',     reward_xp: 10,  reward_coins: 3  },
  { id: 'q10', name: 'Mentor Session',     icon: '🤖', desc: 'Chat with the AI Mentor',                 goal: 1,  unit: 'messages',   reward_xp: 35,  reward_coins: 12 },
  { id: 'q11', name: 'Coin Collector',     icon: '💎', desc: 'Visit the Rewards Store',                 goal: 1,  unit: 'visits',     reward_xp: 10,  reward_coins: 5  },
  { id: 'q12', name: 'Flame Keeper',       icon: '🔥', desc: 'Maintain your streak today',              goal: 1,  unit: 'days',       reward_xp: 30,  reward_coins: 10 },
  { id: 'q13', name: 'Rapid Fire',         icon: '⚡', desc: 'Complete 3 activities in one day',        goal: 3,  unit: 'activities', reward_xp: 60,  reward_coins: 25 },
  { id: 'q14', name: 'Level Pusher',       icon: '📈', desc: 'Gain 200 XP toward your next level',     goal: 200,unit: 'xp',         reward_xp: 40,  reward_coins: 15 },
  { id: 'q15', name: 'Quest Master',       icon: '🏆', desc: 'Complete 2 daily quests',                 goal: 2,  unit: 'quests',     reward_xp: 80,  reward_coins: 30 },
];

export const WEEKLY_CHALLENGE = {
  id: 'wc1',
  name: 'Career Sprint',
  icon: '🚀',
  desc: 'Earn 500 XP this week to prove your dedication to your career goals.',
  goal: 500,
  unit: 'xp',
  reward_xp: 200,
  reward_coins: 75,
  reward_badge: '🚀 Sprint Champion',
};

// Generate 3 daily quests deterministically from today's date
export const generateDailyQuests = () => {
  const today = new Date();
  const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 31 + today.getDate();
  const shuffle = (arr, s) => {
    const a = [...arr];
    let cur = s;
    for (let i = a.length - 1; i > 0; i--) {
      cur = (cur * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(cur) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  return shuffle(QUEST_POOL, seed).slice(0, 3).map(q => ({
    ...q,
    progress: 0,
    completed: false,
    claimed: false,
  }));
};

export const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ── Achievements ──────────────────────────────────────────────
export const ACHIEVEMENT_DEFINITIONS = [
  // Streak achievements
  { id: 'a1',  name: 'First Spark',      icon: '✨', category: 'Streak',  desc: 'Start your first streak',             check: (p) => p.streak_current >= 1  },
  { id: 'a2',  name: '3-Day Flame',      icon: '🔥', category: 'Streak',  desc: 'Maintain a 3-day streak',             check: (p) => p.streak_current >= 3  },
  { id: 'a3',  name: 'Weekly Warrior',   icon: '⚔️', category: 'Streak',  desc: 'Maintain a 7-day streak',             check: (p) => p.streak_current >= 7  },
  { id: 'a4',  name: 'Fortnight Force',  icon: '💪', category: 'Streak',  desc: 'Maintain a 14-day streak',            check: (p) => p.streak_current >= 14 },
  { id: 'a5',  name: 'Month Master',     icon: '🌙', category: 'Streak',  desc: 'Maintain a 30-day streak',            check: (p) => p.streak_current >= 30 },

  // XP achievements
  { id: 'a6',  name: 'First Contact',    icon: '📡', category: 'XP',      desc: 'Earn your first XP',                  check: (p) => (p.xp || 0) >= 1     },
  { id: 'a7',  name: 'Apprentice',       icon: '🎓', category: 'XP',      desc: 'Reach 500 XP',                        check: (p) => (p.xp || 0) >= 500   },
  { id: 'a8',  name: 'Adept',            icon: '⚡', category: 'XP',      desc: 'Reach 1,000 XP',                      check: (p) => (p.xp || 0) >= 1000  },
  { id: 'a9',  name: 'Scholar',          icon: '📚', category: 'XP',      desc: 'Reach 2,500 XP',                      check: (p) => (p.xp || 0) >= 2500  },
  { id: 'a10', name: 'Neural Master',    icon: '🧠', category: 'XP',      desc: 'Reach 5,000 XP',                      check: (p) => (p.xp || 0) >= 5000  },
  { id: 'a11', name: 'Apex Legend',      icon: '👑', category: 'XP',      desc: 'Reach 10,000 XP',                     check: (p) => (p.xp || 0) >= 10000 },

  // Level achievements
  { id: 'a12', name: 'Leveled Up',       icon: '📈', category: 'Level',   desc: 'Reach Level 3',                       check: (p) => getLevelFromXP(p.xp || 0) >= 3  },
  { id: 'a13', name: 'Mid-Tier',         icon: '🌟', category: 'Level',   desc: 'Reach Level 5',                       check: (p) => getLevelFromXP(p.xp || 0) >= 5  },
  { id: 'a14', name: 'Elite Operator',   icon: '🚀', category: 'Level',   desc: 'Reach Level 8',                       check: (p) => getLevelFromXP(p.xp || 0) >= 8  },
  { id: 'a15', name: 'Transcendent',     icon: '🌌', category: 'Level',   desc: 'Reach Level 10',                      check: (p) => getLevelFromXP(p.xp || 0) >= 10 },

  // Skills achievements
  { id: 'a16', name: 'Skill Seeker',     icon: '🔍', category: 'Skills',  desc: 'Add your first skill',                check: (p) => (p.skills?.length || 0) >= 1   },
  { id: 'a17', name: 'Multi-Skilled',    icon: '🎭', category: 'Skills',  desc: 'Add 5 skills to your profile',        check: (p) => (p.skills?.length || 0) >= 5   },
  { id: 'a18', name: 'Skill Arsenal',    icon: '⚙️', category: 'Skills',  desc: 'Add 10 skills to your profile',       check: (p) => (p.skills?.length || 0) >= 10  },
  { id: 'a19', name: 'Tech Stack Pro',   icon: '🏗️', category: 'Skills',  desc: 'Add 20 skills to your profile',       check: (p) => (p.skills?.length || 0) >= 20  },

  // Quests
  { id: 'a20', name: 'Quest Starter',    icon: '🗡️', category: 'Quests',  desc: 'Complete your first daily quest',     check: (p) => (p.questsCompleted || 0) >= 1  },
  { id: 'a21', name: 'Quest Runner',     icon: '🏃', category: 'Quests',  desc: 'Complete 10 daily quests',            check: (p) => (p.questsCompleted || 0) >= 10 },
  { id: 'a22', name: 'Quest Legend',     icon: '🏆', category: 'Quests',  desc: 'Complete 25 daily quests',            check: (p) => (p.questsCompleted || 0) >= 25 },

  // Coins / Store
  { id: 'a23', name: 'First Purchase',   icon: '💰', category: 'Store',   desc: 'Buy your first item from the Store',  check: (p) => (p.purchases || 0) >= 1 },
  { id: 'a24', name: 'High Roller',      icon: '💎', category: 'Store',   desc: 'Spend 500 coins in the Store',        check: (p) => (p.coinsSpent || 0) >= 500 },

  // Career
  { id: 'a25', name: 'Career Focused',   icon: '🎯', category: 'Career',  desc: 'Set your first career interest',      check: (p) => (p.careerInterests?.length || 0) >= 1 },
  { id: 'a26', name: 'Multi-Career',     icon: '🌐', category: 'Career',  desc: 'Track 3 career paths simultaneously', check: (p) => (p.careerInterests?.length || 0) >= 3 },

  // Special
  { id: 'a27', name: 'Focus Master',     icon: '⏱️', category: 'Special', desc: 'Complete a 25-min Pomodoro session',  check: (p) => (p.focusSessions || 0) >= 1   },
  { id: 'a28', name: 'AI Whisperer',     icon: '🤖', category: 'Special', desc: 'Send 5 messages to the AI Mentor',    check: (p) => (p.aiMessages || 0) >= 5      },
  { id: 'a29', name: 'Early Adopter',    icon: '⚡', category: 'Special', desc: 'Build your profile for the first time',check: (p) => !!p.name                     },
  { id: 'a30', name: 'Freeze Saved',     icon: '🧊', category: 'Special', desc: 'Use a streak freeze',                 check: (p) => (p.freezesUsed || 0) >= 1     },
];

export const checkNewAchievements = (profile, earnedIds) => {
  return ACHIEVEMENT_DEFINITIONS.filter(a => {
    if (earnedIds.includes(a.id)) return false;
    try { return a.check(profile); } catch { return false; }
  }).map(a => a.id);
};

// ── Store Items ───────────────────────────────────────────────
export const STORE_ITEMS = [
  { id: 's1',  name: 'Streak Freeze',      icon: '🧊', category: 'Utility',    cost: 50,  desc: 'Skip one missed day without breaking your streak.',   effect: 'streak_freeze', limited: false },
  { id: 's2',  name: 'XP Boost Badge',     icon: '⚡', category: 'Utility',    cost: 100, desc: 'Badge of honor displayed on your profile.',           effect: 'xp_boost',      limited: false },
  { id: 's3',  name: 'Weekend Shield',     icon: '🛡️', category: 'Utility',    cost: 75,  desc: 'Protect your streak over the weekend automatically.', effect: 'weekend_shield',limited: false },
  { id: 's4',  name: 'Neon Owl Avatar',    icon: '🦉', category: 'Avatar',     cost: 150, desc: 'Replace your avatar with the glowing cyber owl.',     effect: 'avatar_owl',    limited: false },
  { id: 's5',  name: 'Phoenix Avatar',     icon: '🐦‍🔥', category: 'Avatar',     cost: 200, desc: 'The Phoenix — symbol of resilience and rebirth.',     effect: 'avatar_phoenix',limited: false },
  { id: 's6',  name: 'Dragon Avatar',      icon: '🐉', category: 'Avatar',     cost: 250, desc: 'Rare. The Dragon of skill mastery.',                  effect: 'avatar_dragon', limited: true  },
  { id: 's7',  name: 'Dark Matter Theme',  icon: '🌑', category: 'Theme',      cost: 200, desc: 'Ultra-dark cosmic theme. For serious operatives.',     effect: 'theme_dark',    limited: false },
  { id: 's8',  name: 'Aurora Theme',       icon: '🌈', category: 'Theme',      cost: 200, desc: 'Northern lights gradient theme.',                     effect: 'theme_aurora',  limited: false },
  { id: 's9',  name: 'Crimson Theme',      icon: '❤️‍🔥', category: 'Theme',      cost: 175, desc: 'Deep red cyberpunk aesthetic.',                       effect: 'theme_crimson', limited: false },
  { id: 's10', name: 'Double Coins Day',   icon: '💰', category: 'Utility',    cost: 120, desc: 'Earn double coins from all activities for 24h.',       effect: 'coin_boost',    limited: false },
  { id: 's11', name: 'Sprint Pack',        icon: '🚀', category: 'Bundle',     cost: 300, desc: 'Bundle: 2x Streak Freeze + XP Boost + Weekend Shield.',effect: 'bundle_sprint', limited: false },
  { id: 's12', name: 'Legend Bundle',      icon: '👑', category: 'Bundle',     cost: 500, desc: 'Ultimate bundle: Dragon Avatar + Dark Matter + 3x Freeze.',effect: 'bundle_legend',limited: true },
];

// ── Leaderboard / League ──────────────────────────────────────
const MOCK_NAMES = [
  'CyberMage', 'NeonNinja', 'DataWitch', 'AlgoKing', 'ByteRunner',
  'CloudSurfer', 'CodePhoenix', 'DevDragon', 'QuantumLeap', 'NullPointer',
  'ReactRaider', 'NodeNomad', 'PythonPrince', 'RustRacer', 'GitGhost',
  'DockerDuke', 'KubeKnight', 'LinuxLord', 'APIAce', 'CSSCaster',
  'TypeTitan', 'GraphGuru', 'VimViking', 'BashBaron', 'MongoMage',
  'RedisRogue', 'GRPCGiant', 'TerraformTsar', 'SvelteSpirit', 'VueMaster',
];

export const LEAGUE_TIERS = [
  { name: 'Bronze',   icon: '🥉', color: '#cd7f32', minRank: 25, maxRank: 30 },
  { name: 'Silver',   icon: '🥈', color: '#adb5bd', minRank: 18, maxRank: 24 },
  { name: 'Gold',     icon: '🥇', color: '#ffd700', minRank: 11, maxRank: 17 },
  { name: 'Platinum', icon: '💜', color: '#9b59b6', minRank: 5,  maxRank: 10 },
  { name: 'Diamond',  icon: '💎', color: '#00f3ff', minRank: 1,  maxRank: 4  },
];

export const computeLeagueData = (userXP, weeklyXP) => {
  // Seeded mock peers based on current week
  const now = new Date();
  const weekSeed = now.getFullYear() * 100 + Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 604800000);
  const peers = MOCK_NAMES.map((name, i) => {
    const seed = (weekSeed * 31 + i * 7919) & 0xffff;
    const xp = 50 + (seed % 1200);
    return { name, xp };
  });

  // Insert user
  const allPeers = [...peers, { name: 'You', xp: weeklyXP || 0, isUser: true }];
  allPeers.sort((a, b) => b.xp - a.xp);

  const userRank = allPeers.findIndex(p => p.isUser) + 1;
  const total = allPeers.length;

  // Assign league tier
  const pct = userRank / total;
  let league = LEAGUE_TIERS[0];
  if (pct <= 0.13) league = LEAGUE_TIERS[4]; // Diamond top 13%
  else if (pct <= 0.33) league = LEAGUE_TIERS[3]; // Platinum
  else if (pct <= 0.57) league = LEAGUE_TIERS[2]; // Gold
  else if (pct <= 0.80) league = LEAGUE_TIERS[1]; // Silver
  else league = LEAGUE_TIERS[0]; // Bronze

  return { peers: allPeers, userRank, total, league };
};

// ── AI Mentor Responses ───────────────────────────────────────
export const AI_RESPONSES = [
  {
    keywords: ['python', 'learn python', 'python tutorial'],
    response: "🐍 **Python** is an excellent choice! Start with the official docs at python.org, then move to projects. For career tracks, Python is essential for Data Science, AI/ML, and Backend dev. I'd recommend: `basics → OOP → libraries (NumPy, pandas) → a real project`. Want a skill roadmap specific to your goals?"
  },
  {
    keywords: ['react', 'reactjs', 'frontend'],
    response: "⚛️ **React** dominates the frontend landscape. Start with JSX and hooks (useState, useEffect), then learn React Router, state management (Zustand or Redux), and testing (Jest). The fastest path: build 3 real projects — portfolio, e-commerce, and a SaaS dashboard. Pair it with TypeScript for maximum career value."
  },
  {
    keywords: ['next', 'nextjs', 'next.js'],
    response: "🚀 **Next.js** is the go-to for full-stack React. Key concepts: App Router, Server Components, API Routes, and Vercel deployment. If you know React, you can pick up Next.js in 2 weeks with focused practice. It's highly demanded for startups and SaaS roles."
  },
  {
    keywords: ['data science', 'machine learning', 'ml', 'ai', 'artificial intelligence'],
    response: "🧠 **AI/ML** is the highest-growth career track right now. Core path: Statistics → Python → NumPy/Pandas → Scikit-learn → Deep Learning (TensorFlow/PyTorch) → LLMs. Kaggle competitions are the best way to build a portfolio. The average AI engineer earns 40–60% more than a traditional developer."
  },
  {
    keywords: ['job', 'jobs', 'career', 'hire', 'interview'],
    response: "🎯 For career success: (1) **Build a portfolio** with 3 standout projects, (2) **Master system design** — every FAANG interview has it, (3) **Practice DSA** on LeetCode (100 medium problems is the sweet spot), (4) **Network actively** — 70% of jobs are filled via referrals. Your SkillMap readiness score is your north star — aim for 85%+ before applying."
  },
  {
    keywords: ['roadmap', 'path', 'plan', 'next skill', 'what should i learn', 'what to learn'],
    response: "📍 Based on your profile, here's my recommendation: focus on your highest-priority skill gaps in your Learning Queue (Dashboard → Gaps tab). A good weekly pace is 3 new concepts + 1 review session. Also, check your Career Readiness score — skills below 70% on your target roles should be prioritized first."
  },
  {
    keywords: ['streak', 'motivation', 'habit', 'consistent', 'daily'],
    response: "🔥 Consistency > intensity. Duolingo's research shows that **daily 15-minute sessions** outperform weekly 2-hour marathons by 3x in retention. Your streak counter is more than a number — it's proof of neural pathway formation. Tip: tie learning to an existing habit (morning coffee, lunch break). Use the Streak Freeze when life gets in the way."
  },
  {
    keywords: ['coin', 'coins', 'store', 'buy', 'reward'],
    response: "💎 Spend coins wisely! **Streak Freeze (50 coins)** is your most valuable utility — protect that streak. The **Sprint Pack (300 coins)** is the best value bundle. If you're building a habit, I'd prioritize the freeze over cosmetics. You earn coins by completing quests and daily challenges."
  },
  {
    keywords: ['xp', 'experience', 'level up', 'points'],
    response: "⚡ **XP (Experience Points)** are earned by completing activities, quests, and focus sessions. Every 200 XP at the start (scaling up) earns you a new level. Higher levels unlock prestige badges and show your rank on the leaderboard. The fastest XP farming: complete the 3 daily quests every day — that's 75–120 bonus XP on top of your activities."
  },
  {
    keywords: ['badge', 'achievement', 'award', 'trophy'],
    response: "🏆 Achievements are tracked automatically — no manual claiming needed for most. Key ones to chase early: **Weekly Warrior** (7-day streak), **Adept** (1000 XP), and **Quest Runner** (10 quests). They look great on your profile and each milestone proves real commitment to recruiters."
  },
  {
    keywords: ['cybersecurity', 'security', 'hacking', 'ethical hacking'],
    response: "🛡️ **Cybersecurity** is a high-demand, high-pay field with a massive talent gap. Path: Networking fundamentals → Linux → Python scripting → Web security (OWASP) → CTF challenges on HackTheBox/TryHackMe → certifications (CEH, OSCP). Defensive roles (SOC Analyst) are faster to enter; offensive (Penetration Tester) pay more."
  },
  {
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'devops'],
    response: "☁️ **Cloud + DevOps** is the backbone of modern software. Start with AWS (widest job market) → learn EC2, S3, Lambda → get the AWS Solutions Architect Associate cert → add Docker + Kubernetes. The SAA-C03 cert alone can increase your salary by ₹8–15 LPA in India. Pair with Terraform for Infrastructure-as-Code mastery."
  },
  {
    keywords: ['hi', 'hello', 'hey', 'help', 'start'],
    response: "👋 Hello, Operative! I'm **Sentinel**, your SkillMap AI Mentor. I can help you with:\n\n- 🗺️ Career path advice\n- 📚 Skill learning strategies  \n- 🎯 Job readiness tips\n- ⚡ XP & gamification strategy\n- 🔥 Streak & habit building\n\nWhat would you like to explore today?"
  },
];

export const getAIResponse = (message) => {
  const lower = message.toLowerCase();
  for (const entry of AI_RESPONSES) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.response;
    }
  }
  return "🤖 Great question, Operative. Based on your SkillMap profile, I'd focus on closing the highest-priority skill gaps in your career path. Would you like to discuss a specific skill, career goal, or learning strategy? Try asking me about Python, React, career readiness, streaks, or your XP strategy!";
};
