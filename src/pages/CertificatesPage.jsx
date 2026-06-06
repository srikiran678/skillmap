import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { computeEarnedCertificates, generateCredentialId } from '../utils/certificateEngine';
import confetti from 'canvas-confetti';
import './CertificatesPage.css';

export default function CertificatesPage() {
  const navigate = useNavigate();
  const { hasProfile, profile, completedLessons } = useUser();

  const [activeCert, setActiveCert] = useState(null); // certificate details when modal open
  const [copied, setCopied] = useState(false);

  // Compute certificate credentials from completedLessons
  const certificates = computeEarnedCertificates(completedLessons);
  const earnedCerts = certificates.filter(c => c.earned);
  const lockedCerts = certificates.filter(c => !c.earned);

  const doneLessonsCount = Object.values(completedLessons).filter(l => l.completed).length;

  const handleOpenCert = (cert) => {
    // Generate a unique credential ID if not already generated, or use deterministic generator
    const credId = generateCredentialId(profile?.name || 'operative', cert.id);
    setActiveCert({ ...cert, credentialId: credId });
    setCopied(false);
    confetti({ particleCount: 60, spread: 50 });
  };

  const handleCopyLink = (credId) => {
    const link = `https://skillmap.orpinapp/credentials/${credId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (cert) => {
    alert(`📥 Downloading credential image for "${cert.title}"...\nFile saved as: ${cert.id}-credential.png`);
  };

  if (!hasProfile) {
    return (
      <div className="certificates page">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏆</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Lock and Load</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Set up your career profile first. The Certificate Vault stores your accredited industry credentials.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Create Profile →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates page">
      <div className="container animate-fadeIn">
        {/* Header */}
        <div className="certificates__header">
          <h1 className="certificates__title">Certificate <span className="text-gradient">Vault</span> 🏆</h1>
          <p className="certificates__subtitle">Auto-generated, industry-aligned credentials unlocked upon mastery of learning tracks.</p>
        </div>

        {/* Stats Bar */}
        <div className="certificates__stats-bar">
          <div className="certificates__stat">
            <span className="certificates__stat-icon">🎓</span>
            <div>
              <div className="certificates__stat-val">{earnedCerts.length}</div>
              <div className="certificates__stat-label">Earned Credentials</div>
            </div>
          </div>
          <div className="certificates__stat">
            <span className="certificates__stat-icon">📖</span>
            <div>
              <div className="certificates__stat-val">{doneLessonsCount}</div>
              <div className="certificates__stat-label">Lessons Completed</div>
            </div>
          </div>
          <div className="certificates__stat">
            <span className="certificates__stat-icon">🔒</span>
            <div>
              <div className="certificates__stat-val">{lockedCerts.length}</div>
              <div className="certificates__stat-label">Locked Credentials</div>
            </div>
          </div>
        </div>

        {/* Grid of Certificates */}
        <div className="certificates__grid">
          {certificates.map(cert => {
            const dateEarned = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <div
                key={cert.id}
                className={`cert-card ${cert.earned ? 'cert-card--earned' : 'cert-card--locked'}`}
              >
                {/* Certificate Visual Part */}
                <div
                  className="cert-card__visual"
                  style={{ background: cert.gradient }}
                >
                  <div className="cert-card__visual-bg" style={{ background: cert.color }} />
                  <div className="cert-card__visual-pattern" />

                  {cert.earned ? (
                    <>
                      <div className="cert-card__earned-badge">👑 EARNED</div>
                      <div className="cert-card__visual-content">
                        <span className="cert-card__visual-icon">{cert.icon}</span>
                        <div className="cert-card__visual-title">{cert.title}</div>
                        <div className="cert-card__visual-issuer">{cert.issuer}</div>
                      </div>
                    </>
                  ) : (
                    <div className="cert-card__lock-overlay">
                      <span className="cert-card__lock-icon">🔒</span>
                      <span className="cert-card__lock-text">Milestone Lock</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="cert-card__body">
                  <h3 className="cert-card__title">{cert.title}</h3>
                  <p className="cert-card__desc">{cert.description}</p>

                  <div className="cert-card__skills">
                    {cert.skills.map(skill => (
                      <span key={skill} className="cert-card__skill-tag">{skill}</span>
                    ))}
                  </div>

                  {!cert.earned && (
                    <div className="cert-card__progress-wrap">
                      <div className="cert-card__progress-label">
                        <span>Milestone Progress</span>
                        <span>{cert.completedCount}/{cert.total} lessons</span>
                      </div>
                      <div className="cert-card__progress-bar">
                        <div
                          className="cert-card__progress-fill"
                          style={{ width: `${cert.progress}%`, background: cert.gradient }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="cert-card__footer">
                    {cert.earned ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => handleOpenCert(cert)}
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDownload(cert)}
                        >
                          📥 Download
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', borderColor: 'rgba(255,255,255,0.08)' }}
                        onClick={() => navigate('/learn')}
                      >
                        🚀 Learn Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Modal Viewer */}
        {activeCert && (
          <div className="cert-modal-overlay" onClick={() => setActiveCert(null)}>
            <div className="cert-modal" onClick={e => e.stopPropagation()}>
              <div className="cert-document" style={{ background: activeCert.gradient }}>
                <div className="cert-document__header">
                  <div className="cert-document__logo">⚡ SkillMap Credentials</div>
                  <h2 className="cert-document__title">CERTIFICATE OF COMPLETION</h2>
                  <div className="cert-document__subtitle">Honorable Achievement Award</div>
                </div>

                <div className="cert-document__body">
                  <div className="cert-document__awarded">This is proudly presented to</div>
                  <div className="cert-document__name">{profile?.name || 'SkillMap Operative'}</div>
                  <div className="cert-document__awarded">for successfully mastering the curriculum of</div>
                  <div className="cert-document__cert-name">{activeCert.title}</div>
                  <p className="cert-document__desc">
                    Demonstrated proficiency in {activeCert.skills.join(', ')} through interactive code assessments, comprehensive knowledge checks, and live algorithm simulations.
                  </p>

                  <div className="cert-document__skills">
                    {activeCert.skills.map(skill => (
                      <span key={skill} className="cert-document__skill">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="cert-document__footer">
                  <div className="cert-document__meta">
                    <div><strong>Issuer:</strong> {activeCert.issuer}</div>
                    <div><strong>Credential ID:</strong> {activeCert.credentialId}</div>
                    <div><strong>Date Issued:</strong> {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="cert-document__seal">
                    <span className="cert-document__seal-icon">🏆</span>
                    <span className="cert-document__seal-text">Official Seal</span>
                  </div>
                </div>
              </div>

              {/* Share and Close Panel */}
              <div className="cert-modal__actions">
                <button className="btn btn-primary" onClick={() => handleDownload(activeCert)}>
                  📥 Save PNG
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCopyLink(activeCert.credentialId)}
                >
                  {copied ? '✅ Copied' : '🔗 Copy Shareable Link'}
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveCert(null)}>
                  Close
                </button>
              </div>

              {copied && (
                <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8rem', color: 'var(--clr-primary)' }}>
                  Credential URL copied to clipboard!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
