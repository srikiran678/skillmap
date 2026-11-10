import React, { useState, useEffect, useRef } from 'react';
import {
  querySeniorAITutor,
  reviewCodeWithAI,
  getBYOKConfig,
  saveBYOKConfig,
} from '../services/aiMentorEngine';
import './InteractiveAITutor.css';

export default function InteractiveAITutor({
  activeCode = '',
  activeLang = 'javascript',
  skillGaps = [],
  targetRole = '',
  isOpen = false,
  onClose = () => {},
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'review' | 'byok'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: skillGaps.length > 0
        ? `👋 **Greetings, Operative!** I noticed you bridged over from ResumeForge targeting **${targetRole || 'Software Engineer'}** with gaps in: **${skillGaps.join(', ')}**.\n\nI'm **Sentinel**, your Senior Developer AI Mentor. Ask me any question or ask for a custom learning path!`
        : `👋 **Hello, Operative!** I'm **Sentinel**, your Senior Developer AI Mentor. I can break down system architecture, explain complex code, review your scripts, or run interactive technical quizzes. How can I help you excel today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Code Review State
  const [reviewResult, setReviewResult] = useState(null);

  // BYOK Settings State
  const [byok, setByok] = useState(getBYOKConfig());
  const [byokStatus, setByokStatus] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await querySeniorAITutor({
        message: query,
        conversationHistory: messages,
        skillGaps,
        targetRole,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ **Agent Notice**: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerReview = () => {
    if (!activeCode) {
      alert('No code currently loaded in the editor to review.');
      return;
    }
    const result = reviewCodeWithAI(activeCode, activeLang);
    setReviewResult(result);
    setActiveTab('review');
  };

  const handleSaveBYOK = (e) => {
    e.preventDefault();
    saveBYOKConfig(byok);
    setByokStatus('✅ Settings saved! Live AI calls will use your configured key.');
    setTimeout(() => setByokStatus(''), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-tutor-drawer glass">
      {/* Drawer Header */}
      <div className="ai-tutor-header">
        <div className="ai-tutor-title">
          <span className="ai-tutor-avatar">🤖</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong>Sentinel AI Mentor</strong>
              <span className="badge badge-advanced" style={{ fontSize: '0.65rem' }}>
                {byok.enabled && byok.apiKey ? `LIVE ${byok.provider?.toUpperCase()}` : 'SENIOR DEV ENGINE'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-dim)' }}>
              Autonomous Technical Mentor & Code Reviewer
            </span>
          </div>
        </div>

        <button className="ai-tutor-close" onClick={onClose} title="Close AI Mentor">
          ✕
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="ai-tutor-tabs">
        <button
          className={`ai-tutor-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Mentor Chat
        </button>
        <button
          className={`ai-tutor-tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={handleTriggerReview}
        >
          🔍 Code Review
        </button>
        <button
          className={`ai-tutor-tab ${activeTab === 'byok' ? 'active' : ''}`}
          onClick={() => setActiveTab('byok')}
        >
          ⚙️ Live AI Settings
        </button>
      </div>

      {/* TAB 1: Chat */}
      {activeTab === 'chat' && (
        <div className="ai-tutor-chat-body">
          {/* Quick Prompts */}
          <div className="ai-tutor-quick-chips">
            {skillGaps.length > 0 && (
              <button
                className="ai-chip"
                onClick={() => handleSend(`How do I bridge my gaps in ${skillGaps.join(', ')}?`)}
              >
                🎯 Bridge My Gaps ({skillGaps.length})
              </button>
            )}
            <button
              className="ai-chip"
              onClick={() => handleSend("Explain Docker multi-stage builds and layer caching like a senior engineer.")}
            >
              🐳 Docker Mastery
            </button>
            <button
              className="ai-chip"
              onClick={() => handleSend("How does LangGraph coordinate stateful multi-agent workflows?")}
            >
              🤖 LangGraph & MCP
            </button>
            <button
              className="ai-chip"
              onClick={() => handleSend("Quiz me on high-scale System Design and Redis caching!")}
            >
              ⚔️ Senior Tech Quiz
            </button>
          </div>

          <div className="ai-tutor-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-tutor-msg ai-tutor-msg--${m.role}`}>
                <div className="ai-tutor-msg-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-tutor-msg ai-tutor-msg--assistant">
                <div className="ai-tutor-msg-content">
                  <span className="ai-tutor-typing">Thinking and analyzing architecture...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            className="ai-tutor-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. explain Kafka offsets, optimize my query)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Code Review */}
      {activeTab === 'review' && (
        <div className="ai-tutor-review-body">
          {reviewResult ? (
            <div className="ai-review-card">
              <div className="ai-review-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--clr-text)' }}>
                    AI Code Quality Report
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                    Estimated Complexity: <strong>{reviewResult.complexity}</strong>
                  </span>
                </div>
                <div
                  className="ai-review-score"
                  style={{
                    color: reviewResult.score >= 80 ? '#28c840' : reviewResult.score >= 60 ? '#febc2e' : '#ff5f57',
                    fontWeight: 700,
                    fontSize: '1.4rem'
                  }}
                >
                  {reviewResult.score}/100
                </div>
              </div>

              <div className="ai-review-verdict" style={{ marginTop: 12 }}>
                Status: <span className="badge badge-intermediate">{reviewResult.verdict}</span>
              </div>

              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 6 }}>🚨 Findings & Vulnerabilities:</h4>
                <ul style={{ paddingLeft: 18, fontSize: '0.82rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
                  {reviewResult.issues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 6 }}>💡 Senior Recommendations:</h4>
                <ul style={{ paddingLeft: 18, fontSize: '0.82rem', color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
                  {reviewResult.suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>

              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20, width: '100%' }}
                onClick={() => {
                  handleSend(`Here is my code for review:\n\`\`\`${activeLang}\n${activeCode}\n\`\`\`\nHow can I refactor this for production?`);
                  setActiveTab('chat');
                }}
              >
                💬 Ask Sentinel to Refactor This Code →
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--clr-text-muted)' }}>
              <p>No active review. Click "Review Editor Code" to audit your current code.</p>
              <button className="btn btn-primary btn-sm" onClick={handleTriggerReview}>
                Audit Current Editor Code
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BYOK Settings */}
      {activeTab === 'byok' && (
        <form className="ai-tutor-byok-body" onSubmit={handleSaveBYOK}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 6 }}>⚙️ Live Cloud AI Settings (BYOK)</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginBottom: 16 }}>
            Optionally connect your personal API Key to power Sentinel with real-time live LLM inference. Your key stays in your local browser only.
          </p>

          <label className="byok-label">
            <span>Enable Live Cloud LLM</span>
            <input
              type="checkbox"
              checked={byok.enabled || false}
              onChange={(e) => setByok(prev => ({ ...prev, enabled: e.target.checked }))}
            />
          </label>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: 4 }}>Provider</label>
            <select
              className="byok-select"
              value={byok.provider || 'gemini'}
              onChange={(e) => setByok(prev => ({ ...prev, provider: e.target.value }))}
            >
              <option value="gemini">Google Gemini (Recommended / Free Tier)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="groq">Groq (Ultra-Fast Llama 3.3)</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: 4 }}>API Key</label>
            <input
              type="password"
              className="byok-input"
              placeholder="Paste your API key here..."
              value={byok.apiKey || ''}
              onChange={(e) => setByok(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>

          {byokStatus && (
            <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#28c840' }}>
              {byokStatus}
            </div>
          )}

          <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Save Configuration
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setByok({ enabled: false, provider: 'gemini', apiKey: '' });
                saveBYOKConfig({ enabled: false, provider: 'gemini', apiKey: '' });
                setByokStatus('Reset to Built-in Senior Dev Engine.');
              }}
            >
              Reset to Local
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
