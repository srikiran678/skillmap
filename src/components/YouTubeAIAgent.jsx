import React, { useState, useEffect } from 'react';
import { getStoredAIVideos, triggerAgentScanForNewVideos } from '../utils/aiVideoAgent';
import confetti from 'canvas-confetti';
import './YouTubeAIAgent.css';

export default function YouTubeAIAgent() {
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scanning, setScanning] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeModalVid, setActiveModalVid] = useState(null);

  useEffect(() => {
    setVideos(getStoredAIVideos());
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const result = triggerAgentScanForNewVideos();
      setVideos(result.list);
      setScanning(false);

      if (result.added) {
        setToastMsg(`🤖 New Video Discovered: "${result.video.title}"`);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } else {
        setToastMsg(`⚡ AI Stream Synced: ${result.message}`);
      }

      setTimeout(() => setToastMsg(null), 4000);
    }, 1200);
  };

  const categories = ['All', 'AI Agents', 'LLMs & RAG', 'AI Tools & Code', 'Prompting', 'Computer Vision'];

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="ai-agent-section glass">
      {/* Toast notification */}
      {toastMsg && (
        <div className="ai-agent-toast">
          {toastMsg}
        </div>
      )}

      {/* Header Bar */}
      <div className="ai-agent-header">
        <div className="ai-agent-status">
          <div className={`ai-agent-pulse ${scanning ? 'ai-agent-pulse--active' : ''}`} />
          <div>
            <div className="ai-agent-title">
              <span>🤖 YouTube AI Stream Collector Agent</span>
              <span className="badge badge-intermediate" style={{ marginLeft: 8, fontSize: '0.68rem' }}>
                AUTONOMOUS MODE
              </span>
            </div>
            <p className="ai-agent-sub">
              {scanning ? 'Agent scanning YouTube networks for latest AI skills...' : `Live Stream Active · ${videos.length} Broadcasts Indexed`}
            </p>
          </div>
        </div>

        <button
          className={`btn btn-primary btn-sm ${scanning ? 'btn-disabled' : ''}`}
          onClick={handleScan}
          disabled={scanning}
        >
          {scanning ? '🔄 Scanning Stream...' : '🤖 Trigger Agent Scan'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="ai-agent-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`ai-agent-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="ai-agent-grid">
        {filteredVideos.map(vid => (
          <div key={vid.id} className="ai-video-card glass-bright">
            <div className="ai-video-thumb" onClick={() => setActiveModalVid(vid)}>
              <iframe
                src={vid.url}
                title={vid.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="ai-video-overlay">
                <span className="ai-video-play-btn">▶ Watch Video</span>
              </div>
            </div>

            <div className="ai-video-content">
              <div className="ai-video-meta">
                <span className="ai-video-category">{vid.category}</span>
                <span className="ai-video-rating">★ {vid.rating}</span>
              </div>

              <h4 className="ai-video-title">{vid.title}</h4>
              <p className="ai-video-channel">By {vid.channel}</p>
              <p className="ai-video-desc">{vid.desc}</p>

              <div className="ai-video-footer">
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.72rem' }}>
                  {vid.skill}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>
                  <span>👁️ {vid.views}</span> · <span>⏱️ {vid.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeModalVid && (
        <div className="ai-video-modal-backdrop" onClick={() => setActiveModalVid(null)}>
          <div className="ai-video-modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="ai-video-modal-header">
              <h3>{activeModalVid.title}</h3>
              <button className="ai-video-modal-close" onClick={() => setActiveModalVid(null)}>✕</button>
            </div>
            <div className="ai-video-modal-player">
              <iframe
                src={`${activeModalVid.url}?autoplay=1`}
                title={activeModalVid.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="ai-video-modal-details">
              <p><strong>Channel:</strong> {activeModalVid.channel}</p>
              <p><strong>Description:</strong> {activeModalVid.desc}</p>
              <a
                href={activeModalVid.youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12, display: 'inline-block' }}
              >
                Open directly on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
