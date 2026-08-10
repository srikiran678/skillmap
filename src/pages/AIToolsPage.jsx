import React, { useState, useMemo } from 'react';
import { AI_TOOLS_DB } from '../data/aiToolsDB';
import confetti from 'canvas-confetti';
import './AIToolsPage.css';

export default function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('Windows');
  const [expandedToolId, setExpandedToolId] = useState('tool-claude-code');
  const [copiedCmd, setCopiedCmd] = useState(null);

  // Setup Assistant state
  const [assistantToolId, setAssistantToolId] = useState('tool-claude-code');
  const [assistantOS, setAssistantOS] = useState('Windows');

  const categories = ['All', 'Agentic Frameworks', 'Code Editors', 'Local LLMs', 'Vision/GenAI'];
  const platforms = ['Windows', 'macOS', 'Linux'];

  const filteredTools = useMemo(() => {
    return AI_TOOLS_DB.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tool.developer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const assistantTool = AI_TOOLS_DB.find(t => t.id === assistantToolId) || AI_TOOLS_DB[0];
  const assistantSteps = assistantTool.installSteps[assistantOS] || assistantTool.installSteps['macOS'] || [];

  return (
    <div className="ai-tools-page page">
      {/* Toast Alert */}
      {copiedCmd && (
        <div className="ai-tools-toast">
          📋 Copied command to clipboard!
        </div>
      )}

      <div className="container">
        {/* Page Hero */}
        <div className="ai-tools-hero text-center">
          <div className="hero__badge">
            <span>🤖</span> AI Tools Release Agent
          </div>
          <h1 className="hero__title">
            Latest AI Tools & <span className="text-gradient">Installation Guide</span>
          </h1>
          <p className="hero__sub">
            Discover cutting-edge AI software releases. Step-by-step setup guides, terminal commands, and configuration walkthroughs for students and developers.
          </p>
        </div>

        {/* Interactive Setup Assistant Terminal */}
        <div className="terminal-assistant glass">
          <div className="terminal-assistant__header">
            <div className="terminal-dots">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            </div>
            <span className="terminal-assistant__title">⚡ Interactive AI Setup Assistant</span>
            <span className="badge badge-intermediate">1-CLICK TERMINAL GENERATOR</span>
          </div>

          <div className="terminal-assistant__body">
            <div className="assistant-controls">
              <div className="control-group">
                <label>1. Select AI Tool:</label>
                <select
                  value={assistantToolId}
                  onChange={e => setAssistantToolId(e.target.value)}
                  className="assistant-select"
                >
                  {AI_TOOLS_DB.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.name} ({t.developer})
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>2. Select Your OS:</label>
                <div className="os-btn-group">
                  {platforms.map(os => (
                    <button
                      key={os}
                      className={`os-btn ${assistantOS === os ? 'active' : ''}`}
                      onClick={() => setAssistantOS(os)}
                    >
                      {os === 'Windows' ? '🪟 Windows' : os === 'macOS' ? '🍎 macOS' : '🐧 Linux'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="assistant-output">
              <div className="assistant-output__meta">
                <span>Target: <strong>{assistantTool.name}</strong> on <strong>{assistantOS}</strong></span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => copyToClipboard(assistantTool.quickInstallCmd, 'quickInstall')}
                >
                  📋 Copy Quick Install Command
                </button>
              </div>

              <div className="terminal-code-box">
                <code>$ {assistantTool.quickInstallCmd}</code>
              </div>

              <div className="assistant-steps">
                <h5>Step-by-Step Installation Instructions:</h5>
                <ol>
                  {assistantSteps.map((step, idx) => (
                    <li key={idx}>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="ai-tools-filter-bar glass">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search AI tools by name, category, developer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="platform-toggle">
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)', marginRight: 8 }}>View OS:</span>
            {platforms.map(p => (
              <button
                key={p}
                className={`platform-btn ${selectedPlatform === p ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Directory Cards */}
        <div className="tools-list">
          {filteredTools.length === 0 ? (
            <div className="text-center glass" style={{ padding: 40 }}>
              <h3>No AI Tools Found</h3>
              <p style={{ color: 'var(--clr-text-muted)' }}>Try adjusting your search query or category filters.</p>
            </div>
          ) : (
            filteredTools.map(tool => {
              const isExpanded = expandedToolId === tool.id;
              const stepsForOS = tool.installSteps[selectedPlatform] || tool.installSteps['macOS'] || tool.installSteps['Windows'] || [];

              return (
                <div key={tool.id} className={`tool-card glass ${isExpanded ? 'expanded' : ''}`}>
                  <div className="tool-card__main" onClick={() => setExpandedToolId(isExpanded ? null : tool.id)}>
                    <div className="tool-card__left">
                      <span className="tool-icon">{tool.icon}</span>
                      <div>
                        <div className="tool-badge-row">
                          <span className="tool-category">{tool.category}</span>
                          <span className="tool-release">{tool.releaseDate}</span>
                          <span className="tool-rating">★ {tool.rating}</span>
                        </div>
                        <h3 className="tool-name">{tool.name}</h3>
                        <p className="tool-developer">By {tool.developer}</p>
                        <p className="tool-tagline">{tool.tagline}</p>
                      </div>
                    </div>

                    <div className="tool-card__right">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tool.quickInstallCmd, tool.id);
                        }}
                      >
                        📋 Copy CLI Command
                      </button>
                      <button className="btn btn-primary btn-sm">
                        {isExpanded ? 'Hide Steps ▲' : 'View Installation Guide ▼'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Guide */}
                  {isExpanded && (
                    <div className="tool-card__details">
                      <div className="details-grid">
                        <div>
                          <h4>📖 Description</h4>
                          <p>{tool.description}</p>

                          <h4 style={{ marginTop: 16 }}>⚡ Quick Installation Command</h4>
                          <div className="terminal-snippet">
                            <code>{tool.quickInstallCmd}</code>
                          </div>

                          <h4 style={{ marginTop: 16 }}>🛠️ Prerequisites</h4>
                          <div className="prereq-chips">
                            {tool.prerequisites.map(req => (
                              <span key={req} className="prereq-chip">✓ {req}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4>🚀 Installation Walkthrough ({selectedPlatform})</h4>
                          <ol className="install-step-list">
                            {stepsForOS.map((step, idx) => (
                              <li key={idx}>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>

                          <h4 style={{ marginTop: 16 }}>💡 Pro Usage Guide</h4>
                          <p className="usage-guide-box">{tool.usageGuide}</p>

                          <a
                            href={tool.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: 16, display: 'inline-block' }}
                          >
                            Official Documentation & Releases ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
