import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import ForceGraph3D from 'react-force-graph-3d';
import './MindMap.css';

export default function MindMap() {
  const { profile, selectedJobs, hasProfile } = useUser();
  const navigate = useNavigate();
  const fgRef = useRef();

  const graphData = useMemo(() => {
    if (!hasProfile || selectedJobs.length === 0) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];
    const mainNodeId = 'career-center';

    // Center Node
    nodes.push({
      id: mainNodeId,
      name: profile.name ? `${profile.name}'s Neural Core` : 'Your Neural Core',
      val: 20,
      color: '#00f3ff',
      group: 0
    });

    // Create Job Nodes
    selectedJobs.forEach((job, i) => {
      const jobId = `job-${i}`;
      
      nodes.push({
        id: jobId,
        name: `${job.icon} ${job.jobTitle}`,
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

      // Create Skill Nodes for each Job
      job.skillsRequired.slice(0, 8).forEach((req, j) => {
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
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1
        });
      });
    });

    return { nodes, links };
  }, [hasProfile, selectedJobs, profile]);

  useEffect(() => {
    // Add some rotation
    if (fgRef.current) {
      let angle = 0;
      const interval = setInterval(() => {
        angle += 0.005;
        fgRef.current.cameraPosition({
          x: 400 * Math.cos(angle),
          z: 400 * Math.sin(angle)
        });
      }, 10);
      return () => clearInterval(interval);
    }
  }, [graphData]);

  if (!hasProfile) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>No Neural Link Established</h2>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>Initialize Link →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mindmap-page page">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
        <div className="roadmap__header animate-fadeInUp" style={{ paddingBottom: 10 }}>
          <div>
            <h1>🌌 3D Skill <span className="text-gradient">Galaxy</span></h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6 }}>
              Explore your neural pathway in three dimensions. Scroll to zoom, drag to rotate.
            </p>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="name"
            nodeColor="color"
            nodeRelSize={6}
            linkColor="color"
            linkWidth="width"
            backgroundColor="#050508"
            showNavInfo={false}
          />
        </div>
      </div>
    </div>
  );
}
