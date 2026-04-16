import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function DoughnutChart({ mastered, toLearn }) {
  const data = {
    labels: ['Mastered', 'To Learn'],
    datasets: [{
      data: [mastered, toLearn],
      backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(99,102,241,0.85)'],
      borderColor: ['rgba(16,185,129,0.3)', 'rgba(99,102,241,0.3)'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8,12,20,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

export function JobMatchBar({ jobGaps = [] }) {
  const labels = jobGaps.map(g => g.job.jobTitle.replace(' Developer', ' Dev').replace(' Engineer', ' Eng'));
  const data = {
    labels,
    datasets: [
      {
        label: 'Match %',
        data: jobGaps.map(g => g.matchPercent),
        backgroundColor: jobGaps.map(g =>
          g.matchPercent >= 70 ? 'rgba(16,185,129,0.8)' :
          g.matchPercent >= 40 ? 'rgba(245,158,11,0.8)' :
          'rgba(99,102,241,0.8)'
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 }, callback: (v) => `${v}%` },
        border: { color: 'transparent' },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11, family: 'Inter' } },
        border: { color: 'transparent' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8,12,20,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        callbacks: { label: (ctx) => ` ${ctx.raw}% match` },
      },
    },
  };

  return (
    <div style={{ height: Math.max(180, jobGaps.length * 44) }}>
      <Bar data={data} options={options} />
    </div>
  );
}
