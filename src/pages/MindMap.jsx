import React, { useMemo, useCallback } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './MindMap.css';

export default function MindMap() {
  const { profile, selectedJobs, hasProfile } = useUser();
  const navigate = useNavigate();

  const initialElements = useMemo(() => {
    if (!hasProfile || selectedJobs.length === 0) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];
    const mainNodeId = 'career-center';

    // Center Node
    nodes.push({
      id: mainNodeId,
      position: { x: 400, y: 300 },
      data: { label: profile.name ? \`\${profile.name}'s Career\` : 'Your Career' },
      className: 'mindmap-node-center',
      type: 'default'
    });

    // Create Job Nodes
    selectedJobs.forEach((job, i) => {
      const jobId = \`job-\${i}\`;
      const angle = (i / selectedJobs.length) * 2 * Math.PI;
      const radius = 250;
      
      nodes.push({
        id: jobId,
        position: { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) },
        data: { label: \`\${job.icon} \${job.jobTitle}\` },
        className: 'mindmap-node-job',
        type: 'default'
      });

      edges.push({
        id: \`edge-\${mainNodeId}-\${jobId}\`,
        source: mainNodeId,
        target: jobId,
        animated: true,
        style: { stroke: 'var(--clr-primary)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--clr-primary)' },
      });

      // Create Skill Nodes for each Job
      job.skillsRequired.slice(0, 8).forEach((req, j) => {
        const skillId = \`skill-\${i}-\${j}\`;
        const subAngle = angle + ((j - 3.5) * 0.2); // spread out
        const subRadius = 150;

        nodes.push({
          id: skillId,
          position: { 
            x: 400 + radius * Math.cos(angle) + subRadius * Math.cos(subAngle), 
            y: 300 + radius * Math.sin(angle) + subRadius * Math.sin(subAngle) 
          },
          data: { label: req.skill },
          className: \`mindmap-node-skill mindmap-node-\${req.levelNeeded.toLowerCase()}\`,
          type: 'default'
        });

        edges.push({
          id: \`edge-\${jobId}-\${skillId}\`,
          source: jobId,
          target: skillId,
          style: { stroke: 'var(--clr-border-bright)', strokeWidth: 1.5, opacity: 0.6 },
        });
      });
    });

    return { nodes, edges };
  }, [hasProfile, selectedJobs, profile]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialElements.edges);

  if (!hasProfile) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>No Profile Found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>Build My Profile →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mindmap-page page">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
        <div className="roadmap__header animate-fadeInUp" style={{ paddingBottom: 10 }}>
          <div>
            <h1>🧠 Career <span className="text-gradient">Mind Map</span></h1>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 6 }}>
              Interactive constellation of your targeted careers and required skills.
            </p>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            colorMode="dark"
          >
            <Background color="var(--clr-border)" gap={20} size={1.5} />
            <Controls style={{ background: 'var(--clr-bg2)', border: '1px solid var(--clr-border)', fill: 'var(--clr-text)' }} />
            <MiniMap 
              nodeColor={(n) => {
                if (n.className === 'mindmap-node-center') return 'var(--clr-accent)';
                if (n.className === 'mindmap-node-job') return 'var(--clr-primary)';
                return 'var(--clr-secondary)';
              }} 
              maskColor="rgba(10, 10, 18, 0.8)"
              style={{ background: 'var(--clr-bg2)', border: '1px solid var(--clr-border)' }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
