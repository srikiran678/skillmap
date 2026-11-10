import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ForceGraph3D from 'react-force-graph-3d';
import { getVideoForTopic } from '../utils/videoEngine';
import './MindMap.css';

export default function MindMap() {
  const { profile, selectedJobs, hasProfile } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fgRef = useRef();
  const [activeVideo, setActiveVideo] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [showDemo, setShowDemo] = useState(false);

  const querySkills = useMemo(() => {
    const raw = searchParams.get('skills');
    return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
  }, [searchParams]);
  const queryRole = searchParams.get('role') || '';

  const handleNodeClick = useCallback((node) => {
    if (node.group === 2) { // Skill node
      setActiveVideo({
        title: `Mastering ${node.name}`,
        url: getVideoForTopic(node.name)
      });
    } else if (node.group === 1) { // Job node
      setActiveVideo({
        title: `Career: ${node.name}`,
        url: getVideoForTopic(node.name)
      });
    }
  }, []);

  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];
    const mainNodeId = 'career-center';

    // 1. If Query Skills from ResumeForge or URL
    if (querySkills.length > 0) {
      nodes.push({
        id: mainNodeId,
        name: queryRole ? `${queryRole} Core` : 'ResumeForge Target Core',
        val: 20,
        color: '#00f3ff',
        group: 0
      });

      const roleId = 'target-role-node';
      nodes.push({
        id: roleId,
        name: `🎯 ${queryRole || 'Target Career Track'}`,
        val: 14,
        color: '#ff00ff',
        group: 1
      });

      links.push({
        source: mainNodeId,
        target: roleId,
        color: '#b026ff',
        width: 2.5
      });

      querySkills.forEach((skill, idx) => {
        const skillId = `qskill-${idx}`;
        nodes.push({
          id: skillId,
          name: skill,
          val: 8,
          color: idx < 3 ? '#ff003c' : (idx < 6 ? '#ffcc00' : '#00ff66'),
          group: 2
        });
        links.push({
          source: roleId,
          target: skillId,
          color: 'rgba(0, 243, 255, 0.4)',
          width: 1.5
        });
      });

      return { nodes, links };
    }

    // 2. If Saved Profile with Selected Jobs
    if (hasProfile && selectedJobs && selectedJobs.length > 0) {
      nodes.push({
        id: mainNodeId,
        name: profile.name ? `${profile.name}'s Neural Core` : 'Your Neural Core',
        val: 20,
        color: '#00f3ff',
        group: 0
      });

      selectedJobs.forEach((job, i) => {
        const jobId = `job-${i}`;
        nodes.push({
          id: jobId,
          name: `${job.icon || '🚀'} ${job.jobTitle}`,
          val: 12,
          color: '#ff00ff',
          group: 1
        });

        links.push({
          source: mainNodeId,
          target: jobId,
          color: '#b026ff',
          width: 2
        });

        const reqs = job.skillsRequired || [];
        reqs.slice(0, 8).forEach((req, j) => {
          const skillId = `skill-${i}-${j}`;
          nodes.push({
            id: skillId,
            name: req.skill,
            val: 6,
            color: req.levelNeeded === 'Advanced' ? '#ff003c' : (req.levelNeeded === 'Intermediate' ? '#ffcc00' : '#00ff66'),
            group: 2
          });

          links.push({
            source: jobId,
            target: skillId,
            color: 'rgba(255, 255, 255, 0.25)',
            width: 1
          });
        });
      });

      return { nodes, links };
    }

    // 3. Fallback / Interactive Demo Galaxy
    const demoJobs = [
      {
        title: 'Full Stack Engineer',
        icon: '💻',
        color: '#00f3ff',
        skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL']
      },
      {
        title: 'AI & Machine Learning Engineer',
        icon: '🤖',
        color: '#ff00ff',
        skills: ['Python', 'PyTorch', 'LangGraph', 'DeepSeek R1', 'Vector DBs', 'RAG']
      },
      {
        title: 'Cloud & DevOps Architect',
        icon: '☁️',
        color: '#00ff66',
        skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Distributed Systems']
      }
    ];

    nodes.push({
      id: mainNodeId,
      name: 'OmniTech Neural Galaxy',
      val: 22,
      color: '#ffffff',
      group: 0
    });

    demoJobs.forEach((job, i) => {
      const jobId = `demojob-${i}`;
      nodes.push({
        id: jobId,
        name: `${job.icon} ${job.title}`,
        val: 14,
        color: job.color,
        group: 1
      });
      links.push({
        source: mainNodeId,
        target: jobId,
        color: job.color,
        width: 2
      });

      job.skills.forEach((skill, j) => {
        const skillId = `demoskill-${i}-${j}`;
        nodes.push({
          id: skillId,
          name: skill,
          val: 7,
          color: job.color,
          group: 2
        });
        links.push({
          source: jobId,
          target: skillId,
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1
        });
      });
    });

    return { nodes, links };
  }, [hasProfile, selectedJobs, profile, querySkills, queryRole, showDemo]);

  // Smooth OrbitControls rotation without fighting mouse drag
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current) {
        const controls = fgRef.current.controls();
        if (controls) {
          controls.autoRotate = isRotating;
          controls.autoRotateSpeed = 0.8;
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isRotating, graphData]);

  const toggleRotation = () => {
    setIsRotating(prev => {
      const next = !prev;
      if (fgRef.current?.controls()) {
        fgRef.current.controls().autoRotate = next;
      }
      return next;
    });
  };

  const isDemoMode = !hasProfile && querySkills.length === 0;

  return (
    <div className="mindmap-page page">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
        <div className="roadmap__header animate-fadeInUp" style={{ paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>🌌 3D Skill <span className="text-gradient">Galaxy</span></h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6, fontSize: '0.9rem' }}>
              {querySkills.length > 0
                ? `Mapped ${querySkills.length} target skills for ${queryRole || 'Target Career'}. Click nodes to view tutorials.`
                : (isDemoMode
                  ? 'Interactive exploration galaxy. Click nodes to launch tutorials or customize your profile.'
                  : 'Explore your personalized neural pathway in 3D. Scroll to zoom, drag to rotate.')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={toggleRotation}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {isRotating ? '⏸ Pause Spin' : '▶ Auto-Rotate'}
            </button>
            {isDemoMode && (
              <button
                onClick={() => navigate('/profile')}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Build Custom Profile →
              </button>
            )}
          </div>
        </div>

        <div className="glass" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="name"
            nodeColor="color"
            nodeRelSize={6}
            nodeResolution={32}
            linkColor="color"
            linkWidth="width"
            linkResolution={16}
            backgroundColor="#050508"
            showNavInfo={false}
            enableNavigationControls={true}
            onNodeClick={handleNodeClick}
          />

          {/* Interactive Legend Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(5, 5, 8, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.75rem',
            color: '#cbd5e1',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f3ff' }}></span>
              <span>Core Track</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff00ff' }}></span>
              <span>Career Role</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff66' }}></span>
              <span>Mastered / Ready</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff003c' }}></span>
              <span>Critical Skill Gap</span>
            </div>
          </div>

          {activeVideo && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glass" style={{ width: '90%', maxWidth: 800, padding: '30px', position: 'relative', borderRadius: 'var(--radius-xl)' }}>
                <button 
                  onClick={() => setActiveVideo(null)} 
                  style={{ position: 'absolute', top: 15, right: 20, background: 'transparent', border: 'none', color: 'var(--clr-text)', fontSize: '2rem', cursor: 'pointer' }}
                >
                  &times;
                </button>
                <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--clr-primary)' }}>
                  🎥 {activeVideo.title}
                </h3>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <iframe 
                    src={activeVideo.url} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
