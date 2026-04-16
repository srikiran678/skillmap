// ============================================================
// SKILL SUGGESTIONS — 200+ skills for autocomplete
// ============================================================

export const SKILL_SUGGESTIONS = [
  // ── Web Frontend ──
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue.js", "Angular",
  "Next.js", "Nuxt.js", "Svelte", "SvelteKit", "Astro", "Tailwind CSS",
  "Sass/SCSS", "Styled Components", "Webpack", "Vite", "Parcel",
  "Redux", "Zustand", "Recoil", "GraphQL", "Apollo Client",
  "REST APIs", "WebSockets", "Responsive Design", "CSS Animations",
  "Browser DevTools", "Accessibility (a11y)", "WCAG Standards", "ARIA",
  "Progressive Web Apps (PWA)", "Web Components", "Three.js", "D3.js",

  // ── Web Backend ──
  "Node.js", "Express.js", "Fastify", "Python", "Django", "Flask", "FastAPI",
  "Java", "Spring Boot", "PHP", "Laravel", "Ruby on Rails", "Go (Golang)",
  "Golang", "Rust", "C#", "ASP.NET", "NestJS", "tRPC",
  "Authentication & Security", "JWT", "OAuth2", "GraphQL API",
  "Microservices", "gRPC", "Message Queues", "WebSockets",
  "Serverless", "Edge Computing", "Caching (Redis)", "Rate Limiting",

  // ── Databases ──
  "SQL", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis",
  "Firebase", "DynamoDB", "Cassandra", "Elasticsearch", "Neo4j",
  "Supabase", "PlanetScale", "Database Design", "Data Modeling",
  "Performance Tuning", "Query Optimization", "Backup & Recovery",
  "Data Warehousing", "OLAP", "Data Lakes", "DAX",

  // ── Data & AI ──
  "Machine Learning", "Deep Learning", "Natural Language Processing",
  "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
  "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Plotly",
  "Statistics", "Data Visualization", "Tableau", "Power BI",
  "Jupyter Notebooks", "MLOps", "Data Analysis", "Excel", "R Programming",
  "LLM APIs", "Prompt Engineering", "RAG Systems", "LangChain",
  "HuggingFace", "Transformers / HuggingFace", "Feature Engineering",
  "Model Deployment", "Apache Spark", "Apache Kafka",
  "ETL Pipelines", "Airflow", "dbt", "Data Quality",
  "OpenCV", "CNNs", "Image Processing", "Text Mining",
  "Business Intelligence", "A/B Testing", "Experimentation",
  "Time Series Analysis", "Forecasting", "Recommendation Systems",

  // ── Cloud & DevOps ──
  "Docker", "Kubernetes", "CI/CD Pipelines", "Terraform", "Ansible",
  "Linux", "Bash Scripting", "Cloud Computing", "AWS", "Azure",
  "Google Cloud", "Networking", "Nginx", "Jenkins", "GitLab CI",
  "GitHub Actions", "ArgoCD", "Helm", "Prometheus", "Grafana",
  "Monitoring & Observability", "Cloud Networking", "IAM & Access Control",
  "Zero Trust Security", "Compliance (SOC2, ISO)", "FinOps",
  "Pulumi", "CDK (AWS)", "Istio", "Service Mesh",
  "Serverless (Lambda)", "Platform Engineering", "Internal Developer Platforms",

  // ── Cybersecurity ──
  "Network Security", "Ethical Hacking", "Web Application Security",
  "Incident Response", "Vulnerability Assessment", "Firewalls & IDS",
  "Penetration Testing", "SIEM Tools", "Metasploit", "Burp Suite",
  "Cryptography Basics", "Security Best Practices", "OSINT",
  "Malware Analysis", "Digital Forensics", "Threat Intelligence",
  "Security Architecture", "Risk Management", "Zero Trust Security",
  "Cloud Security", "Application Security (AppSec)", "Container Security",
  "VPN & Tunneling", "Windows Forensics", "Reverse Engineering",
  "Cyber-Physical Security", "HL7 / FHIR", "Healthcare Compliance (HIPAA)",

  // ── Mobile ──
  "Swift", "SwiftUI", "UIKit", "Xcode", "Core Data",
  "Kotlin", "Java", "Android Studio", "Jetpack Compose",
  "React Native", "Flutter", "Dart", "Expo",
  "Firebase", "App Store Publishing", "Push Notifications",
  "ARKit / ARCore", "Spatial Computing",
  "State Management (BLoC/Riverpod)", "Mobile Security",

  // ── Design ──
  "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD",
  "After Effects", "Adobe Premiere Pro", "InVision", "Sketch",
  "User Research", "Prototyping", "Wireframing", "Design Systems",
  "Usability Testing", "Typography", "Color Theory", "Branding",
  "Motion Design", "Print Design", "Presentation Design",
  "Blender", "Maya", "ZBrush", "Substance Painter",
  "UV Mapping", "Texturing & Shading", "3D Animation",
  "Storyboarding", "Video Editing", "Thumbnail Design", "Scriptwriting",
  "Instructional Design", "Affinity Mapping",

  // ── Business & Marketing ──
  "Agile / Scrum", "Kanban", "Product Strategy", "Roadmapping",
  "Stakeholder Management", "SEO", "Google Analytics",
  "Content Marketing", "Social Media Marketing", "YouTube SEO",
  "PPC / Google Ads", "Email Marketing", "Marketing Automation",
  "Copywriting", "Project Management", "Requirements Gathering",
  "Process Mapping", "CRM Tools", "WooCommerce", "Shopify",
  "Inventory Management", "Market Research", "A/B Testing",
  "Survey Design", "Interviewing Techniques", "Editorial Planning",

  // ── Programming Concepts ──
  "Data Structures & Algorithms", "Object-Oriented Programming",
  "Functional Programming", "Design Patterns", "System Design",
  "Clean Code", "Testing / QA", "Technical Writing",
  "API Documentation", "Docs-as-Code", "Markdown",
  "Editing & Proofreading",

  // ── Finance & Quant ──
  "Financial Modeling", "Risk Management", "R Programming",
  "Mathematics (Calculus)", "Mathematics (Linear Algebra)", "Econometrics",
  "Blockchain Basics", "DeFi Protocols", "Smart Contracts",

  // ── Gaming & Emerging ──
  "Unity", "Unreal Engine", "Blueprints (UE)", "C++", "Game Design",
  "Physics Simulation", "3D Math / Linear Algebra", "Level Design",
  "Player Psychology", "Writing & Narrative", "Shader Programming",
  "Solidity", "Ethereum", "Web3.js / ethers.js",
  "ROS (Robot Operating System)", "Embedded C / C++",
  "MQTT Protocol", "Raspberry Pi / Arduino", "Control Systems",
  "Bioinformatics Tools", "EHR Systems",

  // ── General Dev Tools ──
  "Git", "GitHub", "JIRA", "Postman", "VS Code", "Vim",
  "Linux Terminal", "SSH", "Browser DevTools",
];

// Deduplicate
const uniqueSkills = [...new Set(SKILL_SUGGESTIONS)].sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase())
);

export const searchSkills = (query) => {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  // Prioritize starts-with matches, then includes
  const startsWith = uniqueSkills.filter(s => s.toLowerCase().startsWith(q));
  const includes = uniqueSkills.filter(s => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q));
  return [...startsWith, ...includes].slice(0, 10);
};

export { uniqueSkills as ALL_SKILLS };
