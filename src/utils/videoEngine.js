// ============================================================
// VIDEO ENGINE — Automatically serves relevant tech/AI videos
// ============================================================

const VIDEO_DATABASE = {
  // Artificial Intelligence & Machine Learning
  'artificial intelligence': 'ad79nYk2keg',
  'ai': 'ad79nYk2keg',
  'machine learning': 'GwIoAwCOGcg',
  'deep learning': '6M5VXKLf4D4',
  'neural networks': 'aircAruvnKk',
  'computer vision': '-4E2-0sxVUM',
  'natural language processing': 'fPvFcKgdHj8',
  'nlp': 'fPvFcKgdHj8',
  'generative ai': 'zjkBMFhNj_g',
  'large language models': 'zjkBMFhNj_g',
  'llm': 'zjkBMFhNj_g',
  'prompt engineering': 'jC4v5AS4RIM',
  'data science': 'X3paOmcrTjQ',
  'data analysis': 'r-uOLQRoYEE',

  // Web Development
  'react': 'bMknfKXIFA8',
  'javascript': 'W6NZfCO5SIk',
  'typescript': 'ahCwqrYpIuM',
  'node.js': 'TlB_eWDSMt4',
  'python': 'kqtD5dpn9C8',
  'html': 'qz0aGYrrlhU',
  'css': '1Rs2ND1ryYc',
  'next.js': 'ZVnjOPwW4ZA',

  // Newer Technologies
  'quantum computing': 'QuR9W9LyNF0',
  'blockchain': 'yubzJw0uiE4',
  'web3': 'nHhAEkG1y2U',
  'cybersecurity': 'inWWhr5tnEA',
  'cloud computing': 'M988_fsOSWo',
  'aws': '3hLmDS179YE',
  'docker': 'gAkwW2tuIqE',
  'kubernetes': 'd6WC5n9G_sM',
  'ar/vr': 'Nq3Xv7x6tZ4',
  'spatial computing': 'Nq3Xv7x6tZ4',
  'iot': 'LlhmzVL5bm8',
  'internet of things': 'LlhmzVL5bm8',
  'robotics': '4wD01115FqY',
  'devops': 'Xrgk023l4lI'
};

const DEFAULT_VIDEOS = [
  '01sTQyDhaD8', // Google AI Essentials
  '5NgNicANyqM', // AI for Everyone
  'bMknfKXIFA8', // React Course
  'kqtD5dpn9C8'  // Python Course
];

export const getVideoForTopic = (topic) => {
  if (!topic) return `https://www.youtube.com/embed/${DEFAULT_VIDEOS[0]}?autoplay=1`;
  
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Direct match
  if (VIDEO_DATABASE[normalizedTopic]) {
    return `https://www.youtube.com/embed/${VIDEO_DATABASE[normalizedTopic]}?autoplay=1`;
  }

  // Partial match
  for (const [key, id] of Object.entries(VIDEO_DATABASE)) {
    if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
  }

  // If no match is found, pick a random video from default
  const randomIndex = Math.floor(Math.random() * DEFAULT_VIDEOS.length);
  return `https://www.youtube.com/embed/${DEFAULT_VIDEOS[randomIndex]}?autoplay=1`;
};
