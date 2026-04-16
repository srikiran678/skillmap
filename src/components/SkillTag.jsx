import React from 'react';

const LEVEL_CONFIG = {
  Beginner: { cls: 'badge-beginner', dot: '#10b981' },
  Intermediate: { cls: 'badge-intermediate', dot: '#06b6d4' },
  Advanced: { cls: 'badge-advanced', dot: '#8b5cf6' },
};

export default function SkillTag({ skillName, level, onRemove, size = 'md' }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.Beginner;
  return (
    <span
      className={`badge ${config.cls}`}
      style={{ fontSize: size === 'sm' ? '0.7rem' : undefined }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: config.dot, flexShrink: 0,
      }} />
      {skillName}
      {level && <span style={{ opacity: 0.75, fontSize: '0.7em' }}>· {level}</span>}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: 'inherit',
            opacity: 0.6, padding: '0 2px',
            fontSize: '0.9em', lineHeight: 1,
          }}
          aria-label={`Remove ${skillName}`}
        >✕</button>
      )}
    </span>
  );
}
