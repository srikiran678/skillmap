import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ jobGaps = [] }) {
  if (!jobGaps.length) return null;

  // Use top 3 jobs max for clarity
  const jobs = jobGaps.slice(0, 3);
  const allSkills = [...new Set(jobs.flatMap(g => g.job.skillsRequired.map(s => s.skill)))].slice(0, 8);

  const COLORS = [
    { border: 'rgba(99,102,241,0.9)', bg: 'rgba(99,102,241,0.15)' },
    { border: 'rgba(6,182,212,0.9)', bg: 'rgba(6,182,212,0.12)' },
    { border: 'rgba(16,185,129,0.9)', bg: 'rgba(16,185,129,0.12)' },
  ];

  const LEVEL_SCORE = { Beginner: 33, Intermediate: 66, Advanced: 100 };

  const datasets = jobs.map((gap, i) => {
    const data = allSkills.map(skill => {
      const mastered = gap.mastered.find(m => m.skill === skill);
      const toLearn = gap.toLearn.find(t => t.skill === skill);
      if (mastered) return LEVEL_SCORE[mastered.userLevel] || 66;
      if (toLearn?.userLevel) return LEVEL_SCORE[toLearn.userLevel] || 0;
      return 0;
    });
    return {
      label: gap.job.jobTitle,
      data,
      borderColor: COLORS[i % 3].border,
      backgroundColor: COLORS[i % 3].bg,
      borderWidth: 2,
      pointBackgroundColor: COLORS[i % 3].border,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
          stepSize: 33,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8,12,20,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw === 100 ? 'Advanced' : ctx.raw === 66 ? 'Intermediate' : ctx.raw === 33 ? 'Beginner' : 'Not Started'}`,
        },
      },
    },
  };

  return <Radar data={{ labels: allSkills, datasets }} options={options} />;
}
