import React, { useState, useMemo } from 'react';
import { GITHUB_REPOS_DB } from '../data/githubReposDB';
import confetti from 'canvas-confetti';
import './GitHubReposPage.css';

export default function GitHubReposPage() {
  const [activeAudience, setActiveAudience] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRepoId, setCopiedRepoId] = useState(null);

  const categories = ['All', 'AI & Agent Frameworks', 'Local LLMs & Serving', 'Learning & Interview Prep', 'RAG & Data Pipelines', 'Dev Productivity'];

  const filteredRepos = useMemo(() => {
    return GITHUB_REPOS_DB.filter(repo => {
      const matchesAudience = activeAudience === 'All' || repo.audience === activeAudience;
      const matchesCategory = activeCategory === 'All' || repo.category === activeCategory;
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            repo.problemSolved.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            repo.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAudience && matchesCategory && matchesSearch;
    });
  }, [activeAudience, activeCategory, searchQuery]);

  const copyCloneCommand = (cmd, repoId) => {
    navigator.clipboard.writeText(cmd);
    setCopiedRepoId(repoId);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedRepoId(null), 2500);
  };

  return (
    <div className="github-repos-page page">
      {/* Toast Alert */}
      {copiedRepoId && (
        <div className="repo-toast">
          📋 Copied `git clone` command to clipboard!
        </div>
      )}

      <div className="container">
        {/* Page Hero */}
        <div className="github-hero text-center">
          <div className="hero__badge">
            <span>🐙</span> Top GitHub AI Repositories
          </div>
          <h1 className="hero__title">
            Open-Source Repos for <span className="text-gradient">Students & Professionals</span>
          </h1>
          <p className="hero__sub">
            Accelerate your productivity and problem-solving. Hand-curated repositories to master AI frameworks, system design, local LLMs, and enterprise RAG pipelines.
          </p>
        </div>

        {/* Audience Toggle Bar */}
        <div className="audience-toggle-bar glass">
          <button
            className={`audience-btn ${activeAudience === 'All' ? 'active' : ''}`}
            onClick={() => setActiveAudience('All')}
          >
            🌐 All Repositories ({GITHUB_REPOS_DB.length})
          </button>
          <button
            className={`audience-btn ${activeAudience === 'Students' ? 'active' : ''}`}
            onClick={() => setActiveAudience('Students')}
          >
            🎓 For Students (Learning & Interview Prep)
          </button>
          <button
            className={`audience-btn ${activeAudience === 'Working Professionals' ? 'active' : ''}`}
            onClick={() => setActiveAudience('Working Professionals')}
          >
            💼 For Working Professionals (Enterprise & Automation)
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="repos-filter-bar glass">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search repositories by name, language, or problem solved..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Repos Grid */}
        <div className="repos-grid">
          {filteredRepos.length === 0 ? (
            <div className="text-center glass" style={{ padding: 40, gridColumn: '1 / -1' }}>
              <h3>No Repositories Found</h3>
              <p style={{ color: 'var(--clr-text-muted)' }}>Try adjusting your search criteria or category filter.</p>
            </div>
          ) : (
            filteredRepos.map(repo => (
              <div key={repo.id} className="repo-card glass glass-bright">
                <div className="repo-header">
                  <div className="repo-title-wrapper">
                    <span className="repo-icon">🐙</span>
                    <div>
                      <div className="repo-badge-row">
                        <span className="badge badge-intermediate" style={{ fontSize: '0.68rem' }}>
                          {repo.audience === 'Students' ? '🎓 Student Choice' : '💼 Pro Solution'}
                        </span>
                        <span className="repo-category">{repo.category}</span>
                      </div>
                      <h3 className="repo-name">{repo.name}</h3>
                    </div>
                  </div>

                  <div className="repo-stats">
                    <span className="stat-chip">⭐ {repo.stars}</span>
                    <span className="stat-chip">🍴 {repo.forks}</span>
                  </div>
                </div>

                <p className="repo-tagline">{repo.tagline}</p>

                <div className="problem-solved-box">
                  <div className="problem-solved-title">🎯 Problem Solved & Productivity Boost:</div>
                  <p className="problem-solved-desc">{repo.problemSolved}</p>
                </div>

                <div className="repo-meta-row">
                  <span>💻 <strong>Language:</strong> {repo.language}</span>
                  <span className="productivity-rating">⚡ Impact: {repo.productivityImpact}</span>
                </div>

                <div className="clone-terminal-box">
                  <code>{repo.cloneCmd}</code>
                </div>

                <div className="repo-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => copyCloneCommand(repo.cloneCmd, repo.id)}
                  >
                    📋 Copy `git clone`
                  </button>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    Open on GitHub ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
