import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateYoutubeLink = (skill) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(skill + " tutorial");

const domains = {
  "Web Development": [
    "WebAssembly (Wasm)", "Micro-Frontends", "Server-Side Rendering (SSR)", "Static Site Generation (SSG)",
    "Edge Computing for Web", "WebGL", "WebRTC", "Service Workers", "Progressive Web Apps (PWA) Advanced",
    "Web Components", "Shadow DOM", "CSS Houdini", "Container Queries", "CSS Subgrid", "JAMstack Architecture",
    "Headless CMS Integration", "GraphQL Federation", "tRPC", "WebSockets Advanced", "Server-Sent Events (SSE)",
    "OAuth 2.0 & OIDC", "WebAuthn", "Content Security Policy (CSP)", "Cross-Site Scripting (XSS) Prevention",
    "Cross-Site Request Forgery (CSRF) Prevention", "Performance Budgets", "Core Web Vitals Optimization",
    "Module Federation (Webpack)", "Vite Advanced Configuration", "Esbuild", "SWC (Speedy Web Compiler)",
    "Turbopack", "Astro Framework", "Qwik Framework", "SolidJS", "SvelteKit Advanced", "Remix Framework",
    "Next.js App Router", "Nuxt 3 Advanced", "React Server Components", "State Machines (XState)",
    "RxJS / Reactive Programming", "IndexedDB", "Web Audio API", "Web Bluetooth API", "WebXR Device API",
    "Accessibility (WCAG 2.2+)", "Internationalization (i18n)", "E2E Testing (Playwright/Cypress)", "Visual Regression Testing"
  ],
  "Data & AI": [
    "Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "Vector Databases (Pinecone, Weaviate)",
    "Prompt Engineering Advanced", "Fine-Tuning LLMs (LoRA, QLoRA)", "LangChain / LlamaIndex", "AI Agents & Tool Use",
    "Transformers Architecture", "Diffusion Models", "Generative Adversarial Networks (GANs)", "Reinforcement Learning",
    "Graph Neural Networks (GNNs)", "Time Series Forecasting (Prophet, ARIMA)", "Anomaly Detection",
    "Natural Language Understanding (NLU)", "Computer Vision (YOLOv8, Segment Anything)", "Speech Recognition (Whisper)",
    "Text-to-Speech (TTS)", "MLOps Lifecycle", "Model Quantization & Pruning", "Edge AI / TinyML",
    "Federated Learning", "Explainable AI (XAI)", "Bias Detection & Mitigation in AI", "AutoML",
    "Data Mesh Architecture", "Data Lakehouse (Delta Lake, Apache Iceberg)", "Apache Spark Advanced",
    "Apache Flink (Stream Processing)", "Apache Kafka Advanced", "dbt (Data Build Tool)", "Airflow DAG Optimization",
    "Snowflake Advanced Analytics", "BigQuery ML", "Redshift Spectrum", "Data Governance & Lineage",
    "Master Data Management (MDM)", "Causal Inference", "A/B Testing & Experimentation Design",
    "Bayesian Statistics", "Deep Reinforcement Learning", "Recommendation Systems (Collaborative Filtering)",
    "Knowledge Graphs", "Ontology Engineering", "Semantic Search", "Feature Store Implementation",
    "Model Registry (MLflow)", "Kubeflow", "Triton Inference Server", "Ray (Distributed Computing)"
  ],
  "Cybersecurity": [
    "Zero Trust Architecture", "Cloud Security Posture Management (CSPM)", "Cloud Native Application Protection (CNAPP)",
    "Identity and Access Management (IAM) Advanced", "Privileged Access Management (PAM)", "Endpoint Detection and Response (EDR)",
    "Extended Detection and Response (XDR)", "Security Information and Event Management (SIEM) Engineering",
    "Security Orchestration, Automation, and Response (SOAR)", "Threat Hunting Methodology", "Cyber Threat Intelligence (CTI)",
    "Malware Reverse Engineering", "Advanced Persistent Threat (APT) Analysis", "Digital Forensics and Incident Response (DFIR)",
    "Memory Forensics", "Network Traffic Analysis (NTA)", "Web Application Firewall (WAF) Bypass", "API Security Testing",
    "DevSecOps Integration", "Software Bill of Materials (SBOM)", "Container Security (Kubernetes/Docker)",
    "Infrastructure as Code (IaC) Security Scanning", "Red Teaming Operations", "Purple Teaming", "Social Engineering Tactics",
    "Open Source Intelligence (OSINT) Advanced", "Cryptography (Post-Quantum)", "Homomorphic Encryption",
    "Blockchain Security & Smart Contract Auditing", "IoT Security", "Industrial Control Systems (ICS) Security",
    "SCADA Security", "Automotive Cybersecurity", "Aviation Cybersecurity", "Medical Device Cybersecurity",
    "Data Loss Prevention (DLP)", "Privacy Enhancing Technologies (PETs)", "GDPR/CCPA Compliance Engineering",
    "ISO 27001 Implementation", "MITRE ATT&CK Framework Mapping", "Fuzz Testing", "Static Application Security Testing (SAST)",
    "Dynamic Application Security Testing (DAST)", "Interactive Application Security Testing (IAST)", "Runtime Application Self-Protection (RASP)",
    "Biometric Security Systems", "Hardware Security Modules (HSM)", "Trusted Execution Environments (TEE)",
    "Cyber Deception Technology", "Ransomware Negotiation & Recovery"
  ],
  "Design": [
    "Design Systems Architecture", "Design Tokens Management", "Atomic Design Methodology", "Micro-Interactions & Animation",
    "3D Web Graphics (Spline, Three.js)", "Augmented Reality (AR) UI Design", "Virtual Reality (VR) Environment Design",
    "Spatial Computing Interface Design", "Voice User Interface (VUI) Design", "Conversational UX Design",
    "Neuromorphic Design", "Glassmorphism & Claymorphism", "Dark Mode Optimization", "Generative AI for Design (Midjourney, DALL-E)",
    "AI-Assisted Prototyping", "Data Visualization Design", "Dashboard & Analytics UX", "Gamification in UX",
    "Behavioral Design & Nudges", "Accessibility-First Design (A11y)", "Inclusive Design Practices", "Cross-Cultural Design",
    "Service Design Blueprinting", "Customer Journey Mapping", "Jobs-to-be-Done (JTBD) Framework", "Heuristic Evaluation",
    "Eye Tracking & Biometric UX Testing", "A/B Testing for Designers", "UX Copywriting / Microcopy", "Information Architecture (IA)",
    "Card Sorting & Tree Testing", "Advanced Typography & Variable Fonts", "Color Psychology & Perception",
    "Parametric Design", "Procedural Generation in Art", "Motion Graphics (After Effects Expressions)", "Cinema 4D for UX",
    "Figma Variables & Advanced Auto Layout", "Protopie / Framer High-Fidelity Prototyping", "Lottie Animations",
    "SVG Animation & Optimization", "Print & Packaging Design Advanced", "Brand Identity Systems", "Logo Design Grids & Geometry",
    "Wayfinding & Environmental Graphics", "Sound Design for UX", "Haptic Feedback Design", "Ethical Design Principles",
    "Sustainable Web Design", "Design Ops (Design Operations)"
  ],
  "Cloud & DevOps": [
    "Kubernetes Operator Pattern", "Helm Chart Development", "Service Mesh (Istio, Linkerd)", "eBPF (Extended Berkeley Packet Filter)",
    "Cilium Networking", "GitOps (ArgoCD, Flux)", "Infrastructure as Code (Terraform/OpenTofu)", "Pulumi (IaC with Code)",
    "AWS CDK (Cloud Development Kit)", "Serverless Architectures", "AWS Lambda Advanced", "Azure Functions & Durable Functions",
    "Google Cloud Run", "Cloud-Native Databases (Aurora, Spanner)", "Multi-Cloud Strategy & Management",
    "FinOps (Cloud Cost Optimization)", "Site Reliability Engineering (SRE)", "Error Budgets & SLOs", "Chaos Engineering (Gremlin, Chaos Mesh)",
    "Observability (OpenTelemetry)", "Prometheus PromQL Advanced", "Grafana Dashboards & Alerting", "Distributed Tracing (Jaeger, Zipkin)",
    "Log Aggregation (ELK/EFK Stack)", "Loki & Promtail", "CI/CD Pipeline Security", "GitHub Actions Custom Runners",
    "GitLab CI/CD Advanced", "Jenkins Pipeline as Code", "Tekton Pipelines", "Spinnaker Continuous Delivery",
    "Container Runtime (containerd, CRI-O)", "Docker Buildx & Multi-Arch Builds", "MicroVMs (Firecracker)", "WebAssembly (Wasm) on the Server",
    "Edge Computing (Cloudflare Workers, Fastly)", "CDN Advanced Configuration", "API Gateways (Kong, APISIX)",
    "Load Balancing Strategies", "Network Peering & Transit Gateways", "VPC Flow Logs Analysis", "Secret Management (HashiCorp Vault)",
    "Zero Trust Network Access (ZTNA)", "Identity-Aware Proxy (IAP)", "Disaster Recovery Planning", "Active-Active Architecture",
    "Blue-Green & Canary Deployments", "Database Migration Strategies", "Immutable Infrastructure", "Bare Metal Cloud Automation"
  ],
  "Mobile Development": [
    "SwiftUI Advanced State Management", "Combine Framework (iOS)", "Core Data & SwiftData", "Metal API (iOS Graphics)",
    "ARKit & RealityKit", "App Clips & Widgets (iOS)", "Background Tasks & Execution (iOS)", "Jetpack Compose Advanced",
    "Kotlin Coroutines & Flow", "Room Database (Android)", "Android NDK (C/C++ integration)", "ARCore",
    "Android App Bundles & Dynamic Delivery", "Background Processing (WorkManager)", "React Native Reanimated",
    "React Native Skia", "Expo Application Services (EAS)", "React Native New Architecture (Fabric/TurboModules)",
    "Flutter Custom Render Objects", "Flutter Animations Advanced", "Dart Isolates & Concurrency", "Flame Engine (Flutter Gaming)",
    "Cross-Platform Bluetooth/BLE", "Mobile Machine Learning (CoreML, ML Kit)", "On-Device LLMs", "Mobile CI/CD (Bitrise, Fastlane)",
    "App Store Optimization (ASO)", "Over-the-Air (OTA) Updates", "Mobile App Security & Obfuscation", "Root & Jailbreak Detection",
    "Deep Linking & Universal Links", "Push Notification Architecture", "In-App Purchases & Subscriptions", "Mobile Analytics (Mixpanel, Amplitude)",
    "Crash Reporting (Crashlytics, Sentry)", "Performance Profiling (Instruments, Android Profiler)", "Offline-First Architecture",
    "Sync Frameworks (WatermelonDB, Realm)", "Wearable App Development (watchOS, Wear OS)", "TV App Development (tvOS, Android TV)",
    "Automotive App Development (CarPlay, Android Auto)", "Spatial Audio", "Haptic Engine Programming", "Accessibility in Mobile Apps",
    "Mobile UI Testing (Appium, Maestro)", "Snapshot Testing", "Dependency Injection (Dagger/Hilt, Swinject)",
    "Reactive Programming (RxSwift, RxJava)", "GraphQL on Mobile", "WebRTC for Mobile"
  ],
  "Business & Product": [
    "Product-Led Growth (PLG)", "Growth Hacking Strategies", "Go-to-Market (GTM) Strategy", "Market Sizing (TAM, SAM, SOM)",
    "Competitor Analysis & Benchmarking", "Customer Acquisition Cost (CAC) Optimization", "Lifetime Value (LTV) Modeling",
    "Pricing Strategy & Monetization", "Churn Analysis & Retention Strategies", "Cohort Analysis", "Funnel Optimization",
    "A/B Testing at Scale", "Multivariate Testing", "Product Analytics (Amplitude, Mixpanel)", "SQL for Product Managers",
    "Data-Driven Decision Making", "OKR (Objectives and Key Results) Implementation", "Agile Scaling (SAFe, LeSS)",
    "Scrum Master Facilitation", "Lean Startup Methodology", "Design Thinking Workshops", "Jobs-to-be-Done (JTBD) Research",
    "Customer Journey Mapping", "User Persona Development", "Product Roadmapping & Prioritization (RICE, Kano)",
    "Stakeholder Management", "Executive Communication", "Vendor Negotiation & Management", "Business Case Development",
    "Financial Modeling for Tech", "Venture Capital Fundraising", "Pitch Deck Creation", "Bootstrapping Strategies",
    "Enterprise B2B Sales", "B2B Marketing Strategies", "Inbound Marketing Automation", "SEO Technical Auditing",
    "Content Strategy & Distribution", "Community Building & Management", "Influencer Marketing", "Public Relations (PR) for Tech",
    "Brand Positioning", "Crisis Management", "Legal Frameworks (Contracts, IP)", "Compliance Management",
    "Change Management", "Team Leadership & Development", "Remote Team Management", "Diversity, Equity, and Inclusion (DEI)",
    "Ethics in Technology"
  ],
  "Game Development": [
    "Unreal Engine 5 Nanite & Lumen", "Unreal C++ Gameplay Programming", "Unreal Blueprint Visual Scripting",
    "Unity Data-Oriented Technology Stack (DOTS)", "Unity ECS (Entity Component System)", "Unity Shader Graph",
    "Godot Engine Advanced", "Custom Game Engine Development", "DirectX 12 / Vulkan Graphics API", "OpenGL Advanced",
    "PhysX / Havok Physics Integration", "Fluid Simulation", "Cloth & Hair Simulation", "Procedural Generation (PCG)",
    "Voxel Engine Development", "NavMesh & Pathfinding (A*)", "Behavior Trees for AI", "Finite State Machines (FSM)",
    "Machine Learning Agents in Games", "Multiplayer Netcode Architecture", "Client Prediction & Server Reconciliation",
    "Matchmaking Systems", "Photon / Unity Relay Networking", "Dedicated Game Servers", "Spatial Audio Design (Wwise, FMOD)",
    "Dynamic Music Systems", "Motion Capture (Mocap) Pipeline", "Inverse Kinematics (IK)", "Facial Animation & Lip Sync",
    "3D Math & Quaternions", "Ray Tracing Implementation", "Level Design & Pacing", "Economy Design & Balancing",
    "Monetization Strategies (F2P, Battle Pass)", "Game Analytics & Telemetry", "LiveOps Management", "Anti-Cheat Systems",
    "Console Porting (PS5, Xbox, Switch)", "VR Locomotion & Interaction", "AR Game Design (Location-based)",
    "Optimization & Profiling (CPU/GPU)", "Memory Management & Garbage Collection Avoidance", "Asset Bundling & Addressables",
    "UI/UX for Games", "Narrative Design & Branching Dialogue", "World Building & Lore", "Accessibility in Gaming",
    "Esports Spectator Tools", "Twitch/YouTube Integration API", "Cloud Gaming Technologies"
  ],
  "Emerging Tech": [
    "Quantum Computing Algorithms", "Quantum Cryptography", "Qiskit / Cirq Programming", "Neuromorphic Engineering",
    "Brain-Computer Interfaces (BCI)", "EEG Signal Processing", "Synthetic Biology", "CRISPR Data Analysis",
    "Bioinformatics & Computational Biology", "Space Technology & Satellite Software", "Orbital Mechanics Programming",
    "Robotics Operating System (ROS 2)", "Autonomous Vehicle Simulation", "Simultaneous Localization and Mapping (SLAM)",
    "Sensor Fusion (LiDAR, Radar, Cameras)", "Drones & Unmanned Aerial Vehicles (UAVs)", "Swarm Robotics",
    "Nanotechnology Applications", "Advanced Materials Science Informatics", "Fusion Energy Software Systems",
    "Smart Grid Technology", "Energy Storage Systems Optimization", "Carbon Capture Technology Data",
    "AgriTech / Precision Farming", "Vertical Farming Automation", "Lab-Grown Meat Bioreactor Control",
    "Digital Twins", "Metaverse Infrastructure", "Holographic Displays Programming", "Volumetric Video Capture",
    "Web3 Architecture", "Solidity Smart Contracts Security", "Zero-Knowledge Proofs (ZKP)", "zk-SNARKs & zk-STARKs",
    "Decentralized Finance (DeFi) Protocols", "Automated Market Makers (AMM)", "Decentralized Autonomous Organizations (DAOs)",
    "Interplanetary File System (IPFS)", "Blockchain Interoperability (Polkadot, Cosmos)", "Non-Fungible Token (NFT) Utilities",
    "Tokenomics Design", "Central Bank Digital Currencies (CBDCs)", "Self-Sovereign Identity (SSI)",
    "Homomorphic Encryption Applications", "Edge Computing Architectures", "5G/6G Network Slicing",
    "Internet of Behaviors (IoB)", "Smart City Infrastructure", "Predictive Maintenance (IoT)", "Human Augmentation Tech"
  ]
};

const output = {
  description: "Advanced skills database mapped to domains with YouTube tutorials.",
  domains: []
};

Object.keys(domains).forEach(domainName => {
  const domainObj = {
    domain: domainName,
    skills: domains[domainName].map(skill => ({
      skill: skill,
      youtubeLink: generateYoutubeLink(skill),
      description: "Learn advanced concepts in " + skill
    }))
  };
  output.domains.push(domainObj);
});

const fileContent = "// ============================================================\\n" +
"// ADVANCED SKILLS DATABASE — 50 skills per domain\\n" +
"// Generated dynamically with up-to-date YouTube learning links\\n" +
"// ============================================================\\n\\n" +
"export const ADVANCED_DOMAIN_SKILLS = " + JSON.stringify(output.domains, null, 2) + ";\\n";

fs.writeFileSync(path.join(__dirname, 'advancedSkillsDB.js'), fileContent);
console.log('Successfully wrote advancedSkillsDB.js');
