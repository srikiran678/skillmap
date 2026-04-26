import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SkillInput from '../components/SkillInput';
import SkillTag from '../components/SkillTag';
import { JOB_SKILLS_DB, DOMAINS } from '../data/jobSkillsDB';
import './ProfileForm.css';

const DEGREES = ['High School', 'Diploma', 'Associate Degree', "Bachelor's", "Master's", 'PhD', 'Professional Certification', 'Self-taught'];
const FIELDS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Science', 'Cybersecurity', 'Electrical Engineering', 'Business Administration', 'Mathematics', 'Statistics', 'Design', 'Marketing', 'Finance', 'Other'];
const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

const STEPS = [
  { id: 1, label: 'Academic Info', icon: '🎓' },
  { id: 2, label: 'Career Goals', icon: '🎯' },
  { id: 3, label: 'Your Skills', icon: '⚡' },
  { id: 4, label: 'Review', icon: '✅' },
];

function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`step-dot ${current === s.id ? 'step-dot--active' : current > s.id ? 'step-dot--done' : ''}`}>
            <span className="step-dot__icon">{current > s.id ? '✓' : s.icon}</span>
            <span className="step-dot__label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${current > s.id ? 'step-line--done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ProfileForm() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useUser();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [degree, setDegree] = useState(profile.academicQualifications?.[0]?.degree || '');
  const [field, setField] = useState(profile.academicQualifications?.[0]?.field || '');
  const [year, setYear] = useState(profile.academicQualifications?.[0]?.year || '');
  const [institution, setInstitution] = useState(profile.academicQualifications?.[0]?.institution || '');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [careerInterests, setCareerInterests] = useState(profile.careerInterests || []);
  const [skills, setSkills] = useState(profile.skills || []);
  const [customJob, setCustomJob] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If the profile is reset externally, sync the local state back to empty/default.
    if (!profile.name && profile.careerInterests?.length === 0) {
      setStep(1);
      setName('');
      setEmail('');
      setDegree('');
      setField('');
      setYear('');
      setInstitution('');
      setSelectedDomain(null);
      setCareerInterests([]);
      setSkills([]);
      setErrors({});
    }
  }, [profile]);

  const jobsForDomain = selectedDomain ? JOB_SKILLS_DB.filter(j => j.domain === selectedDomain) : [];

  const toggleJob = (title) => {
    setCareerInterests(prev =>
      prev.includes(title) ? prev.filter(j => j !== title) : [...prev, title]
    );
  };

  const addCustomJob = () => {
    if (customJob.trim() && !careerInterests.includes(customJob.trim())) {
      setCareerInterests(prev => [...prev, customJob.trim()]);
      setCustomJob('');
    }
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!name.trim()) e.name = 'Name is required';
      if (!degree) e.degree = 'Please select your degree';
    }
    if (step === 2) {
      if (careerInterests.length === 0) e.careers = 'Please select at least one career';
    }
    if (step === 3) {
      if (skills.length === 0) e.skills = 'Please add at least one skill';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = () => {
    const profileData = {
      name: name.trim(),
      email: email.trim(),
      academicQualifications: [{ degree, field, year, institution }],
      careerInterests,
      skills,
    };
    saveProfile(profileData);
    navigate('/dashboard');
  };

  return (
    <div className="profile-form page">
      <div className="container profile-form__container">
        <div className="profile-form__header animate-fadeInUp">
          <h1>Build Your Career Profile</h1>
          <p>It takes about 3 minutes. Let's get started.</p>
        </div>

        <StepIndicator current={step} />

        <div className="profile-form__card glass animate-fadeInUp">

          {/* ── Step 1: Academic Info ── */}
          {step === 1 && (
            <div className="form-step">
              <div className="form-step__header">
                <span className="form-step__emoji">🎓</span>
                <div>
                  <h2>Academic Background</h2>
                  <p>Tell us about your educational qualifications.</p>
                </div>
              </div>

              <div className="profile-form__grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Email (optional)</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Highest Degree *</label>
                  <select
                    className={`form-select ${errors.degree ? 'form-input--error' : ''}`}
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                  >
                    <option value="">Select degree…</option>
                    {DEGREES.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {errors.degree && <span className="form-error">{errors.degree}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Field of Study</label>
                  <select className="form-select" value={field} onChange={e => setField(e.target.value)}>
                    <option value="">Select field…</option>
                    {FIELDS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year of Completion</label>
                  <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
                    <option value="">Select year…</option>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">University / College</label>
                  <input
                    className="form-input"
                    placeholder="e.g. MIT, Stanford…"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Career Interests ── */}
          {step === 2 && (
            <div className="form-step">
              <div className="form-step__header">
                <span className="form-step__emoji">🎯</span>
                <div>
                  <h2>Career Interests</h2>
                  <p>What jobs do you want to pursue? Select all that interest you.</p>
                </div>
              </div>

              {errors.careers && <div className="form-error form-error--block">{errors.careers}</div>}

              <div className="domain-tabs">
                <button
                  className={`domain-tab ${selectedDomain === null ? 'domain-tab--active' : ''}`}
                  onClick={() => setSelectedDomain(null)}
                >All Domains</button>
                {DOMAINS.map(d => (
                  <button
                    key={d}
                    className={`domain-tab ${selectedDomain === d ? 'domain-tab--active' : ''}`}
                    onClick={() => setSelectedDomain(d)}
                  >{d}</button>
                ))}
              </div>

              <div className="job-grid">
                {(selectedDomain ? jobsForDomain : JOB_SKILLS_DB).map(job => (
                  <button
                    key={job.jobTitle}
                    type="button"
                    className={`job-card ${careerInterests.includes(job.jobTitle) ? 'job-card--selected' : ''}`}
                    onClick={() => toggleJob(job.jobTitle)}
                  >
                    <span className="job-card__icon">{job.icon}</span>
                    <span className="job-card__title">{job.jobTitle}</span>
                    <span className="job-card__domain">{job.domain}</span>
                    {careerInterests.includes(job.jobTitle) && (
                      <span className="job-card__check">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom job */}
              <div className="custom-job-row">
                <input
                  className="form-input"
                  placeholder="Add a custom job title…"
                  value={customJob}
                  onChange={e => setCustomJob(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomJob();
                    }
                  }}
                />
                <button type="button" className="btn btn-secondary" onClick={addCustomJob}>+ Add</button>
              </div>

              {careerInterests.length > 0 && (
                <div className="selected-careers">
                  <p className="form-label">Selected ({careerInterests.length}):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {careerInterests.map(c => (
                      <span key={c} className="badge badge-intermediate">
                        {c}
                        <button
                          onClick={() => toggleJob(c)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', marginLeft: 4 }}
                        >✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Skills ── */}
          {step === 3 && (
            <div className="form-step">
              <div className="form-step__header">
                <span className="form-step__emoji">⚡</span>
                <div>
                  <h2>Your Current Skills</h2>
                  <p>Add all the skills you already know and your proficiency level.</p>
                </div>
              </div>

              {errors.skills && <div className="form-error form-error--block">{errors.skills}</div>}

              <SkillInput skills={skills} onChange={setSkills} />

              {skills.length > 0 && (
                <div className="skills-summary glass" style={{ marginTop: 20, padding: 16 }}>
                  <p className="form-label" style={{ marginBottom: 10 }}>Added Skills ({skills.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {skills.map(s => (
                      <SkillTag
                        key={s.skillName}
                        skillName={s.skillName}
                        level={s.level}
                        onRemove={() => setSkills(prev => prev.filter(sk => sk.skillName !== s.skillName))}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="skills-tip">
                💡 <strong>Tip:</strong> Type a skill name and press Enter, or use the Add button. Select your honest proficiency level for accurate analysis.
              </div>
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="form-step">
              <div className="form-step__header">
                <span className="form-step__emoji">✅</span>
                <div>
                  <h2>Review Your Profile</h2>
                  <p>Everything look good? Submit to generate your skill gap analysis.</p>
                </div>
              </div>

              <div className="review-grid">
                <div className="review-section glass-bright">
                  <h3>🎓 Academic Background</h3>
                  <div className="review-row"><span>Name</span><strong>{name || '—'}</strong></div>
                  <div className="review-row"><span>Degree</span><strong>{degree || '—'}</strong></div>
                  <div className="review-row"><span>Field</span><strong>{field || '—'}</strong></div>
                  <div className="review-row"><span>Year</span><strong>{year || '—'}</strong></div>
                  <div className="review-row"><span>Institution</span><strong>{institution || '—'}</strong></div>
                </div>

                <div className="review-section glass-bright">
                  <h3>🎯 Career Interests ({careerInterests.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {careerInterests.map(c => (
                      <span key={c} className="badge badge-intermediate">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="review-section glass-bright" style={{ gridColumn: '1 / -1' }}>
                  <h3>⚡ Skills ({skills.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {skills.map(s => (
                      <SkillTag key={s.skillName} skillName={s.skillName} level={s.level} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="submit-note">
                🎉 You're all set! Click below to analyze your skill gaps and build your personalized roadmap.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={prevStep}
              disabled={step === 1}
            >
              ← Back
            </button>
            <span className="form-nav__step">{step} / {STEPS.length}</span>
            {step < 4 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Continue →
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ background: 'var(--grad-emerald)' }}>
                🚀 Generate My Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
