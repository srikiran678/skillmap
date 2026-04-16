import React, { useEffect, useRef } from 'react';

export default function ProgressBar({ percent = 0, color = 'primary', label, showPercent = true, height = 8 }) {
  const barRef = useRef(null);

  const gradientMap = {
    primary: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    cyan: 'linear-gradient(90deg, #06b6d4, #6366f1)',
    emerald: 'linear-gradient(90deg, #10b981, #06b6d4)',
    amber: 'linear-gradient(90deg, #f59e0b, #ef4444)',
    rose: 'linear-gradient(90deg, #f43f5e, #8b5cf6)',
  };

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (barRef.current) barRef.current.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        });
      });
    }
  }, [percent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>{label}</span>}
          {showPercent && (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)' }}>
              {percent}%
            </span>
          )}
        </div>
      )}
      <div style={{
        width: '100%',
        height,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: gradientMap[color] || gradientMap.primary,
            borderRadius: 999,
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: color === 'primary' ? '0 0 10px rgba(99,102,241,0.4)' :
                       color === 'emerald' ? '0 0 10px rgba(16,185,129,0.4)' :
                       color === 'cyan' ? '0 0 10px rgba(6,182,212,0.4)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
