import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import SkillTag from '../components/SkillTag';
import RadarChart from '../components/RadarChart';
import { DoughnutChart, JobMatchBar } from '../components/ProgressChart';
import { computeAllGaps, computeProfileStats, generateRoadmap } from '../utils/skillEngine';
import { getResourcesForSkill } from '../data/learningResources';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, selectedJobs, hasProfile, resetProfile, updateSkillLevel, addMasteredSkill } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('priority');

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

  return (
    <div className="dashboard page">
      <div className="container">

        {/* Header */}
        <div className="dashboard__header animate-fadeInUp">
          <div>
            <h1>Welcome back, <span className="text-gradient">{profile.name || 'Learner'}</span> 👋</h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6 }}>
              {profile.careerInterests?.length} target career{profile.careerInterests?.length !== 1 ? 's' : ''} · {profile.skills?.length} skills in your toolkit
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>✏️ Edit Profile</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/roadmap')}>🗺️ View Roadmap</button>
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
              {tab === 'overview' ? '📊 Overview' : tab === 'gaps' ? '📚 Skills to Learn' : '✅ Mastered Skills'}
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {gap.toLearn.slice(0, 4).map(t => (
                      <span key={t.skill} className="badge badge-high" style={{ fontSize: '0.72rem' }}>{t.skill}</span>
                    ))}
                    {gap.toLearn.length > 4 && (
                      <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)' }}>
                        +{gap.toLearn.length - 4} more
                      </span>
                    )}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label className="form-label" style={{ margin: 0 }}>Sort by</label>
                <select className="form-select" style={{ width: 140 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="priority">Priority</option>
                  <option value="level">Level Needed</option>
                  <option value="jobs">Most Jobs Need</option>
                </select>
              </div>
            </div>

            <div className="gaps-table glass">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="gaps-table__head">
                    <th>Skill</th>
                    <th>Priority</th>
                    <th>Level Needed</th>
                    <th>Your Level</th>
                    <th>Needed For</th>
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
                        <td style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                          {item.jobs.slice(0, 2).join(', ')}{item.jobs.length > 2 ? ` +${item.jobs.length - 2}` : ''}
                        </td>
                        <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {resources.slice(0, 1).map(r => (
                            <a
                              key={r.url}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {r.free ? '🆓' : '💰'} {r.type}
                            </a>
                          ))}
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + ' tutorial')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.75rem', color: '#ff003c' }}
                            title="Search YouTube Tutorials"
                          >
                            ▶️ Video
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
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>
                + Add More Skills
              </button>
            </div>

            {profile.skills?.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: 48 }}>
                <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: 16 }}>📭</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Your toolkit is empty</h3>
                <p style={{ color: 'var(--clr-text-muted)', marginBottom: 20 }}>Add the skills you already know to see what you should learn next.</p>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>Update Profile</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {profile.skills.map(s => {
                  // How many jobs need this skill
                  const neededFor = selectedJobs.filter(j =>
                    j.skillsRequired.some(req => req.skill.toLowerCase() === s.skillName.toLowerCase())
                  ).length;
                  return (
                    <div key={s.skillName} className="mastered-skill-card glass">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <SkillTag skillName={s.skillName} level={s.level} />
                        {neededFor > 0 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--clr-emerald)' }}>✓ {neededFor} job{neededFor !== 1 ? 's' : ''}</span>
                        )}
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
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reset */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--clr-rose)', opacity: 0.6 }}
            onClick={() => { if (confirm('Reset all profile data?')) { resetProfile(); navigate('/'); } }}
          >
            🗑 Reset Profile
          </button>
        </div>
      </div>
    </div>
  );
}
