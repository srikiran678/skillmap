import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LESSON_TRACKS, getLesson } from '../data/lessonContent';
import { computeEarnedCertificates } from '../utils/certificateEngine';
import confetti from 'canvas-confetti';
import './LearnPage.css';

// ── Simple Markdown renderer ──────────────────────────────────
function renderMarkdown(md) {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ');
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, m => `<table>${m.replace(/<td>/g, match => match).replace(/(<tr>[\s\S]*?<\/tr>)/g, (_, r) => r)}</table>`)
    .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h2-6|table|ul|blockquote|pre])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

// ── Try-It Editor ─────────────────────────────────────────────
function TryItEditor({ code, lang }) {
  const [editorCode, setEditorCode] = useState(code);
  const [running, setRunning] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewHtml, setPreviewHtml] = useState('');
  const [consoleOut, setConsoleOut] = useState('');
  const iframeRef = useRef(null);

  const isHtml = lang === 'html' || editorCode.trim().startsWith('<!DOCTYPE');
  const isPython = lang === 'python' || editorCode.trim().startsWith('#');

  const runCode = useCallback(() => {
    setRunning(true);
    if (isHtml) {
      setPreviewHtml(editorCode);
      setPreviewKey(k => k + 1);
    } else {
      // Simulate JS execution safely
      try {
        const logs = [];
        const fakeConsole = { log: (...args) => logs.push(args.map(String).join(' ')), error: (...args) => logs.push('ERROR: ' + args.join(' ')) };
        // eslint-disable-next-line no-new-func
        const fn = new Function('console', editorCode);
        fn(fakeConsole);
        setConsoleOut(logs.join('\n') || '// No output');
      } catch (e) {
        setConsoleOut(`Error: ${e.message}`);
      }
    }
    setTimeout(() => setRunning(false), 300);
  }, [editorCode, isHtml]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = editorCode;
      setEditorCode(val.substring(0, start) + '  ' + val.substring(end));
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="learn__editor-panel">
      <div className="learn__editor-header">
        <div className="learn__editor-title">
          <div className="learn__editor-dots">
            <div className="learn__editor-dot" style={{ background: '#ff5f57' }} />
            <div className="learn__editor-dot" style={{ background: '#febc2e' }} />
            <div className="learn__editor-dot" style={{ background: '#28c840' }} />
          </div>
          <span style={{ color: 'var(--clr-text-muted)' }}>
            {isHtml ? '🌐 HTML Editor' : isPython ? '🐍 Python Playground' : '⚡ JS Editor'} · Try It Yourself
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-dim)' }}>Ctrl+Enter to Run</span>
      </div>

      <textarea
        className="learn__editor-textarea"
        value={editorCode}
        onChange={e => setEditorCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div className="learn__editor-actions">
        <button
          className="learn__run-btn"
          onClick={runCode}
          disabled={running}
        >
          {running ? '⏳' : '▶'} {running ? 'Running...' : 'Run Code'}
        </button>
        <button
          className="learn__reset-btn"
          onClick={() => { setEditorCode(code); setConsoleOut(''); setPreviewHtml(''); }}
        >
          ↩ Reset
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>
          {isHtml ? 'Renders in browser preview below' : isPython ? 'Simulated output (JS env)' : 'JavaScript console output'}
        </span>
      </div>

      {/* Output for HTML */}
      {isHtml && (
        <div className="learn__preview">
          <div className="learn__preview-label">🖥 Live Preview</div>
          <iframe
            key={previewKey}
            ref={iframeRef}
            title="Preview"
            srcDoc={previewHtml || editorCode}
            sandbox="allow-scripts"
          />
        </div>
      )}

      {/* Console output for JS/Python */}
      {!isHtml && consoleOut && (
        <div className="learn__preview">
          <div className="learn__preview-label">📟 Output</div>
          <div style={{
            padding: '16px 24px',
            background: 'rgba(0,0,0,0.6)',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            lineHeight: 1.8,
            color: '#a8ff78',
            whiteSpace: 'pre-wrap',
            minHeight: 80,
          }}>
            {consoleOut}
          </div>
        </div>
      )}

      {!isHtml && !consoleOut && (
        <div style={{ padding: '10px 20px', fontSize: '0.78rem', color: 'var(--clr-text-dim)', fontStyle: 'italic' }}>
          Press ▶ Run Code to see output
        </div>
      )}
    </div>
  );
}

