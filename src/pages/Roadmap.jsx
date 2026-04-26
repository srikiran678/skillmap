import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/ProgressBar';
import { generateRoadmap, estimateLearningTime } from '../utils/skillEngine';
import { getResourcesForSkill } from '../data/learningResources';
import './Roadmap.css';

const STAGES = ['To Learn', 'Learning', 'Achieved'];
const STAGE_ICONS = { 'To Learn': '📚', 'Learning': '🔥', 'Achieved': '🏆' };
const STAGE_COLORS = { 'To Learn': 'primary', 'Learning': 'amber', 'Achieved': 'emerald' };

export default function Roadmap() {
  const navigate = useNavigate();
  const { profile, selectedJobs, hasProfile, skillProgress, updateSkillStatus, addMasteredSkill, removeSkill } = useUser();
  const [filterPriority, setFilterPriority] = useState('All');
  const [expandedSkill, setExpandedSkill] = useState(null);

  if (!hasProfile) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>No Profile Found</h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Build your profile first to see your personalized roadmap.</p>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>Build My Profile →</button>
        </div>
      </div>
    );
  }

  const roadmap = useMemo(() => generateRoadmap(selectedJobs, profile.skills || []), [selectedJobs, profile.skills]);

  // Merge roadmap with progress state
  const enriched = roadmap.map(item => ({
    ...item,
    status: item.isMastered ? 'Achieved' : (skillProgress[item.skill]?.status || item.status || 'To Learn'),
  }));

  const filtered = filterPriority === 'All'
    ? enriched
    : enriched.filter(i => i.priority === filterPriority);

  // Group by stage
  const grouped = {
    'To Learn': filtered.filter(i => i.status === 'To Learn'),
    'Learning': filtered.filter(i => i.status === 'Learning'),
    'Achieved': filtered.filter(i => i.status === 'Achieved'),
  };

  const totalAchieved = enriched.filter(i => i.status === 'Achieved').length;
  const progressPct = enriched.length > 0 ? Math.round((totalAchieved / enriched.length) * 100) : 0;

  const handleStatusChange = (skill, newStatus) => {
    updateSkillStatus(skill, newStatus);
    if (newStatus === 'Achieved') {
      const item = roadmap.find(i => i.skill === skill);
      addMasteredSkill(skill, item ? item.levelNeeded : 'Intermediate');
    } else {
      removeSkill(skill);
    }
  };

  return (
    <div className="roadmap page">
      <div className="container">
        {/* Header */}
        <div className="roadmap__header animate-fadeInUp">
          <div>
            <h1>🗺️ Your Skill <span className="text-gradient">Roadmap</span></h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6 }}>
              {roadmap.length} skills to master across {selectedJobs.length} target career{selectedJobs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            📊 Back to Dashboard
          </button>
        </div>

        {/* Progress summary */}
        <div className="glass roadmap__progress animate-fadeInUp">
          <div className="roadmap__progress-stats">
            <div className="roadmap__progress-stat">
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1' }}>{filtered.filter(i => i.status === 'To Learn').length}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>To Learn</span>
            </div>
            <div className="roadmap__progress-stat">
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{filtered.filter(i => i.status === 'Learning').length}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Learning</span>
            </div>
            <div className="roadmap__progress-stat">
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{totalAchieved}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Achieved</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <ProgressBar percent={progressPct} color="emerald" label={`Roadmap Progress`} height={10} />
          </div>
        </div>

        {/* Filter bar */}
        <div className="roadmap__filters animate-fadeInUp">
          <span className="form-label" style={{ margin: 0 }}>Filter by priority:</span>
          {['All', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              className={`domain-tab ${filterPriority === p ? 'domain-tab--active' : ''}`}
              onClick={() => setFilterPriority(p)}
            >
              {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : p === 'Low' ? '🔵' : '📋'} {p}
            </button>
          ))}
        </div>

        {/* Stage columns */}
        <div className="roadmap__kanban">
          {STAGES.map(stage => (
            <div key={stage} className="roadmap__column">
              {/* Column header */}
              <div className={`roadmap__col-header roadmap__col-header--${STAGE_COLORS[stage]}`}>
                <span className="roadmap__col-icon">{STAGE_ICONS[stage]}</span>
                <h3>{stage}</h3>
                <span className="roadmap__col-count">{grouped[stage].length}</span>
              </div>

              {/* Skill cards */}
              <div className={`roadmap__cards roadmap__cards--${STAGE_COLORS[stage]}`}>
                {grouped[stage].length === 0 ? (
                  <div className="roadmap__empty">
                    {stage === 'Achieved' ? '🎉 Keep going!' : 'No skills here yet'}
                  </div>
                ) : (
                  grouped[stage].map(item => {
                    const resources = getResourcesForSkill(item.skill);
                    const isExpanded = expandedSkill === item.skill;
                    return (
                      <div key={item.skill} className={`roadmap-card glass ${isExpanded ? 'roadmap-card--expanded' : ''}`}>
                        <div
                          className="roadmap-card__top"
                          onClick={() => setExpandedSkill(isExpanded ? null : item.skill)}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <strong style={{ fontSize: '0.95rem' }}>{item.skill}</strong>
                              {item.isUpgrade && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: 99, border: '1px solid rgba(245,158,11,0.25)' }}>↑ Upgrade</span>
                              )}
                              {stage === 'Learning' && (
                                <span style={{ fontSize: '0.65rem', color: 'var(--clr-amber)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-amber)', boxShadow: '0 0 8px var(--clr-amber)' }} className="animate-pulse"></span>
                                  In Progress
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <span className={`badge badge-${item.priority.toLowerCase()}`}>{item.priority}</span>
                              <span className={`badge badge-${item.levelNeeded.toLowerCase()}`}>{item.levelNeeded}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-dim)', alignSelf: 'center' }}>
                                ⏱ {estimateLearningTime(item.levelNeeded, item.isUpgrade)}
                              </span>
                            </div>
                          </div>
                          <button
                            style={{
                              background: 'none', border: 'none', color: 'var(--clr-text-dim)',
                              cursor: 'pointer', fontSize: '1rem', padding: 4,
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                            aria-label="Expand"
                          >▾</button>
                        </div>

                        {/* Jobs need this */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)', marginTop: 8 }}>
                          Needed for: {item.jobs.slice(0, 2).join(', ')}{item.jobs.length > 2 ? ` +${item.jobs.length - 2}` : ''}
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="roadmap-card__expanded animate-fadeIn">
                            <div className="divider" style={{ margin: '12px 0' }} />
                            <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginBottom: 10 }}>
                              📚 Learning Resources
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {resources.slice(0, 3).map(r => (
                                <a
                                  key={r.url}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="resource-link"
                                >
                                  <span>{r.free ? '🆓' : '💰'}</span>
                                  <span style={{ flex: 1 }}>{r.title}</span>
                                  <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{r.type}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stage action buttons */}
                        <div className="roadmap-card__actions">
                          {stage !== 'Learning' && stage !== 'Achieved' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleStatusChange(item.skill, 'Learning')}
                            >
                              🔥 Start Learning
                            </button>
                          )}
                          {stage !== 'Achieved' && (
                            <button
                              className="btn btn-sm"
                              style={{ fontSize: '0.75rem', background: 'var(--grad-emerald)', color: '#fff' }}
                              onClick={() => handleStatusChange(item.skill, 'Achieved')}
                            >
                              ✓ Mark Achieved
                            </button>
                          )}
                          {stage === 'Achieved' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleStatusChange(item.skill, 'Learning')}
                            >
                              ↩ Revert
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
