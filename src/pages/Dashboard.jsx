import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import SkillTag from '../components/SkillTag';
import RadarChart from '../components/RadarChart';
import { DoughnutChart, JobMatchBar } from '../components/ProgressChart';
import { computeAllGaps, computeProfileStats, generateRoadmap } from '../utils/skillEngine';
import { getResourcesForSkill } from '../data/learningResources';
import confetti from 'canvas-confetti';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, selectedJobs, hasProfile, resetProfile, updateSkillLevel, addXP, awardBadge } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('priority');

  // Timer State (Feature 10)
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      addXP(50);
      awardBadge('Focus Master ⏱️');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, addXP, awardBadge]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Guard
  if (!hasProfile) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>No Profile Found</h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Please build your career profile first to view your dashboard.</p>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>Build My Profile →</button>
        </div>
      </div>
    );
  }

  // Computed data
  const jobGaps = useMemo(() => computeAllGaps(selectedJobs, profile.skills || []), [selectedJobs, profile.skills]);
  const stats = useMemo(() => computeProfileStats(selectedJobs, profile.skills || []), [selectedJobs, profile.skills]);
  const roadmap = useMemo(() => generateRoadmap(selectedJobs, profile.skills || []), [selectedJobs, profile.skills]);

  const sortedToLearn = useMemo(() => {
    const all = roadmap.slice();
    if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      return all.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    if (sortBy === 'level') return all.sort((a, b) => a.levelNeeded.localeCompare(b.levelNeeded));
    if (sortBy === 'jobs') return all.sort((a, b) => b.jobs.length - a.jobs.length);
    return all;
  }, [roadmap, sortBy]);

  const matchColor = stats.overallMatch >= 70 ? 'emerald' : stats.overallMatch >= 40 ? 'amber' : 'primary';

  // Feature 2: AI Recommendation
  const recommendedSkill = sortedToLearn[0];

  return (
    <div className="dashboard page">
      <div className="container">

        {/* Header with Gamification (Feature 3) */}
        <div className="dashboard__header animate-fadeInUp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Welcome to the Neural Net, <span className="text-gradient">{profile.name || 'Operative'}</span> ⚡</h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6 }}>
              {profile.careerInterests?.length} targeted nodes · {profile.skills?.length} integrated skills
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="badge badge-high" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>XP: {profile.xp || 0}</span>
              {profile.badges?.map(b => (
                <span key={b} className="badge badge-advanced" style={{ padding: '6px 12px' }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>✏️ Reconfigure</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/roadmap')}>🗺️ Access Roadmap</button>
          </div>
        </div>

        {/* Top Widgets Row (Features 8, 9, 10) */}
        <div className="grid-3 stagger-children" style={{ marginBottom: 32 }}>
          {/* F2: AI Recommendation */}
          <div className="glass dashboard__chart-card" style={{ padding: 20 }}>
            <h4 style={{ color: 'var(--clr-primary)', marginBottom: 10, textTransform: 'uppercase' }}>🤖 AI Recommendation</h4>
            {recommendedSkill ? (
              <>
                <p style={{ fontSize: '0.9rem', marginBottom: 10 }}>Optimal next skill to acquire:</p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 }}>
                  <strong>{recommendedSkill.skill}</strong> ({recommendedSkill.levelNeeded})
                  <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>Priority: {recommendedSkill.priority}</div>
                </div>
              </>
            ) : (
              <p>You have mastered all required skills!</p>
            )}
          </div>
          
          {/* F10: Focus Timer */}
          <div className="glass dashboard__chart-card" style={{ padding: 20, textAlign: 'center' }}>
            <h4 style={{ color: 'var(--clr-secondary)', marginBottom: 10, textTransform: 'uppercase' }}>⏱️ Focus Mode</h4>
            <div style={{ width: 100, margin: '0 auto', marginBottom: 16 }}>
              <CircularProgressbar 
                value={(1 - timeLeft / 1500) * 100} 
                text={formatTime(timeLeft)}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: 'var(--clr-secondary)',
                  trailColor: 'rgba(255,255,255,0.1)'
                })}
              />
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => setTimerActive(!timerActive)}>
              {timerActive ? 'Pause Neural Link' : 'Start Focus Session'}
            </button>
          </div>

          {/* F8: Daily Challenge */}
          <div className="glass dashboard__chart-card" style={{ padding: 20 }}>
            <h4 style={{ color: 'var(--clr-emerald)', marginBottom: 10, textTransform: 'uppercase' }}>⚡ Daily Challenge</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>Read an article on Quantum Cryptography to earn 20 XP.</p>
            <button className="btn btn-sm btn-emerald" onClick={() => {
              addXP(20);
              awardBadge('Daily Scholar 📚');
              confetti({ particleCount: 50, spread: 60 });
            }}>Complete Challenge</button>
          </div>
        </div>

        {/* Second Widgets Row (Features 7, 9) */}
        <div className="grid-2 stagger-children" style={{ marginBottom: 32 }}>
          {/* F9: Peer Leaderboard */}
          <div className="glass dashboard__chart-card" style={{ padding: 20 }}>
            <h4 style={{ color: 'var(--clr-accent)', marginBottom: 10, textTransform: 'uppercase' }}>🏆 Global Leaderboard</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>1. CyberMage</span> <span>15,400 XP</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span>2. NeonNinja</span> <span>14,200 XP</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--clr-primary)', fontWeight: 'bold' }}><span>142. {profile.name || 'You'}</span> <span>{profile.xp || 0} XP</span></li>
            </ul>
          </div>

          {/* F7: Exportable Resume */}
          <div className="glass dashboard__chart-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--clr-primary)', marginBottom: 10, textTransform: 'uppercase' }}>📄 Neural Resume</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: 16, textAlign: 'center' }}>Generate a sleek PDF resume based on your verified skills and target roles.</p>
            <button className="btn btn-primary" onClick={() => alert('PDF generation initialized! (Mocked)')}>
              Export Resume PDF
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid-4 stagger-children" style={{ marginBottom: 32 }}>
          <StatCard icon="⚡" label="Total Skills in Profile" value={profile.skills?.length || 0} color="primary" delay={0} />
          <StatCard icon="✅" label="Skills Mastered (vs jobs)" value={stats.totalMastered} color="emerald" delay={80} />
          <StatCard icon="📚" label="Skills to Learn" value={stats.totalToLearn} color="amber" delay={160} />
          <StatCard icon="🎯" label="Overall Career Match" value={stats.overallMatch} suffix="%" color={matchColor} delay={240} />
        </div>

        {/* Tabs */}
        <div className="dashboard__tabs">
          {['overview', 'gaps', 'mastered'].map(tab => (
            <button
              key={tab}
              className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' ? '📊 Overview' : tab === 'gaps' ? '📚 Learning Queue' : '✅ Mastered'}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="dashboard__content animate-fadeIn">
            <div className="dashboard__charts-row">
              {/* Skill Match Radar */}
              <div className="glass dashboard__chart-card">
                <h3 className="chart-title">Skill Coverage Radar</h3>
                <p className="chart-sub">Your skill level vs. top career targets</p>
                <div style={{ maxWidth: 380, margin: '0 auto' }}>
                  <RadarChart jobGaps={jobGaps} />
                </div>
              </div>

              {/* Mastered vs To Learn Doughnut */}
              <div className="glass dashboard__chart-card">
                <h3 className="chart-title">Skills Overview</h3>
                <p className="chart-sub">Mastered vs. still needed across all targets</p>
                <div style={{ maxWidth: 260, margin: '24px auto 0' }}>
                  <DoughnutChart mastered={stats.totalMastered} toLearn={stats.totalToLearn} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <ProgressBar percent={stats.overallMatch} color={matchColor} label="Overall Readiness" />
                </div>
              </div>
            </div>

            {/* Job Match Bar */}
            {jobGaps.length > 0 && (
              <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
                <h3 className="chart-title">Career Match Scores</h3>
                <p className="chart-sub" style={{ marginBottom: 20 }}>How ready you are for each target role</p>
                <JobMatchBar jobGaps={jobGaps} />
              </div>
            )}

            {/* Job breakdown cards */}
            <div className="job-breakdown stagger-children">
              {jobGaps.map((gap, i) => (
                <div key={gap.job.jobTitle} className="job-breakdown-card glass animate-fadeInUp">
                  <div className="job-breakdown-card__header">
                    <span style={{ fontSize: '1.8rem' }}>{gap.job.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h4>{gap.job.jobTitle}</h4>
                      <span className="badge badge-intermediate" style={{ fontSize: '0.7rem' }}>{gap.job.domain}</span>
                    </div>
                    <div className={`match-badge match-badge--${gap.matchPercent >= 70 ? 'high' : gap.matchPercent >= 40 ? 'mid' : 'low'}`}>
                      {gap.matchPercent}%
                    </div>
                  </div>
                  <ProgressBar percent={gap.matchPercent} color={gap.matchPercent >= 70 ? 'emerald' : gap.matchPercent >= 40 ? 'amber' : 'primary'} />
                  <div className="job-breakdown-card__counts">
                    <span style={{ color: 'var(--clr-emerald)' }}>✓ {gap.masteredCount} mastered</span>
                    <span style={{ color: 'var(--clr-text-dim)' }}>· {gap.toLearn.length} to learn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gaps Tab ── */}
        {activeTab === 'gaps' && (
          <div className="animate-fadeIn">
            <div className="gaps-toolbar">
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
                {sortedToLearn.length} skills identified across your {selectedJobs.length} target career{selectedJobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="gaps-table glass">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="gaps-table__head">
                    <th>Skill</th>
                    <th>Priority</th>
                    <th>Level Needed</th>
                    <th>Your Level</th>
                    <th>Resources</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedToLearn.map(item => {
                    const resources = getResourcesForSkill(item.skill);
                    return (
                      <tr key={item.skill} className="gaps-table__row">
                        <td>
                          <strong style={{ fontSize: '0.9rem' }}>{item.skill}</strong>
                          {item.isUpgrade && <span style={{ fontSize: '0.7rem', color: 'var(--clr-amber)', marginLeft: 6 }}>↑ Upgrade</span>}
                        </td>
                        <td>
                          <span className={`badge badge-${item.priority.toLowerCase()}`}>{item.priority}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${item.levelNeeded.toLowerCase()}`}>{item.levelNeeded}</span>
                        </td>
                        <td>
                          {item.userLevel
                            ? <span className={`badge badge-${item.userLevel.toLowerCase()}`}>{item.userLevel}</span>
                            : <span style={{ color: 'var(--clr-text-dim)', fontSize: '0.8rem' }}>Not started</span>
                          }
                        </td>
                        <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + ' tutorial')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.75rem', color: '#00f3ff' }}
                          >
                            ▶️ Neural Download
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Mastered Tab ── */}
        {activeTab === 'mastered' && (
          <div className="animate-fadeIn">
            <div className="mastered-header">
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
                {profile.skills?.length || 0} skills in your current toolkit
              </p>
            </div>
            {profile.skills?.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: 48 }}>
                <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: 16 }}>📭</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Your toolkit is empty</h3>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>Update Profile</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {profile.skills.map(s => (
                    <div key={s.skillName} className="mastered-skill-card glass">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <SkillTag skillName={s.skillName} level={s.level} />
                      </div>
                      <div>
                        <label className="form-label" style={{ marginBottom: 6 }}>Update Level</label>
                        <select
                          className="form-select"
                          value={s.level}
                          onChange={e => updateSkillLevel(s.skillName, e.target.value)}
                          style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                        >
                          {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reset */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--clr-rose)', opacity: 0.6 }}
            onClick={() => { if (confirm('Purge all neural data?')) { resetProfile(); navigate('/'); } }}
          >
            🗑 Purge Data
          </button>
        </div>
      </div>
    </div>
  );
}