// ── Quiz Component ────────────────────────────────────────────
function QuizPanel({ quiz, onPass, lessonXp }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qi, opt) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qi]: opt }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    const pct = Math.round((correct / quiz.length) * 100);
    setScore(pct);
    setSubmitted(true);
    if (pct >= 75) {
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
      onPass(pct);
    }
  };

  const passed = submitted && score >= 75;
  const failed = submitted && score < 75;

  return (
    <div className="learn__quiz-panel">
      <div className="learn__quiz-title">
        <span>🧠</span> Knowledge Check
      </div>
      <div className="learn__quiz-subtitle">
        Answer all {quiz.length} questions · Need 75% to pass
      </div>

      {quiz.map((q, qi) => (
        <div key={qi} className="learn__quiz-question">
          <div className="learn__quiz-q">
            <span className="learn__quiz-q-num">{qi + 1}</span>
            {q.q}
          </div>
          <div className="learn__quiz-options">
            {q.options.map((opt, oi) => {
              let cls = 'learn__quiz-option';
              if (submitted) {
                if (oi === q.answer) cls += ' learn__quiz-option--correct';
                else if (answers[qi] === oi && oi !== q.answer) cls += ' learn__quiz-option--wrong';
                else if (answers[qi] === oi) cls += ' learn__quiz-option--selected';
              } else if (answers[qi] === oi) {
                cls += ' learn__quiz-option--selected';
              }

              return (
                <button
                  key={oi}
                  className={cls}
                  onClick={() => handleSelect(qi, oi)}
                  disabled={submitted}
                >
                  <div className={`learn__quiz-radio ${answers[qi] === oi ? 'learn__quiz-option--selected' : ''}`} />
                  <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                  {submitted && oi === q.answer && <span style={{ marginLeft: 'auto', color: 'var(--clr-emerald)' }}>✓</span>}
                  {submitted && answers[qi] === oi && oi !== q.answer && <span style={{ marginLeft: 'auto', color: '#ff6b6b' }}>✗</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          className="learn__quiz-submit"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < quiz.length}
        >
          Submit Answers →
        </button>
      )}

      {submitted && (
        <div className={`learn__quiz-result ${passed ? 'learn__quiz-result--pass' : 'learn__quiz-result--fail'}`}>
          <div className={`learn__quiz-score ${passed ? 'learn__quiz-score--pass' : 'learn__quiz-score--fail'}`}>
            {score}%
          </div>
          <div className="learn__quiz-feedback">
            {passed
              ? `🎉 Excellent! You scored ${score}%. +${Math.round(lessonXp * 0.5)} bonus XP awarded!`
              : `📚 You scored ${score}%. Need 75% to pass. Review the content and try again!`
            }
          </div>
          {failed && (
            <button
              className="learn__quiz-submit"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--clr-border)', color: 'var(--clr-text)' }}
              onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); }}
            >
              Retry Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function LearnPage() {
  const navigate = useNavigate();
  const { profile, hasProfile, addXP, addCoins, extendStreak, updateQuestProgress, completedLessons, completeLesson } = useUser();

  const [activeTrackId, setActiveTrackId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillmap_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  const toggleWatchlist = (lessonId) => {
    const next = watchlist.includes(lessonId)
      ? watchlist.filter(id => id !== lessonId)
      : [...watchlist, lessonId];
    setWatchlist(next);
    localStorage.setItem('skillmap_watchlist', JSON.stringify(next));
  };

  const activeTrack = LESSON_TRACKS.find(t => t.id === activeTrackId);
  const activeLesson = activeTrack?.lessons.find(l => l.id === activeLessonId);

  // Compute track progress
  const getTrackProgress = (track) => {
    const done = track.lessons.filter(l => completedLessons[l.id]?.completed).length;
    return { done, total: track.lessons.length, pct: Math.round((done / track.lessons.length) * 100) };
  };

  const handleLessonComplete = useCallback(() => {
    if (!activeLesson) return;
    completeLesson(activeLesson.id, activeLesson.xp);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00f3ff', '#b026ff', '#00ff66', '#ffd700'],
    });

    // Auto-advance to next lesson
    const lessons = activeTrack?.lessons || [];
    const idx = lessons.findIndex(l => l.id === activeLessonId);
    if (idx < lessons.length - 1) {
      setTimeout(() => {
        setActiveLessonId(lessons[idx + 1].id);
        setQuizPassed(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  }, [activeLesson, activeTrack, activeLessonId, completeLesson]);

  const handleQuizPass = useCallback((score) => {
    setQuizPassed(true);
    addXP(Math.round((activeLesson?.xp || 20) * 0.5));
  }, [activeLesson, addXP]);

  const isLessonDone = completedLessons[activeLessonId]?.completed;

  if (!hasProfile) {
    return (
      <div className="learn page">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📚</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Build Your Profile First</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Set up your career profile to get personalized learning tracks.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Get Started →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Track Selection View ──────────────────────────────────
  if (!activeTrackId) {
    const totalLessons = LESSON_TRACKS.reduce((acc, t) => acc + t.lessons.length, 0);
    const doneLessons = Object.values(completedLessons).filter(l => l.completed).length;
    const certs = computeEarnedCertificates(completedLessons);
    const earnedCerts = certs.filter(c => c.earned).length;

    const allLessons = LESSON_TRACKS.flatMap(t => t.lessons.map(l => ({ ...l, trackId: t.id, trackTitle: t.title, trackIcon: t.icon })));
    const searchedLessons = searchQuery.trim() === ''
      ? []
      : allLessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const bookmarkedLessons = allLessons.filter(l => watchlist.includes(l.id));

    return (
      <div className="learn page">
        <div className="container">
          <div className="animate-fadeInUp" style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 8 }}>
              Learning <span className="text-gradient">Centre</span> 📚
            </h1>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 20 }}>
              W3Schools-style interactive lessons with live code editors, quizzes, and certificates.
            </p>

            {/* Search Input */}
            <div style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="🔍 Search lessons, code, or topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--clr-border)',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Progress bar */}
            {searchQuery.trim() === '' && (
              <div className="learn__progress-header glass" style={{ padding: '16px 24px' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Overall Progress</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
                    {doneLessons} of {totalLessons} lessons complete · {earnedCerts} certificates earned
                  </div>
                </div>
                <div className="learn__progress-bar-wrap">
                  <div className="learn__progress-bar-fill" style={{ width: `${totalLessons ? Math.round((doneLessons/totalLessons)*100) : 0}%` }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-primary)', fontSize: '1.1rem' }}>
                  {totalLessons ? Math.round((doneLessons/totalLessons)*100) : 0}%
                </span>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.trim() !== '' && (
            <div className="animate-fadeIn" style={{ marginBottom: 40 }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-text-dim)', marginBottom: 16, fontWeight: 700 }}>
                Search Results ({searchedLessons.length})
              </div>
              {searchedLessons.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {searchedLessons.map(l => {
                    const done = !!completedLessons[l.id]?.completed;
                    return (
                      <div
                        key={l.id}
                        className="glass"
                        onClick={() => { setActiveTrackId(l.trackId); setActiveLessonId(l.id); setQuizPassed(false); }}
                        style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-xl)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{l.trackIcon} {l.trackTitle}</span>
                          {done && <span style={{ color: 'var(--clr-emerald)', fontSize: '0.8rem' }}>✅ Done</span>}
                        </div>
                        <h4 style={{ fontSize: '1rem', marginTop: 10, marginBottom: 6, fontWeight: 700 }}>{l.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--clr-text-dim)' }}>
                          <span>⏱️ {l.duration}</span>
                          <span>⚡ +{l.xp} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass" style={{ padding: '24px 32px', textAlign: 'center', color: 'var(--clr-text-muted)', borderRadius: 'var(--radius-xl)' }}>
                  No lessons found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* Watchlist / Bookmarks */}
          {bookmarkedLessons.length > 0 && searchQuery.trim() === '' && (
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-text-dim)', marginBottom: 16, fontWeight: 700 }}>
                ⭐ Bookmarked Lessons ({bookmarkedLessons.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {bookmarkedLessons.map(l => {
                  const done = !!completedLessons[l.id]?.completed;
                  return (
                    <div
                      key={l.id}
                      className="glass"
                      onClick={() => { setActiveTrackId(l.trackId); setActiveLessonId(l.id); setQuizPassed(false); }}
                      style={{ padding: 18, cursor: 'pointer', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge" style={{ fontSize: '0.68rem', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', borderColor: 'transparent' }}>
                          {l.trackIcon} {l.trackTitle}
                        </span>
                        {done && <span style={{ color: 'var(--clr-emerald)', fontSize: '0.75rem' }}>✅ Done</span>}
                      </div>
                      <h4 style={{ fontSize: '0.92rem', marginTop: 8, marginBottom: 6, fontWeight: 700 }}>{l.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>
                        <span>⏱️ {l.duration}</span>
                        <span>⚡ +{l.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {searchQuery.trim() === '' && (
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-text-dim)', marginBottom: 16, fontWeight: 700 }}>
              Choose a Learning Track
            </div>
          )}

          {searchQuery.trim() === '' && (
            <div className="learn__tracks">
              {LESSON_TRACKS.map(track => {
                const { done, total, pct } = getTrackProgress(track);
                return (
                  <div
                    key={track.id}
                    className="learn__track-card animate-fadeInUp"
                    onClick={() => { setActiveTrackId(track.id); setActiveLessonId(track.lessons[0].id); setQuizPassed(false); }}
                    style={{ '--track-gradient': track.gradient }}
                  >
                    <div className="learn__track-card::before" style={{ background: track.gradient }} />
                    <span className="learn__track-icon">{track.icon}</span>
                    <div className="learn__track-title">{track.title}</div>
                    <div className="learn__track-desc">{track.desc}</div>
                    <div className="learn__track-meta">
                      <span>{total} lesson{total !== 1 ? 's' : ''}</span>
                      <span style={{ color: done === total && total > 0 ? 'var(--clr-emerald)' : 'var(--clr-text-dim)' }}>
                        {done === total && total > 0 ? '✅ Complete' : `${done}/${total} done`}
                      </span>
                    </div>
                    <div className="learn__track-progress-bar">
                      <div
                        className="learn__track-progress-fill"
                        style={{ width: `${pct}%`, background: track.gradient }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Certificate preview */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-text-dim)', marginBottom: 16, fontWeight: 700 }}>
              Certificates Available
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {certs.map(c => (
                <div key={c.id} className="glass" style={{
                  padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
                  borderColor: c.earned ? 'rgba(255,215,0,0.3)' : undefined
                }}>
                  <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: c.earned ? '#ffd700' : 'var(--clr-text-dim)' }}>
                      {c.earned ? '🏆 Earned!' : `${c.progress}% complete`}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
                    onClick={(e) => { e.stopPropagation(); navigate('/certificates'); }}
                  >
                    {c.earned ? 'View' : 'Progress'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Lesson Viewer ─────────────────────────────────────────
  return (
    <div className="learn page">
      <div className="container">
        {/* Back + track breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setActiveTrackId(null); setActiveLessonId(null); }}>
            ← All Tracks
          </button>
          <span style={{ color: 'var(--clr-text-dim)', fontSize: '0.82rem' }}>/</span>
          <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.82rem' }}>{activeTrack?.icon} {activeTrack?.title}</span>
          <span style={{ color: 'var(--clr-text-dim)', fontSize: '0.82rem' }}>/</span>
          <span style={{ color: 'var(--clr-primary)', fontSize: '0.82rem' }}>{activeLesson?.title}</span>
        </div>

        <div className="learn__viewer">
          {/* Sidebar */}
          <aside className="learn__sidebar">
            <div className="learn__sidebar-header">
              <div style={{ fontSize: '1rem', marginBottom: 4 }}>{activeTrack?.icon} {activeTrack?.title}</div>
              <div className="learn__sidebar-title">Lessons</div>
            </div>
            <ul className="learn__lesson-nav">
              {activeTrack?.lessons.map((lesson, i) => {
                const done = !!completedLessons[lesson.id]?.completed;
                const isActive = lesson.id === activeLessonId;
                return (
                  <li
                    key={lesson.id}
                    className={isActive ? 'active' : done ? 'done' : ''}
                    onClick={() => { setActiveLessonId(lesson.id); setQuizPassed(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className={`learn__lesson-nav-icon ${done ? 'learn__lesson-nav-icon--done' : isActive ? 'learn__lesson-nav-icon--active' : 'learn__lesson-nav-icon--locked'}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{lesson.title}</span>
                    {done && <span style={{ marginLeft: 'auto', color: 'var(--clr-emerald)', fontSize: '0.75rem' }}>✅</span>}
                  </li>
                );
              })}
            </ul>
            <div className="learn__sidebar-back">
              <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => navigate('/certificates')}>
                🏆 My Certificates
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="learn__main">
            {/* Lesson header */}
            <div className="learn__lesson-header">
              <div className="learn__lesson-meta">
                <span className="learn__lesson-tag">{activeTrack?.icon} {activeTrack?.title}</span>
                <span className="learn__lesson-tag" style={{ background: 'rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.3)', color: '#ffd700' }}>
                  ⚡ +{activeLesson?.xp} XP
                </span>
                <span className="learn__lesson-tag" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--clr-border)', color: 'var(--clr-text-muted)' }}>
                  ⏱ {activeLesson?.duration}
                </span>
                {isLessonDone && (
                  <span className="learn__lesson-tag" style={{ background: 'rgba(0,255,102,0.1)', borderColor: 'rgba(0,255,102,0.3)', color: 'var(--clr-emerald)' }}>
                    ✅ Completed
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <h1 className="learn__lesson-h1" style={{ margin: 0 }}>{activeLesson?.title}</h1>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    borderColor: watchlist.includes(activeLesson?.id) ? 'rgba(0,243,255,0.4)' : undefined,
                    color: watchlist.includes(activeLesson?.id) ? 'var(--clr-primary)' : undefined
                  }}
                  onClick={() => toggleWatchlist(activeLesson?.id)}
                >
                  {watchlist.includes(activeLesson?.id) ? '⭐ Bookmarked' : '🔖 Bookmark'}
                </button>
              </div>
              <p className="learn__lesson-sub" style={{ marginTop: 8 }}>Follow the lesson, try the code, then prove your knowledge with the quiz below.</p>
            </div>

            {/* Lesson content */}
            <div className="learn__section-title">📖 Lesson Content</div>
            <div
              className="learn__content-panel"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson?.content || '') }}
            />

            {/* Try It Editor */}
            <div className="learn__section-title">⚡ Try It Yourself</div>
            {activeLesson && (
              <TryItEditor
                key={activeLessonId}
                code={activeLesson.code}
                lang={
                  activeLesson.code?.trim().startsWith('<!DOCTYPE') ? 'html'
                  : activeLesson.code?.trim().startsWith('#') ? 'python'
                  : 'js'
                }
              />
            )}

            {/* Quiz */}
            <div className="learn__section-title">🧠 Knowledge Check</div>
            {activeLesson && (
              <QuizPanel
                key={activeLessonId}
                quiz={activeLesson.quiz}
                onPass={handleQuizPass}
                lessonXp={activeLesson.xp}
              />
            )}

            {/* Complete Lesson Button */}
            <div className="learn__complete-bar">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
                  {isLessonDone ? '✅ Lesson Already Completed!' : 'Ready to finish this lesson?'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
                  {isLessonDone
                    ? `You earned ${activeLesson?.xp} XP for this lesson.`
                    : `Earn +${activeLesson?.xp} XP, +${Math.round((activeLesson?.xp || 0) / 5)} coins, and extend your streak.`
                  }
                </div>
              </div>
              <button
                className="learn__complete-btn"
                onClick={handleLessonComplete}
                disabled={isLessonDone}
              >
                {isLessonDone ? '✅ Done' : '🎉 Mark as Complete'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/hub')}
              >
                🎮 Hub
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/challenges')}
              >
                ⚡ Challenges
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
