import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import confetti from 'canvas-confetti';
import {
  getXPProgressForLevel,
  LEVEL_TITLES,
  ACHIEVEMENT_DEFINITIONS,
  STORE_ITEMS,
  WEEKLY_CHALLENGE,
  computeLeagueData,
  getAIResponse,
  checkStreakStatus,
  getTodayDateString,
} from '../utils/gamificationEngine';
import './GamificationHub.css';

// ── Helpers ──────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      icon: '🎮', label: 'Overview'     },
  { id: 'streak',        icon: '🔥', label: 'Streak'       },
  { id: 'quests',        icon: '⚡', label: 'Quests'       },
  { id: 'achievements',  icon: '🏆', label: 'Achievements' },
  { id: 'leaderboard',   icon: '👑', label: 'Leaderboard'  },
  { id: 'store',         icon: '💎', label: 'Store'        },
  { id: 'mentor',        icon: '🤖', label: 'AI Mentor'    },
];

const ACHIEVEMENT_CATEGORIES = ['All', 'Streak', 'XP', 'Level', 'Skills', 'Quests', 'Store', 'Career', 'Special'];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Generate last 28 days for streak calendar
const getLast28Days = (lastDateISO, streak) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isToday = i === 0;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({ dateStr, label: d.getDate(), isToday });
  }

  // Mark active days if streak > 0
  if (streak > 0 && lastDateISO) {
    const lastDate = new Date(lastDateISO);
    lastDate.setHours(0, 0, 0, 0);
    for (let j = 0; j < Math.min(streak, 28); j++) {
      const idx = 27 - j;
      if (idx >= 0) days[idx].active = true;
    }
  }

  return days;
};

