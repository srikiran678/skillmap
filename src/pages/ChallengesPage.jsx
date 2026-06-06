import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import confetti from 'canvas-confetti';
import './ChallengesPage.css';

// ── CHALLENGE DATABASE ─────────────────────────────────────────
const CHALLENGES_LIST = [
  {
    id: 'ch-revstring',
    title: 'Reverse a String',
    category: 'JavaScript',
    difficulty: 'easy', // easy, medium, hard, expert
    desc: 'Write a JavaScript function that takes a string and returns it reversed. Example: "hello" -> "olleh".',
    duration: 5, // in minutes
    xp: 60,
    coins: 15,
    type: 'code', // code, mcq
    starterCode: `function reverseString(str) {\n  // Your code here\n  return str;\n}\n\n// Test call\nconsole.log(reverseString("SkillMap"));`,
    checkCode: `
      if (typeof reverseString !== 'function') throw new Error("reverseString function is not defined");
      const t1 = reverseString("hello");
      const t2 = reverseString("a");
      const t3 = reverseString("");
      if (t1 !== "olleh") throw new Error(\`Expected reverseString("hello") to be "olleh", got "\${t1}"\`);
      if (t2 !== "a") throw new Error(\`Expected reverseString("a") to be "a", got "\${t2}"\`);
      if (t3 !== "") throw new Error(\`Expected reverseString("") to be "", got "\${t3}"\`);
      console.log("✓ All test cases passed!");
    `
  },
  {
    id: 'ch-fizzbuzz',
    title: 'FizzBuzz Generator',
    category: 'JavaScript',
    difficulty: 'easy',
    desc: 'Write a function fizzBuzz(n) returning an array from 1 to n. For multiples of 3, add "Fizz". For multiples of 5, add "Buzz". For multiples of both, add "FizzBuzz". Otherwise add the string representation of the number.',
    duration: 8,
    xp: 70,
    coins: 20,
    type: 'code',
    starterCode: `function fizzBuzz(n) {\n  const result = [];\n  // Your code here\n  return result;\n}\n\nconsole.log(fizzBuzz(15));`,
    checkCode: `
      if (typeof fizzBuzz !== 'function') throw new Error("fizzBuzz function is not defined");
      const res = fizzBuzz(15);
      if (!Array.isArray(res)) throw new Error("fizzBuzz must return an array");
      if (res.length !== 15) throw new Error(\`Expected array length 15, got \${res.length}\`);
      if (res[2] !== "Fizz") throw new Error(\`Expected index 2 to be "Fizz", got "\${res[2]}"\`);
      if (res[4] !== "Buzz") throw new Error(\`Expected index 4 to be "Buzz", got "\${res[4]}"\`);
      if (res[14] !== "FizzBuzz") throw new Error(\`Expected index 14 to be "FizzBuzz", got "\${res[14]}"\`);
      if (res[0] !== "1" && res[0] !== 1) throw new Error(\`Expected index 0 to be "1" or 1, got "\${res[0]}"\`);
      console.log("✓ All test cases passed!");
    `
  },
  {
    id: 'ch-sqlagg',
    title: 'SQL Aggregations',
    category: 'Databases',
    difficulty: 'medium',
    desc: 'Which SQL clause is used to filter records AFTER an aggregation has been performed using a GROUP BY clause?',
    duration: 3,
    xp: 50,
    coins: 10,
    type: 'mcq',
    options: [
      'WHERE clause',
      'HAVING clause',
      'FILTER clause',
      'SORT BY clause'
    ],
    answer: 1, // index of option
    explanation: 'The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.'
  },
  {
    id: 'ch-capchoices',
    title: 'CAP Theorem Architecture',
    category: 'System Design',
    difficulty: 'medium',
    desc: 'If a network partition occurs in a distributed system, and you prioritize Consistency (C) over Availability (A), what must your system do when a write request comes to a partitioned node?',
    duration: 4,
    xp: 80,
    coins: 25,
    type: 'mcq',
    options: [
      'Accept the write and sync it later when partition resolves.',
      'Reject the write request or timeout, returning an error to the client to ensure consistency.',
      'Forward the write request via a secondary slow network line.',
      'Allow the write but mark the database as read-only for other nodes.'
    ],
    answer: 1,
    explanation: 'To maintain consistency, a system must reject writes on partitioned nodes so that stale or split-brain records do not accumulate.'
  },
  {
    id: 'ch-twosum',
    title: 'Two Sum Problem',
    category: 'Algorithms',
    difficulty: 'hard',
    desc: 'Write a JavaScript function twoSum(nums, target) that returns the indices of the two numbers that add up to the target. Assume exactly one solution exists. Example: nums = [2,7,11,15], target = 9 -> return [0,1].',
    duration: 15,
    xp: 120,
    coins: 40,
    type: 'code',
    starterCode: `function twoSum(nums, target) {\n  // Your O(n) or O(n log n) code here\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
    checkCode: `
      if (typeof twoSum !== 'function') throw new Error("twoSum function is not defined");
      const r1 = twoSum([2, 7, 11, 15], 9);
      const r2 = twoSum([3, 2, 4], 6);
      const r3 = twoSum([3, 3], 6);
      
      const checkPair = (res, expected) => {
        if (!Array.isArray(res) || res.length !== 2) return false;
        const s = [...res].sort();
        const e = [...expected].sort();
        return s[0] === e[0] && s[1] === e[1];
      };
      
      if (!checkPair(r1, [0, 1])) throw new Error(\`Expected [0, 1] for [2,7,11,15] target 9, got \${JSON.stringify(r1)}\`);
      if (!checkPair(r2, [1, 2])) throw new Error(\`Expected [1, 2] for [3,2,4] target 6, got \${JSON.stringify(r2)}\`);
      if (!checkPair(r3, [0, 1])) throw new Error(\`Expected [0, 1] for [3,3] target 6, got \${JSON.stringify(r3)}\`);
      console.log("✓ All test cases passed!");
    `
  },
  {
    id: 'ch-ratelimiter',
    title: 'Token Bucket Rate Limiter',
    category: 'System Design',
    difficulty: 'hard',
    desc: 'In a Token Bucket rate limiting algorithm, which of the following best describes how tokens are refilled?',
    duration: 5,
    xp: 90,
    coins: 30,
    type: 'mcq',
    options: [
      'A background thread runs every second to check all buckets and reset them to max capacity.',
      'Tokens are refilled lazily on each request arrival based on the time difference since the last request.',
      'A message queue sends token update events to every user at random intervals.',
      'The bucket is refilled only when it is completely empty.'
    ],
    answer: 1,
    explanation: 'Lazy refilling is highly efficient. When a request arrives, the elapsed time since the last request is multiplied by the fill rate to add tokens, capped at bucket capacity.'
  },
  {
    id: 'ch-slidingwindow',
    title: 'Sliding Window Maximum',
    category: 'Algorithms',
    difficulty: 'expert',
    desc: 'Write a JavaScript function maxSlidingWindow(nums, k) that returns the maximum element in each sliding window of size k. Example: nums = [1,3,-1,-3,5,3,6,7], k = 3 -> return [3,3,5,5,6,7]. Try to optimize for O(n) time complexity.',
    duration: 20,
    xp: 180,
    coins: 60,
    type: 'code',
    starterCode: `function maxSlidingWindow(nums, k) {\n  // Your O(n) code using a deque or heap here\n  return [];\n}\n\nconsole.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));`,
    checkCode: `
      if (typeof maxSlidingWindow !== 'function') throw new Error("maxSlidingWindow function is not defined");
      const r1 = maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
      const r2 = maxSlidingWindow([1], 1);
      const r3 = maxSlidingWindow([9, 11, 8, 5, 7, 10], 3);
      
      const arraysEqual = (a, b) => {
        if (a.length !== b.length) return false;
        return a.every((val, i) => val === b[i]);
      };
      
      if (!arraysEqual(r1, [3, 3, 5, 5, 6, 7])) throw new Error(\`Expected [3,3,5,5,6,7], got \${JSON.stringify(r1)}\`);
      if (!arraysEqual(r2, [1])) throw new Error(\`Expected [1], got \${JSON.stringify(r2)}\`);
      if (!arraysEqual(r3, [11, 11, 8, 10])) throw new Error(\`Expected [11, 11, 8, 10], got \${JSON.stringify(r3)}\`);
      console.log("✓ All test cases passed!");
    `
  }
];

const MOCK_PEERS = [
  { name: 'NeonNinja', speedFactor: 0.4, xpBase: 50 },
  { name: 'ByteRunner', speedFactor: 0.55, xpBase: 40 },
  { name: 'GitGhost', speedFactor: 0.7, xpBase: 45 },
  { name: 'NullPointer', speedFactor: 0.82, xpBase: 35 },
  { name: 'CyberMage', speedFactor: 0.5, xpBase: 55 },
  { name: 'CloudSurfer', speedFactor: 0.65, xpBase: 40 },
];

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { hasProfile, profile, addXP, addCoins, extendStreak, updateQuestProgress, completedChallenges, completeChallenge } = useUser();

  const [activeFilter, setActiveFilter] = useState('all');
  const [runningChallenge, setRunningChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [editorCode, setEditorCode] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [consoleOut, setConsoleOut] = useState('');
  const [resultsModal, setResultsModal] = useState(null); // { success: bool, xp: int, coins: int, timeSpent: string, scoreboard: array }

  const timerRef = useRef(null);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Filter challenges
  const filteredChallenges = CHALLENGES_LIST.filter(c => {
    if (activeFilter === 'all') return true;
    return c.difficulty === activeFilter;
  });

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'var(--clr-emerald)';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      case 'expert': return 'var(--clr-accent)';
      default: return 'var(--clr-text-muted)';
    }
  };

  // Start a challenge
  const startChallenge = (challenge) => {
    setRunningChallenge(challenge);
    setTimeLeft(challenge.duration * 60);
    setTotalSeconds(challenge.duration * 60);
    setSelectedOption(null);
    setConsoleOut('');
    if (challenge.type === 'code') {
      setEditorCode(challenge.starterCode);
    }
  };

  // Close running challenge without submitting
  const abortChallenge = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      setRunningChallenge(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Format timer string
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Run user code locally (JS sandbox)
  function runCode() {
    if (!runningChallenge) return;
    try {
      const logs = [];
      const fakeConsole = {
        log: (...args) => logs.push(args.map(String).join(' ')),
        error: (...args) => logs.push('ERROR: ' + args.join(' '))
      };
      // Compile starter + user adjustments + test runner checkCode
      const codeToRun = `${editorCode}\n\n${runningChallenge.checkCode}`;
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', codeToRun);
      fn(fakeConsole);
      setConsoleOut(logs.join('\n') || '// Execution succeeded (no print)');
      return { success: logs.join('\n').includes('✓ All test cases passed!') };
    } catch (e) {
      setConsoleOut(`FAIL: ${e.message}`);
      return { success: false };
    }
  }

  // Submit Result
  function submitResult(isCorrect) {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeSpentSeconds = totalSeconds - timeLeft;
    const timeSpentStr = formatTime(timeSpentSeconds);
    const challenge = runningChallenge;
    setRunningChallenge(null);

    const xpEarned = isCorrect ? challenge.xp : 10;
    const coinsEarned = isCorrect ? challenge.coins : 2;

    if (isCorrect) {
      completeChallenge(challenge.id, xpEarned, coinsEarned);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    } else {
      // Award participation XP/coins
      addXP(xpEarned);
      addCoins(coinsEarned);
    }

    // Build Mock Scoreboard
    const scoreboard = [];
    // User row
    scoreboard.push({
      rank: 1, // temporary, will sort
      name: profile?.name || 'You',
      timeSpent: timeSpentSeconds,
      timeSpentStr: timeSpentStr,
      xp: xpEarned,
      isUser: true,
      success: isCorrect
    });

    // Populate mock peers
    MOCK_PEERS.forEach(peer => {
      const peerSolved = Math.random() > 0.15; // 85% chance they solve it
      const peerTime = Math.round(challenge.duration * 60 * peer.speedFactor + (Math.random() * 60 - 30));
      scoreboard.push({
        rank: 0,
        name: peer.name,
        timeSpent: peerTime,
        timeSpentStr: formatTime(peerTime),
        xp: peerSolved ? challenge.xp + Math.round(peer.xpBase * 0.2) : 10,
        isUser: false,
        success: peerSolved
      });
    });

    // Sort scoreboard: solved first, then fastest time. Unsolved at bottom sorted by time.
    scoreboard.sort((a, b) => {
      if (a.success && !b.success) return -1;
      if (!a.success && b.success) return 1;
      return a.timeSpent - b.timeSpent;
    });

    // Recalculate ranks
    scoreboard.forEach((row, i) => {
      row.rank = i + 1;
    });

    setResultsModal({
      success: isCorrect,
      xp: xpEarned,
      coins: coinsEarned,
      timeSpent: timeSpentStr,
      scoreboard: scoreboard
    });
  }

  // Handle Timeout
  function handleTimeOut() {
    alert("⌛ Time is up! Grading your challenge based on current inputs.");
    if (runningChallenge.type === 'code') {
      const res = runCode();
      submitResult(res && res.success);
    } else {
      submitResult(false);
    }
  }

  function handleMCQSubmit() {
    if (!runningChallenge) return;
    const isCorrect = selectedOption === runningChallenge.answer;
    submitResult(isCorrect);
  }

  // Timer Effect
  useEffect(() => {
    if (runningChallenge && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto-submit on timeout
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [runningChallenge, timeLeft]);

  // Check if warning or danger status for timer
  const getTimerClass = () => {
    if (!runningChallenge) return '';
    const pct = totalSeconds > 0 ? timeLeft / totalSeconds : 1;
    if (pct < 0.1) return 'challenge-runner__timer--danger';
    if (pct < 0.25) return 'challenge-runner__timer--warning';
    return '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = editorCode;
      setEditorCode(val.substring(0, start) + '  ' + val.substring(end));
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
    }
  };

  // Statistics
  const totalChallenges = CHALLENGES_LIST.length;
  const solvedCount = Object.values(completedChallenges).filter(c => c.completed).length;

  if (!hasProfile) {
    return (
      <div className="challenges page">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚔️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Unlock Arena</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>Create your career profile to participate in timed challenges and lead the rankings.</p>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>Create Profile →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges page">
      <div className="container animate-fadeIn">
        {/* Hero Banner */}
        <div className="challenges__hero">
          <div className="challenges__hero-icon">⚔️</div>
          <div>
            <h1 className="challenges__hero-title">Challenge <span className="text-gradient">Arena</span></h1>
            <p className="challenges__hero-desc">Prove your expertise. Solve timed algorithms or system architecture puzzles and claim your place on the leaderboard.</p>
          </div>
          <div className="challenges__hero-stats">
            <div className="challenges__hero-stat">
              <div className="challenges__hero-stat-val">{solvedCount}/{totalChallenges}</div>
              <div className="challenges__hero-stat-label">Solved</div>
            </div>
            <div className="challenges__hero-stat">
              <div className="challenges__hero-stat-val" style={{ color: 'var(--clr-primary)' }}>
                {profile?.xp || 0}
              </div>
              <div className="challenges__hero-stat-label">XP Total</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="challenges__filters">
          <span className="challenges__filter-label">Difficulty:</span>
          {['all', 'easy', 'medium', 'hard', 'expert'].map(f => (
            <button
              key={f}
              className={`challenges__filter ${activeFilter === f ? 'challenges__filter--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => navigate('/learn')}
          >
            📚 Interactive Learn
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/hub')}
          >
            🎮 Hub
          </button>
        </div>

        {/* Grid */}
        <div className="challenges__grid">
          {filteredChallenges.map(challenge => {
            const isSolved = !!completedChallenges[challenge.id]?.completed;
            return (
              <div
                key={challenge.id}
                className={`challenge-card challenge-card--${challenge.difficulty} ${isSolved ? 'challenge-card--solved' : ''}`}
                onClick={() => startChallenge(challenge)}
              >
                <div className="challenge-card__header">
                  <div>
                    <span className="challenge-card__category">{challenge.category}</span>
                    <h3 className="challenge-card__title">{challenge.title}</h3>
                  </div>
                  <span className="challenge-card__icon">{challenge.type === 'code' ? '⚡' : '🧠'}</span>
                </div>
                <p className="challenge-card__desc">{challenge.desc}</p>
                <div className="challenge-card__footer">
                  <span className={`difficulty-badge difficulty-badge--${challenge.difficulty}`}>
                    {challenge.difficulty}
                  </span>
                  <div className="challenge-card__meta">
                    <span>⏱ {challenge.duration} min</span>
                    <span style={{ color: isSolved ? 'var(--clr-emerald)' : 'var(--clr-primary)' }}>
                      {isSolved ? '✅ Solved' : `⚡ +${challenge.xp} XP`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Challenge Runner Overlay */}
        {runningChallenge && (
          <div className="challenge-runner">
            <div className="challenge-runner__topbar">
              <span style={{ fontSize: '1.4rem' }}>{runningChallenge.type === 'code' ? '⚡' : '🧠'}</span>
              <h2 className="challenge-runner__title">
                {runningChallenge.title} · <span style={{ color: getDifficultyColor(runningChallenge.difficulty), textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }}>{runningChallenge.difficulty}</span>
              </h2>
              <div className={`challenge-runner__timer ${getTimerClass()}`}>
                ⏱ {formatTime(timeLeft)}
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={abortChallenge}
                style={{ borderColor: 'rgba(255,100,100,0.3)', color: '#ff8585' }}
              >
                Exit Arena
              </button>
            </div>

            <div className="challenge-runner__body">
              {/* Left Column: Description & MCQ details */}
              <div className="challenge-runner__problem">
                <div className="challenge-runner__problem-title">Problem Statement</div>
                <div className="challenge-runner__problem-desc">{runningChallenge.desc}</div>

                {runningChallenge.type === 'mcq' && (
                  <div className="challenge-runner__mcq">
                    <div className="challenge-runner__example-label">Select the best option:</div>
                    {runningChallenge.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`challenge-runner__option ${selectedOption === i ? 'challenge-runner__option--selected' : ''}`}
                        onClick={() => setSelectedOption(i)}
                      >
                        <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + i)}</span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {runningChallenge.type === 'code' && (
                  <>
                    <div className="challenge-runner__example-label">Test Case Assertions:</div>
                    <pre className="challenge-runner__example">
                      {runningChallenge.checkCode.trim().split('\n').map(l => l.trim()).filter(l => l.startsWith('if') || l.startsWith('const')).join('\n')}
                    </pre>
                  </>
                )}
              </div>

              {/* Right Column: Code Editor or Help tips */}
              <div className="challenge-runner__code-area">
                {runningChallenge.type === 'code' ? (
                  <>
                    <div className="challenge-runner__code-header">
                      <span>💻 JavaScript Workspace</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>Console output appears below</span>
                    </div>
                    <textarea
                      className="challenge-runner__textarea"
                      value={editorCode}
                      onChange={e => setEditorCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                    />
                    <div className="challenge-runner__output">
                      <div className="challenge-runner__example-label">Console Output</div>
                      {consoleOut || '// Press Run Tests to compile'}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🧠</div>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Conceptual Challenge</div>
                    <div style={{ fontSize: '0.85rem', maxWidth: 280 }}>No coding required. Read the description, select the correct option on the left, and submit.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="challenge-runner__bottombar">
              {runningChallenge.type === 'code' && (
                <button className="btn btn-secondary" onClick={runCode}>
                  ▶ Run Tests
                </button>
              )}
              <button
                className="btn btn-primary"
                style={{ marginLeft: 'auto' }}
                disabled={runningChallenge.type === 'mcq' ? selectedOption === null : false}
                onClick={runningChallenge.type === 'mcq' ? handleMCQSubmit : () => {
                  const res = runCode();
                  submitResult(res && res.success);
                }}
              >
                🚀 Submit Solution
              </button>
            </div>
          </div>
        )}

        {/* Results / Scoreboard Modal */}
        {resultsModal && (
          <div className="challenge-result">
            <div className="challenge-result__card">
              <span className="challenge-result__icon" style={{ filter: resultsModal.success ? 'drop-shadow(0 0 16px rgba(0,255,102,0.4))' : 'drop-shadow(0 0 16px rgba(255,100,100,0.4))' }}>
                {resultsModal.success ? '🏆' : '💀'}
              </span>
              <h2 className="challenge-result__title">
                {resultsModal.success ? 'Challenge Accepted!' : 'Execution Failed'}
              </h2>
              <p className="challenge-result__subtitle">
                {resultsModal.success
                  ? `Spectacular solution! You completed the challenge in ${resultsModal.timeSpent}.`
                  : 'Your solution did not pass all assertions or timed out.'
                }
              </p>

              <div className="challenge-result__stats">
                <div className="challenge-result__stat">
                  <div className="challenge-result__stat-val" style={{ color: resultsModal.success ? 'var(--clr-emerald)' : '#ff6b6b' }}>
                    {resultsModal.success ? 'PASS' : 'FAIL'}
                  </div>
                  <div className="challenge-result__stat-label">Result</div>
                </div>
                <div className="challenge-result__stat">
                  <div className="challenge-result__stat-val">+{resultsModal.xp}</div>
                  <div className="challenge-result__stat-label">XP Earned</div>
                </div>
                <div className="challenge-result__stat">
                  <div className="challenge-result__stat-val">+{resultsModal.coins}</div>
                  <div className="challenge-result__stat-label">Coins</div>
                </div>
              </div>

              {/* Scoreboard */}
              <div className="scoreboard">
                <div className="scoreboard__header">
                  <span className="scoreboard__title">🏁 Final Scoreboard</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>Ranked by Time</span>
                </div>
                {resultsModal.scoreboard.map(row => (
                  <div key={row.name} className={`scoreboard__row ${row.isUser ? 'scoreboard__row--user' : ''}`}>
                    <span className={`scoreboard__rank scoreboard__rank--${row.rank}`}>
                      {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                    </span>
                    <span style={{ fontWeight: row.isUser ? 700 : 500, color: row.isUser ? 'var(--clr-text)' : 'var(--clr-text-muted)' }}>
                      {row.name} {row.isUser ? '(You)' : ''}
                    </span>
                    <span className="scoreboard__time">
                      {row.success ? `⏱ ${row.timeSpentStr}` : '❌ DNF'}
                    </span>
                    <span className="scoreboard__xp">
                      +{row.xp} XP
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setResultsModal(null)}>
                  Return to Arena
                </button>
                <button className="btn btn-secondary" onClick={() => { setResultsModal(null); navigate('/hub'); }}>
                  🎮 Game Hub
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
