// ============================================================
// AUTOMATED AI VIDEO STREAM AGENT UTILITY
// Collects, categorizes, and manages dynamic YouTube AI skill broadcasts
// ============================================================

const AI_VIDEO_COLLECTION_KEY = 'skillmap_ai_video_stream';

export const INITIAL_AI_VIDEOS = [
  {
    id: 'vid-langgraph-agent',
    title: 'Building Production AI Agents with LangGraph & Python',
    channel: 'Harrison Chase / LangChain',
    url: 'https://www.youtube.com/embed/5h-JBkyRB34',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=5h-JBkyRB34',
    category: 'AI Agents',
    skill: 'LangGraph',
    desc: 'Master multi-agent orchestration, state persistence, cycles, and human-in-the-loop agent workflows.',
    views: '450K views',
    time: 'Yesterday',
    rating: 9.9,
    featured: true
  },
  {
    id: 'vid-deepseek-r1',
    title: 'DeepSeek R1 Architecture & Local Deployment Guide',
    channel: 'AI Explained',
    url: 'https://www.youtube.com/embed/v3U5PblYgV4',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=v3U5PblYgV4',
    category: 'LLMs & RAG',
    skill: 'DeepSeek R1 Reasoning',
    desc: 'Deep dive into DeepSeek R1 reasoning models, open weights, local execution via Ollama, and performance benchmarks.',
    views: '1.1M views',
    time: '2 days ago',
    rating: 9.8,
    featured: true
  },
  {
    id: 'vid-cursor-ai',
    title: 'Cursor AI Complete Masterclass — 10x Developer Productivity',
    channel: 'Fireship',
    url: 'https://www.youtube.com/embed/gL23tLz2Z0A',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=gL23tLz2Z0A',
    category: 'AI Tools & Code',
    skill: 'AI Code Generation',
    desc: 'Learn how to leverage Cursor, Claude 3.7, rules files (.cursorrules), and multi-file code editing for maximum speed.',
    views: '890K views',
    time: '3 days ago',
    rating: 9.7,
    featured: true
  },
  {
    id: 'vid-vllm-serving',
    title: 'vLLM Fast LLM Inference Engine Deep Dive',
    channel: 'UC Berkeley Sky Computing',
    url: 'https://www.youtube.com/embed/80bIUggRJFw',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=80bIUggRJFw',
    category: 'LLMs & RAG',
    skill: 'vLLM & Fast Inference',
    desc: 'Understand PagedAttention, KV cache management, and how vLLM yields 24x higher throughput for LLM serving.',
    views: '310K views',
    time: '4 days ago',
    rating: 9.6,
    featured: false
  },
  {
    id: 'vid-google-ai-essential',
    title: 'Google AI Essentials — Complete Hands-on Guide',
    channel: 'Google Career Certificates',
    url: 'https://www.youtube.com/embed/01sTQyDhaD8',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=01sTQyDhaD8',
    category: 'Prompting',
    skill: 'Prompt Engineering',
    desc: 'Comprehensive run-through of prompt engineering, workplace productivity gains, and responsible AI implementation.',
    views: '1.5M views',
    time: '1 week ago',
    rating: 9.5,
    featured: false
  },
  {
    id: 'vid-comfyui-genai',
    title: 'ComfyUI Advanced Node-Based Generative AI Workflows',
    channel: 'Digital Art Pro',
    url: 'https://www.youtube.com/embed/n4sA6T9d47c',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=n4sA6T9d47c',
    category: 'Computer Vision',
    skill: 'ComfyUI',
    desc: 'Build custom image/video generation pipelines using ControlNet, AnimateDiff, and FLUX models in ComfyUI.',
    views: '280K views',
    time: '5 days ago',
    rating: 9.4,
    featured: false
  }
];

export const NEW_DISCOVERED_VIDEOS_POOL = [
  {
    id: 'vid-crewai-agents',
    title: 'CrewAI Framework Tutorial — Build a Team of Autonomous AI Specialists',
    channel: 'Brandon Hancock',
    url: 'https://www.youtube.com/embed/tneeKXOKFbo',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=tneeKXOKFbo',
    category: 'AI Agents',
    skill: 'Multi-Agent Systems',
    desc: 'Create collaborative AI agent crews with custom memory, tool access, and task delegation in Python.',
    views: '620K views',
    time: 'Just now',
    rating: 9.9,
    featured: true
  },
  {
    id: 'vid-rag-advanced',
    title: 'Advanced RAG Techniques: GraphRAG, Re-ranking & Vector Search',
    channel: 'DeepLearning.AI',
    url: 'https://www.youtube.com/embed/sVcwVQRHIc8',
    youtubeWatchUrl: 'https://www.youtube.com/watch?v=sVcwVQRHIc8',
    category: 'LLMs & RAG',
    skill: 'RAG Systems',
    desc: 'Implement hybrid retrieval, Cohere re-ranking, and knowledge graphs to eliminate hallucination in RAG pipelines.',
    views: '540K views',
    time: 'Just now',
    rating: 9.8,
    featured: true
  }
];

export const getStoredAIVideos = () => {
  try {
    const data = localStorage.getItem(AI_VIDEO_COLLECTION_KEY);
    return data ? JSON.parse(data) : INITIAL_AI_VIDEOS;
  } catch (e) {
    return INITIAL_AI_VIDEOS;
  }
};

export const saveStoredAIVideos = (videos) => {
  try {
    localStorage.setItem(AI_VIDEO_COLLECTION_KEY, JSON.stringify(videos));
  } catch (e) {
    console.error('Failed to save videos to localStorage', e);
  }
};

export const triggerAgentScanForNewVideos = () => {
  const current = getStoredAIVideos();
  // Pick one video from pool not already present
  const unadded = NEW_DISCOVERED_VIDEOS_POOL.filter(poolVid => !current.some(c => c.id === poolVid.id));
  
  if (unadded.length > 0) {
    const newVideo = unadded[0];
    const updated = [newVideo, ...current];
    saveStoredAIVideos(updated);
    return { added: true, video: newVideo, list: updated };
  } else {
    // If all added, simulate updating view metrics & refresh timestamps
    const updated = current.map(v => ({
      ...v,
      time: 'Updated 1m ago'
    }));
    saveStoredAIVideos(updated);
    return { added: false, message: 'All latest streams fully synchronized!', list: updated };
  }
};