// ── Overview Tab ─────────────────────────────────────────────
function OverviewTab({ profile, dailyQuests, navigate }) {
  const { level, current, needed, percent } = getXPProgressForLevel(profile.xp || 0);
  const streakStatus = checkStreakStatus(profile.streak_last_date);
  const leagueData = computeLeagueData(profile.xp || 0, profile.weekly_xp || 0);
  const earnedCount = (profile.earnedAchievementIds || []).length;
  const completedQuests = dailyQuests.filter(q => q.claimed).length;

  const statCards = [
    { icon: '⚡', value: profile.xp || 0, label: 'Total XP', color: 'var(--clr-primary)' },
    { icon: '🔥', value: profile.streak_current || 0, label: 'Day Streak', color: '#ff8c00' },
    { icon: '💎', value: profile.coins || 0, label: 'Coins', color: '#ffd700' },
    { icon: '🏆', value: earnedCount, label: 'Achievements', color: 'var(--clr-secondary)' },
    { icon: '🧊', value: profile.streak_freezes || 0, label: 'Freezes', color: '#00bcd4' },
    { icon: '⚔️', value: completedQuests, label: 'Quests Done', color: 'var(--clr-emerald)' },
    { icon: '👑', value: leagueData.userRank, label: 'Global Rank', color: leagueData.league.color },
    { icon: '🌟', value: `Lv.${level}`, label: LEVEL_TITLES[level] || 'Master', color: 'var(--clr-accent)' },
  ];

  return (
    <div className="animate-fadeInUp">
      {/* Quick action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/roadmap')}>🗺️ Roadmap</button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>✏️ Edit Profile</button>
      </div>

      {/* League badge */}
      <div className="glass" style={{
        padding: '16px 20px', marginBottom: 24,
        background: `linear-gradient(135deg, ${leagueData.league.color}18, transparent)`,
        border: `1px solid ${leagueData.league.color}40`,
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <span style={{ fontSize: '2.5rem' }}>{leagueData.league.icon}</span>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: leagueData.league.color, marginBottom: 2 }}>Current League</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: leagueData.league.color }}>{leagueData.league.name} League</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>Rank #{leagueData.userRank} of {leagueData.total} · {profile.weekly_xp || 0} XP this week</div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="hub-overview-grid stagger-children">
        {statCards.map((s, i) => (
          <div key={s.label} className="hub-stat-card animate-fadeInUp">
            <span className="hub-stat-card__icon">{s.icon}</span>
            <div className="hub-stat-card__value" style={{ color: s.color }}>{s.value}</div>
            <div className="hub-stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily quests preview */}
      <div className="hub__section-title">⚡ Today's Quests</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {dailyQuests.map(q => (
          <div key={q.id} className="glass" style={{
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: q.claimed ? 0.5 : 1
          }}>
            <span style={{ fontSize: '1.4rem' }}>{q.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.name}</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: q.completed ? 'var(--grad-emerald)' : 'var(--grad-primary)',
                  width: `${Math.min(100, ((q.progress || 0) / q.goal) * 100)}%`,
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: q.claimed ? 'var(--clr-emerald)' : 'var(--clr-text-muted)', whiteSpace: 'nowrap' }}>
              {q.claimed ? '✅ Done' : `+${q.reward_xp} XP`}
            </span>
          </div>
        ))}
      </div>

      {/* Inventory */}
      {(profile.inventory || []).length > 0 && (
        <>
          <div className="hub__section-title">🎒 Inventory</div>
          <div className="inventory-grid">
            {(profile.inventory || []).map(item => (
              <div key={item.itemId} className="inventory-chip">
                <span>{item.icon}</span>
                <span>{item.name}</span>
                <div className="inventory-chip__qty">{item.quantity}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Streak Tab ───────────────────────────────────────────────
function StreakTab({ profile, extendStreak, useStreakFreeze, addXP, addCoins }) {
  const streakStatus = checkStreakStatus(profile.streak_last_date);
  const calDays = getLast28Days(profile.streak_last_date, profile.streak_current || 0);
  const canExtendToday = streakStatus !== 'same_day';

  const handleExtend = () => {
    extendStreak();
    addXP(15);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#ff8c00', '#ffd700', '#ff4500'] });
  };

  return (
    <div className="animate-fadeIn">
      {/* Streak hero */}
      <div className="streak-hero">
        <div className="streak-flame">
          <span className="streak-flame__emoji">🔥</span>
          <span className="streak-flame__num">{profile.streak_current || 0}</span>
        </div>
        <div className="streak-info">
          <div className="streak-info__label">Current Streak</div>
          <div className="streak-info__days">
            {profile.streak_current || 0} day{(profile.streak_current || 0) !== 1 ? 's' : ''}
          </div>
          <div className="streak-info__desc">
            {streakStatus === 'same_day'
              ? '✅ Streak extended today! Keep it up tomorrow.'
              : streakStatus === 'broken' && (profile.streak_current || 0) === 0
              ? '💡 Start your first streak — log any activity today!'
              : streakStatus === 'broken'
              ? '⚠️ Streak broken. Use a Freeze to recover, or start fresh.'
              : '📅 Extend your streak today before midnight!'}
          </div>
          <div className="streak-actions" style={{ marginTop: 16 }}>
            {canExtendToday && (
              <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #ff8c00, #ff4500)', boxShadow: '0 0 12px rgba(255,100,0,0.4)' }} onClick={handleExtend}>
                🔥 Extend Streak (+15 XP)
              </button>
            )}
            {(profile.streak_freezes || 0) > 0 && streakStatus === 'broken' && (
              <button className="btn btn-secondary btn-sm" onClick={useStreakFreeze}>
                🧊 Use Freeze ({profile.streak_freezes} left)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 28-day calendar */}
      <div className="hub__section-title">📅 Last 28 Days</div>
      <div className="glass" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 8 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--clr-text-dim)', padding: '4px 0', fontWeight: 700 }}>{d}</div>
          ))}
        </div>
        <div className="streak-calendar">
          {calDays.map((day, i) => (
            <div
              key={i}
              className={`streak-cal-day ${day.active ? 'streak-cal-day--active' : day.isToday ? 'streak-cal-day--today' : 'streak-cal-day--empty'}`}
              title={day.dateStr}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>

      {/* Streak freezes */}
      <div className="hub__section-title">🧊 Streak Freezes</div>
      <div className="freeze-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: '2.4rem' }}>🧊</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#00bcd4' }}>
              {profile.streak_freezes || 0} Freeze{(profile.streak_freezes || 0) !== 1 ? 's' : ''} available
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginTop: 2 }}>
              Protect your streak on missed days. Buy more in the Store for 50 coins each.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: Math.max(3, profile.streak_freezes || 0) }, (_, i) => (
            <div key={i} style={{
              width: 44, height: 44, borderRadius: 8,
              background: i < (profile.streak_freezes || 0) ? 'rgba(0,188,212,0.25)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${i < (profile.streak_freezes || 0) ? 'rgba(0,188,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
              filter: i < (profile.streak_freezes || 0) ? 'none' : 'grayscale(1)'
            }}>
              {i < (profile.streak_freezes || 0) ? '🧊' : '⬜'}
            </div>
          ))}
        </div>
      </div>

      {/* Streak milestones */}
      <div className="hub__section-title" style={{ marginTop: 24 }}>🎯 Streak Milestones</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { days: 3,  label: '3-Day Flame',    icon: '🔥', reward: '3-Day Flame badge' },
          { days: 7,  label: 'Weekly Warrior',  icon: '⚔️', reward: 'Weekly Warrior badge' },
          { days: 14, label: 'Fortnight Force', icon: '💪', reward: 'Fortnight Force badge' },
          { days: 30, label: 'Month Master',    icon: '🌙', reward: 'Month Master badge' },
        ].map(m => {
          const reached = (profile.streak_current || 0) >= m.days;
          return (
            <div key={m.days} className="glass" style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14,
              opacity: reached ? 1 : 0.5,
              borderColor: reached ? 'rgba(255,140,0,0.3)' : undefined
            }}>
              <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.label} — {m.days} days</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>Reward: {m.reward}</div>
              </div>
              {reached
                ? <span style={{ color: 'var(--clr-emerald)', fontWeight: 700 }}>✅ Earned</span>
                : <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>{m.days - (profile.streak_current || 0)} more days</span>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quests Tab ───────────────────────────────────────────────
function QuestsTab({ dailyQuests, claimQuestReward, addXP, profile, extendStreak }) {
  const weeklyProgress = Math.min(WEEKLY_CHALLENGE.goal, profile.weekly_xp || 0);
  const weeklyPct = Math.round((weeklyProgress / WEEKLY_CHALLENGE.goal) * 100);
  const weeklyDone = weeklyProgress >= WEEKLY_CHALLENGE.goal;

  const handleClaim = (questId) => {
    claimQuestReward(questId);
    confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
  };

  return (
    <div className="animate-fadeIn">
      <div className="hub__section-title">⚡ Daily Quests</div>
      <p style={{ fontSize: '0.88rem', color: 'var(--clr-text-muted)', marginBottom: 20 }}>
        3 fresh quests every day. Complete them before midnight for bonus XP and coins!
      </p>

      {dailyQuests.map(q => {
        const pct = Math.min(100, Math.round(((q.progress || 0) / q.goal) * 100));
        return (
          <div key={q.id} className={`quest-card ${q.completed ? 'quest-card--completed' : ''} ${q.claimed ? 'quest-card--claimed' : ''}`}>
            <div className="quest-card__header">
              <div className="quest-card__icon">{q.icon}</div>
              <div>
                <div className="quest-card__title">{q.name}</div>
                <div className="quest-card__desc">{q.desc}</div>
              </div>
            </div>

            <div className="quest-card__progress-wrap">
              <div
                className={`quest-card__progress-fill ${q.completed ? 'quest-card__progress-fill--done' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="quest-progress-text">
              {q.progress || 0} / {q.goal} {q.unit} — {pct}%
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="quest-card__reward">
                <span>⚡ +{q.reward_xp} XP</span>
                <span>💎 +{q.reward_coins} coins</span>
              </div>
              {q.completed && !q.claimed && (
                <button className="btn btn-primary btn-sm" style={{ background: 'var(--grad-emerald)', boxShadow: '0 0 10px rgba(0,255,102,0.3)' }} onClick={() => handleClaim(q.id)}>
                  🎁 Claim Reward
                </button>
              )}
              {q.claimed && (
                <span style={{ color: 'var(--clr-emerald)', fontSize: '0.85rem', fontWeight: 700 }}>✅ Claimed!</span>
              )}
              {!q.completed && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { addXP(10); extendStreak(); }}
                  style={{ fontSize: '0.78rem' }}
                >
                  ▶️ Work on it (+10 XP)
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Weekly challenge */}
      <div className="weekly-challenge-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: '2rem' }}>{WEEKLY_CHALLENGE.icon}</span>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-accent)', marginBottom: 4 }}>Weekly Challenge</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6 }}>{WEEKLY_CHALLENGE.name}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--clr-text-muted)', maxWidth: 400 }}>{WEEKLY_CHALLENGE.desc}</div>
          </div>
        </div>

        <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: weeklyDone ? 'var(--grad-emerald)' : 'linear-gradient(135deg, #b026ff, #00f3ff)',
            width: `${weeklyPct}%`, transition: 'width 0.8s ease',
            boxShadow: weeklyDone ? '0 0 10px rgba(0,255,102,0.5)' : '0 0 8px rgba(176,38,255,0.5)'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
            {weeklyProgress} / {WEEKLY_CHALLENGE.goal} XP — {weeklyPct}%
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
            Reward: ⚡ {WEEKLY_CHALLENGE.reward_xp} XP · 💎 {WEEKLY_CHALLENGE.reward_coins} coins · {WEEKLY_CHALLENGE.reward_badge}
          </div>
        </div>

        {weeklyDone && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.3)', borderRadius: 8, textAlign: 'center' }}>
            🎉 <strong>Challenge Complete!</strong> You've earned the Sprint Champion badge this week!
          </div>
        )}
      </div>
    </div>
  );
}

// ── Achievements Tab ─────────────────────────────────────────
function AchievementsTab({ profile }) {
  const [filter, setFilter] = useState('All');
  const earnedIds = profile.earnedAchievementIds || [];

  const filtered = filter === 'All'
    ? ACHIEVEMENT_DEFINITIONS
    : ACHIEVEMENT_DEFINITIONS.filter(a => a.category === filter);

  const earnedCount = ACHIEVEMENT_DEFINITIONS.filter(a => earnedIds.includes(a.id)).length;

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 4 }}>
            {earnedCount} / {ACHIEVEMENT_DEFINITIONS.length} Achievements
          </div>
          <div style={{ height: 6, width: 200, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'var(--grad-primary)', width: `${(earnedCount / ACHIEVEMENT_DEFINITIONS.length) * 100}%` }} />
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
          {ACHIEVEMENT_DEFINITIONS.length - earnedCount} remaining
        </div>
      </div>

      <div className="achievement-filters">
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`achievement-filter ${filter === cat ? 'achievement-filter--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="achievement-grid">
        {filtered.map(a => {
          const earned = earnedIds.includes(a.id);
          return (
            <div key={a.id} className={`achievement-badge ${earned ? 'achievement-badge--earned' : 'achievement-badge--locked'}`}>
              {!earned && <span className="achievement-badge__lock">🔒</span>}
              <span className="achievement-badge__icon">{a.icon}</span>
              <div className="achievement-badge__category">{a.category}</div>
              <div className="achievement-badge__name">{a.name}</div>
              <div className="achievement-badge__desc">{a.desc}</div>
              {earned && <div className="achievement-badge__date">✅ Earned</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Leaderboard Tab ──────────────────────────────────────────
function LeaderboardTab({ profile }) {
  const leagueData = computeLeagueData(profile.xp || 0, profile.weekly_xp || 0);
  const { peers, userRank, league } = leagueData;

  const leagueColors = {
    Diamond: 'rgba(0,243,255,0.12)',
    Platinum: 'rgba(155,89,182,0.12)',
    Gold: 'rgba(255,215,0,0.08)',
    Silver: 'rgba(173,181,189,0.08)',
    Bronze: 'rgba(205,127,50,0.08)',
  };

  return (
    <div className="animate-fadeIn">
      {/* League banner */}
      <div className="league-banner" style={{ background: leagueColors[league.name] || 'rgba(255,255,255,0.03)', border: `1px solid ${league.color}40` }}>
        <span className="league-banner__icon">{league.icon}</span>
        <div className="league-banner__name" style={{ color: league.color }}>{league.name} League</div>
        <div className="league-banner__rank">Rank #{userRank} of {peers.length} this week</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
          {profile.weekly_xp || 0} XP earned this week
        </div>
      </div>

      {/* League tiers legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { name: 'Diamond', icon: '💎', color: '#00f3ff' },
          { name: 'Platinum', icon: '💜', color: '#9b59b6' },
          { name: 'Gold', icon: '🥇', color: '#ffd700' },
          { name: 'Silver', icon: '🥈', color: '#adb5bd' },
          { name: 'Bronze', icon: '🥉', color: '#cd7f32' },
        ].map(l => (
          <div key={l.name} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            background: `${l.color}15`, border: `1px solid ${l.color}35`,
            fontSize: '0.78rem', fontWeight: 600, color: l.color
          }}>
            {l.icon} {l.name}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>#</span>
          <span>Player</span>
          <span style={{ textAlign: 'right' }}>Weekly XP</span>
        </div>

        {peers.slice(0, 20).map((peer, i) => {
          const rank = i + 1;
          const rankStr = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
          return (
            <div
              key={peer.name + i}
              className={`leaderboard-row ${peer.isUser ? 'leaderboard-row--user' : ''} ${rank <= 3 ? 'leaderboard-row--top3' : ''}`}
            >
              <span className={`leaderboard-rank leaderboard-rank--${rank}`}>{rankStr}</span>
              <span className="leaderboard-name">
                {peer.isUser ? (
                  <span style={{ color: 'var(--clr-primary)' }}>⚡ {profile.name || 'You'}</span>
                ) : peer.name}
              </span>
              <span className="leaderboard-xp">{peer.xp.toLocaleString()} XP</span>
            </div>
          );
        })}

        {/* Show user if outside top 20 */}
        {userRank > 20 && (
          <>
            <div className="leaderboard-row" style={{ justifyContent: 'center', padding: '8px 0', color: 'var(--clr-text-dim)', fontSize: '0.8rem' }}>
              · · ·
            </div>
            <div className="leaderboard-row leaderboard-row--user">
              <span className="leaderboard-rank">#{userRank}</span>
              <span className="leaderboard-name"><span style={{ color: 'var(--clr-primary)' }}>⚡ {profile.name || 'You'}</span></span>
              <span className="leaderboard-xp">{(profile.weekly_xp || 0).toLocaleString()} XP</span>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>
        Rankings reset every Sunday midnight · Earn XP to climb the league
      </div>
    </div>
  );
}

// ── Store Tab ────────────────────────────────────────────────
function StoreTab({ profile, purchaseItem }) {
  const [filter, setFilter] = useState('All');
  const [boughtItem, setBoughtItem] = useState(null);

  const categories = ['All', ...new Set(STORE_ITEMS.map(i => i.category))];
  const filtered = filter === 'All' ? STORE_ITEMS : STORE_ITEMS.filter(i => i.category === filter);

  const handleBuy = (item) => {
    if ((profile.coins || 0) < item.cost) return;
    purchaseItem(item);
    setBoughtItem(item.id);
    confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 }, colors: ['#ffd700', '#ff8c00'] });
    setTimeout(() => setBoughtItem(null), 2000);
  };

  return (
    <div className="animate-fadeIn">
      <div className="store-balance">
        <span className="store-balance__icon">💰</span>
        <div>
          <div className="store-balance__amount">{profile.coins || 0}</div>
          <div className="store-balance__label">Coins Available</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--clr-text-muted)', textAlign: 'right' }}>
          <div>Total spent: {profile.coinsSpent || 0} coins</div>
          <div>{profile.purchases || 0} purchases</div>
        </div>
      </div>

      <div className="store-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`achievement-filter ${filter === cat ? 'achievement-filter--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="store-grid">
        {filtered.map(item => {
          const canAfford = (profile.coins || 0) >= item.cost;
          const justBought = boughtItem === item.id;
          return (
            <div key={item.id} className={`store-item ${item.limited ? 'store-item--limited' : ''}`}>
              {item.limited && <div className="store-item__limited-badge">Limited</div>}
              <div className="store-item__icon">{item.icon}</div>
              <div>
                <div className="store-item__name">{item.name}</div>
                <span className="store-item__category">{item.category}</span>
              </div>
              <div className="store-item__desc">{item.desc}</div>
              <div className="store-item__footer">
                <div className="store-item__cost">
                  <span>💎</span> {item.cost}
                </div>
                <button
                  className="btn-buy"
                  disabled={!canAfford}
                  onClick={() => handleBuy(item)}
                  title={!canAfford ? `Need ${item.cost - (profile.coins || 0)} more coins` : ''}
                >
                  {justBought ? '✅ Bought!' : canAfford ? 'Buy' : `Need ${item.cost - (profile.coins || 0)} more`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)', borderRadius: 12, fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
        💡 <strong style={{ color: 'var(--clr-text)' }}>How to earn coins:</strong> Complete daily quests, extend your streak, and finish weekly challenges. Coins are earned automatically — no real money needed.
      </div>
    </div>
  );
}

// ── AI Mentor Tab ─────────────────────────────────────────────
const SUGGESTIONS = [
  'What should I learn next?',
  'How do I build a streak habit?',
  'Tell me about React',
  'Career advice for AI/ML',
  'How to earn more XP?',
];

function AIMentorTab({ chatHistory, addChatMessage }) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory, isTyping]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    setInput('');
    addChatMessage({ role: 'user', content: msg, time: formatTime() });

    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));

    const response = getAIResponse(msg);
    setIsTyping(false);
    addChatMessage({ role: 'ai', content: response, time: formatTime() });
  }, [input, addChatMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const initMessages = chatHistory.length === 0 ? [{
    role: 'ai',
    content: "👋 Hello, Operative! I'm **Sentinel**, your SkillMap AI Mentor. I can help you with career path advice, skill learning strategies, job readiness tips, XP strategy, and streak building.\n\nWhat would you like to explore today?",
    time: formatTime()
  }] : chatHistory;

  return (
    <div className="animate-fadeIn">
      <div className="ai-chat">
        {/* Header */}
        <div className="ai-chat__header">
          <div className="ai-chat__avatar">🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sentinel AI</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="ai-chat__online" /> Online · Career Intelligence Mode
            </div>
          </div>
          {chatHistory.length > 0 && (
            <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>
              {chatHistory.filter(m => m.role === 'user').length} messages sent
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="ai-chat__messages">
          {initMessages.map((msg, i) => (
            <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
              <div className="ai-msg__bubble">{msg.content}</div>
              <div className="ai-msg__meta">{msg.time}</div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-msg ai-msg--ai">
              <div className="ai-chat__typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        {initMessages.length <= 2 && (
          <div className="ai-chat__suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="ai-suggestion" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-chat__input-wrap">
          <textarea
            className="ai-chat__input"
            placeholder="Ask Sentinel anything about your career..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="ai-chat__send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            title="Send message"
          >
            ➤
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--clr-text-dim)', textAlign: 'center' }}>
        Sentinel uses keyword-based responses. Your chat history is saved locally.
      </div>
    </div>
  );
}

// ── Main Hub Page ─────────────────────────────────────────────
export default function GamificationHub() {
  const navigate = useNavigate();
  const {
    profile, hasProfile, dailyQuests, chatHistory,
    newAchievements, clearNewAchievements,
    addXP, addCoins, awardBadge,
    extendStreak, useStreakFreeze,
    claimQuestReward, purchaseItem,
    addChatMessage, markQuestVisit,
  } = useUser();

  const [activeTab, setActiveTab] = useState('overview');
  const { level, current, needed, percent } = getXPProgressForLevel(profile.xp || 0);

  // Mark tab-visit quests
  useEffect(() => {
    if (activeTab === 'leaderboard') markQuestVisit('q7');
    if (activeTab === 'achievements') markQuestVisit('q9');
    if (activeTab === 'store') markQuestVisit('q11');
    if (activeTab === 'mentor') markQuestVisit('q10');
  }, [activeTab, markQuestVisit]);

  if (!hasProfile) {
    return (
      <div className="hub page">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎮</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>Game Hub Locked</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Build your career profile first to unlock the Gamification Hub.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Initialize Profile →</button>
          </div>
        </div>
      </div>
    );
  }

  const avatarDisplay = profile.inventory?.find(i => i.itemId?.startsWith('s4') || i.itemId?.startsWith('s5') || i.itemId?.startsWith('s6'))?.icon || '🧑‍💻';

  return (
    <div className="hub page">
      <div className="container">
        {/* Header */}
        <div className="hub__header animate-fadeInUp">
          <h1 className="hub__title">
            Gamification <span className="text-gradient">Hub</span> 🎮
          </h1>
          <p className="hub__subtitle">Track your progress, earn rewards, and level up your career.</p>
        </div>

        {/* XP Banner */}
        <div className="hub__xp-banner animate-fadeInUp glass">
          <div className="hub__xp-avatar">{avatarDisplay}</div>
          <div className="hub__xp-info">
            <div className="hub__xp-level">Level {level} · {LEVEL_TITLES[level] || 'Master'}</div>
            <div className="hub__xp-name">{profile.name || 'Operative'}</div>
            <div className="hub__xp-bar-wrap">
              <div className="hub__xp-bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <div className="hub__xp-bar-label">{current} / {needed} XP to Level {level + 1}</div>
          </div>
          <div className="hub__stat-pill">
            <span className="hub__stat-pill-val" style={{ color: '#ff8c00' }}>{profile.streak_current || 0}🔥</span>
            <span className="hub__stat-pill-label">Streak</span>
          </div>
          <div className="hub__stat-pill">
            <span className="hub__stat-pill-val" style={{ color: '#ffd700' }}>{profile.coins || 0}💎</span>
            <span className="hub__stat-pill-label">Coins</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="hub__tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              id={`hub-tab-${tab.id}`}
              className={`hub__tab ${activeTab === tab.id ? 'hub__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'quests' && dailyQuests.filter(q => q.completed && !q.claimed).length > 0 && (
                <span style={{
                  width: 8, height: 8, background: '#00ff66', borderRadius: '50%',
                  boxShadow: '0 0 6px rgba(0,255,102,0.8)'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab profile={profile} dailyQuests={dailyQuests} navigate={navigate} />
        )}
        {activeTab === 'streak' && (
          <StreakTab
            profile={profile}
            extendStreak={extendStreak}
            useStreakFreeze={useStreakFreeze}
            addXP={addXP}
            addCoins={addCoins}
          />
        )}
        {activeTab === 'quests' && (
          <QuestsTab
            dailyQuests={dailyQuests}
            claimQuestReward={claimQuestReward}
            addXP={addXP}
            profile={profile}
            extendStreak={extendStreak}
          />
        )}
        {activeTab === 'achievements' && (
          <AchievementsTab profile={profile} />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab profile={profile} />
        )}
        {activeTab === 'store' && (
          <StoreTab profile={profile} purchaseItem={purchaseItem} />
        )}
        {activeTab === 'mentor' && (
          <AIMentorTab chatHistory={chatHistory} addChatMessage={addChatMessage} />
        )}
      </div>

      {/* Achievement Toast Notifications */}
      {newAchievements.length > 0 && (
        <div className="achievement-toast">
          {newAchievements.slice(-3).map((a, i) => (
            <div key={a.id + i} className="achievement-toast__item">
              <span className="achievement-toast__icon">{a.icon}</span>
              <div>
                <div className="achievement-toast__label">Achievement Unlocked!</div>
                <div className="achievement-toast__name">{a.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
