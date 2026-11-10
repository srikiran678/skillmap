// ============================================================
// CERTIFICATE ENGINE — SkillMap
// Auto-generates certificates based on completed lessons
// ============================================================
import { LESSON_TRACKS } from '../data/lessonContent';

export const CERTIFICATE_PROGRAMS = [
  {
    id: 'cert-web',
    title: 'Web Fundamentals Certificate',
    icon: '🌐',
    color: '#e34c26',
    gradient: 'linear-gradient(135deg, #e34c26, #f06529)',
    trackId: 'web-fundamentals',
    requiredLessons: ['html-intro', 'css-basics', 'js-basics'],
    xpReward: 500,
    description: 'Mastery of HTML, CSS, and JavaScript — the core triad of web development.',
    issuer: 'SkillMap Academy',
    skills: ['HTML5', 'CSS3', 'JavaScript ES6+'],
  },
  {
    id: 'cert-python',
    title: 'Python Developer Certificate',
    icon: '🐍',
    color: '#3776ab',
    gradient: 'linear-gradient(135deg, #3776ab, #ffd43b)',
    trackId: 'python-essentials',
    requiredLessons: ['python-intro', 'python-data'],
    xpReward: 400,
    description: 'Proficiency in Python programming including data structures and Pythonic patterns.',
    issuer: 'SkillMap Academy',
    skills: ['Python 3', 'Data Structures', 'Functional Python'],
  },
  {
    id: 'cert-data',
    title: 'Data Science Foundations Certificate',
    icon: '📊',
    color: '#00b4d8',
    gradient: 'linear-gradient(135deg, #00b4d8, #0077b6)',
    trackId: 'data-science',
    requiredLessons: ['stats-basics'],
    xpReward: 450,
    description: 'Statistical analysis and data-driven thinking for modern data science roles.',
    issuer: 'SkillMap Academy',
    skills: ['Statistics', 'Data Analysis', 'Python Pandas'],
  },
  {
    id: 'cert-sysdesign',
    title: 'System Design & Distributed Data Certificate',
    icon: '🏗️',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    trackId: 'system-design',
    requiredLessons: ['system-design-intro', 'redis-caching', 'kafka-event-driven'],
    xpReward: 600,
    description: 'Architectural thinking for scalable, distributed, production-grade systems with Redis caching and Kafka streaming.',
    issuer: 'SkillMap Academy',
    skills: ['Distributed Systems', 'Scalability', 'CAP Theorem', 'Redis', 'Kafka'],
  },
  {
    id: 'cert-dsa',
    title: 'DSA & Problem Solving Certificate',
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    trackId: 'dsa',
    requiredLessons: ['arrays-basics'],
    xpReward: 550,
    description: 'Core data structures, algorithms, and interview-ready problem-solving patterns.',
    issuer: 'SkillMap Academy',
    skills: ['Arrays', 'Big-O Analysis', 'Two Pointers', 'Sliding Window'],
  },
  {
    id: 'cert-cyber',
    title: 'Cybersecurity Fundamentals Certificate',
    icon: '🛡️',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    trackId: 'cybersecurity-fundamentals',
    requiredLessons: ['cyber-basics', 'web-sec'],
    xpReward: 500,
    description: 'Mastery of foundational security principles, authorization models, and web vulnerabilities.',
    issuer: 'SkillMap Academy',
    skills: ['CIA Triad', 'AuthN/AuthZ', 'SQLi Prevention', 'XSS Mitigation'],
  },
  {
    id: 'cert-cloud',
    title: 'Cloud Architecture & DevOps Certificate',
    icon: '☁️',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    trackId: 'cloud-architecture',
    requiredLessons: ['cloud-intro', 'docker-prod', 'kubernetes-cluster'],
    xpReward: 600,
    description: 'Cloud infrastructure mastery: Multi-stage Docker containers, Kubernetes orchestrations, and CI/CD pipelines.',
    issuer: 'SkillMap Academy',
    skills: ['IaaS', 'PaaS', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
  },
  {
    id: 'cert-ai',
    title: 'Autonomous AI Agents & MCP Certificate',
    icon: '🤖',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)',
    trackId: 'ai-agents',
    requiredLessons: ['ai-intro', 'prompting', 'vector-dbs', 'langgraph-agents'],
    xpReward: 750,
    description: 'Mastery of agentic workflows, Model Context Protocol (MCP), vector embeddings, and LangGraph multi-agent orchestration.',
    issuer: 'SkillMap Academy',
    skills: ['LangGraph', 'Vector DBs', 'pgvector', 'MCP Protocol', 'ReAct Loops'],
  },
  {
    id: 'cert-frontend',
    title: 'Modern Frontend (React 19 & Next.js 15) Certificate',
    icon: '⚛️',
    color: '#61dafb',
    gradient: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
    trackId: 'modern-frontend',
    requiredLessons: ['react-19-actions', 'nextjs-15-app'],
    xpReward: 550,
    description: 'Cutting-edge client and server architecture: React 19 Actions, optimistic UI, and Next.js 15 App Router.',
    issuer: 'SkillMap Academy',
    skills: ['React 19', 'Next.js 15', 'Server Actions', 'TypeScript', 'App Router'],
  },
  {
    id: 'cert-go',
    title: 'High-Performance Backend (Go & gRPC) Certificate',
    icon: '🐹',
    color: '#00add8',
    gradient: 'linear-gradient(135deg, #00add8, #007d9c)',
    trackId: 'go-backend',
    requiredLessons: ['go-concurrency', 'grpc-microservices'],
    xpReward: 650,
    description: 'Concurrent backend systems using Go goroutines, channels, worker pools, and gRPC protocol buffers.',
    issuer: 'SkillMap Academy',
    skills: ['Golang', 'Goroutines', 'gRPC', 'Protocol Buffers', 'Concurrency'],
  },
  {
    id: 'cert-quantum',
    title: 'Quantum Computing Certificate',
    icon: '⚛️',
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    trackId: 'quantum-computing',
    requiredLessons: ['quantum-basics'],
    xpReward: 450,
    description: 'Understanding qubit superposition, Dirac bra-ket probability amplitudes, and quantum gate measurement collapses.',
    issuer: 'SkillMap Academy',
    skills: ['Superposition', 'Qubits', 'Hadamard Gate', 'Quantum Mechanics'],
  },
];

// Check which certificates the user has earned based on completedLessons
export const computeEarnedCertificates = (completedLessons = {}) => {
  return CERTIFICATE_PROGRAMS.map(cert => {
    const completedCount = cert.requiredLessons.filter(lid => completedLessons[lid]?.completed).length;
    const total = cert.requiredLessons.length;
    const earned = completedCount === total;
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { ...cert, earned, progress, completedCount, total };
  });
};

// Generate a unique credential ID from userId + certId
export const generateCredentialId = (userId = 'user', certId) => {
  const hash = [...`${userId}-${certId}-${Date.now()}`].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 0);
  return `SM-${hash.toString(16).toUpperCase().padStart(8, '0')}`;
};

export const getCertificateById = (certId) =>
  CERTIFICATE_PROGRAMS.find(c => c.id === certId) || null;
