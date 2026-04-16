import React, { useEffect, useRef, useState } from 'react';
import './StatCard.css';

export default function StatCard({ icon, label, value, suffix = '', color = 'primary', delay = 0 }) {
  const [displayVal, setDisplayVal] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    const numericValue = parseInt(value) || 0;
    if (numericValue === 0) { setDisplayVal(value); return; }

    const duration = 1000;
    const startTime = performance.now() + delay;
    const step = (currentTime) => {
      if (currentTime < startTime) { requestAnimationFrame(step); return; }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, delay]);

  const colorMap = {
    primary: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#6366f1' },
    cyan: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)', text: '#06b6d4' },
    emerald: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#10b981' },
    amber: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
    rose: { bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.25)', text: '#f43f5e' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="stat-card glass animate-fadeInUp" style={{ '--card-delay': `${delay}ms` }}>
      <div className="stat-card__icon" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div className="stat-card__body">
        <div className="stat-card__value" style={{ color: c.text }}>
          {typeof displayVal === 'number' ? displayVal : value}{suffix}
        </div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
