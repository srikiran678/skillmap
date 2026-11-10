// ============================================================
// EXPANDED SENIOR DEVELOPER LESSON TRACKS — SkillMap 2026
// Cloud Native, System Design, AI Engineering, React 19, Go
// ============================================================

export const extraCloudLessons = [
  {
    id: 'docker-mastery',
    title: 'Production Dockerfiles & Multi-Stage Builds',
    duration: '15 min',
    xp: 45,
    content: `## Production Docker Architecture

Containerizing applications for production requires optimizing for **image size, build cache speed, and security**.

### 1. Multi-Stage Builds
Multi-stage builds allow you to use a heavy SDK image to compile your binary or bundle, then copy only the compiled artifacts into a lightweight, minimal production image (like Alpine or Distroless).

\`\`\`dockerfile
# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 2. Layer Caching Rules
- Place dependencies that change rarely (\`package.json\`, lockfiles) BEFORE application source code.
- Combine multi-line RUN commands with \`&&\` to avoid creating useless intermediate layers.
- Always add a comprehensive \`.dockerignore\` (ignore \`node_modules\`, \`.git\`, \`.env\`).

### 3. Container Security Checklist
1. **Never run as root**: Always define an unprivileged user (\`USER appuser\`).
2. **Scan images**: Run \`docker scout\` or \`trivy\` to detect CVE vulnerabilities.
3. **Read-only root filesystem**: Mount writable directories only when needed (\`/tmp\`).`,
    code: `// Dockerfile Layer Optimization & Security Audit Simulator
function auditDockerfile(dockerfileLines) {
  const issues = [];
  let hasUser = false;
  let hasMultiStage = false;
  let copiedSourceBeforeDeps = false;
  let seenPackageCopy = false;

  dockerfileLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('FROM') && trimmed.includes(' AS ')) hasMultiStage = true;
    if (trimmed.startsWith('USER ') && !trimmed.includes('root')) hasUser = true;
    if (trimmed.startsWith('COPY package')) seenPackageCopy = true;
    if (trimmed.startsWith('COPY . .') && !seenPackageCopy) copiedSourceBeforeDeps = true;
  });

  if (!hasUser) issues.push({ severity: 'HIGH', msg: 'Container runs as ROOT. Vulnerable to container breakout.' });
  if (!hasMultiStage) issues.push({ severity: 'MEDIUM', msg: 'Single stage build detected. Image will contain devDependencies and build tools.' });
  if (copiedSourceBeforeDeps) issues.push({ severity: 'MEDIUM', msg: 'COPY . . before package.json invalidates layer cache on every code edit.' });

  const score = Math.max(20, 100 - (issues.length * 25));
  console.log(\`🐳 Dockerfile Audit Score: \${score}/100\`);
  console.log('Detected Issues:', issues.length ? issues : 'None! Production ready.');
  return { score, issues };
}

const mockProductionDockerfile = [
  'FROM node:20-alpine AS builder',
  'WORKDIR /app',
  'COPY package*.json ./',
  'RUN npm ci',
  'COPY . .',
  'RUN npm run build',
  'FROM node:20-alpine AS runner',
  'USER appuser',
  'COPY --from=builder /app/dist ./dist',
  'CMD ["node", "dist/server.js"]'
];

auditDockerfile(mockProductionDockerfile);`,
    quiz: [
      { q: 'Why should you use multi-stage Docker builds?', options: ['To make the container run faster in CPU', 'To reduce the final production image size and exclude build toolchains', 'To execute tests simultaneously in Python and Node', 'To automatically upload the image to GitHub'], answer: 1 },
      { q: 'Why should package.json be copied before application source code?', options: ['It looks cleaner in Git', 'To leverage Docker layer caching and prevent re-installing dependencies on every code change', 'Because npm ci fails if code exists', 'Docker commands must always be alphabetical'], answer: 1 },
      { q: 'What security risk occurs when running containers as root (default)?', options: ['The container consumes double RAM', 'If compromised, an attacker can leverage host kernel exploits for container escape', 'Network ports under 1024 cannot be bound', 'Docker CLI terminates automatically'], answer: 1 },
      { q: 'What is the purpose of .dockerignore?', options: ['To hide files from git commit', 'To prevent large local directories like node_modules from being sent in the Docker build context', 'To stop the container from rebooting', 'To configure container environment variables'], answer: 1 }
    ]
  },
  {
    id: 'kubernetes-orchestration',
    title: 'Kubernetes Pods, Deployments & Services',
    duration: '18 min',
    xp: 50,
    content: `## Kubernetes (K8s) Architecture

Kubernetes is the industry-standard container orchestration platform for automating deployment, scaling, and operations of application containers across clusters.

### Core Primitives
\`\`\`
   [ Internet ]
        |
    [ Ingress ]
        |
    [ Service ] (ClusterIP / LoadBalancer)
      /   |   \\
    [Pod] [Pod] [Pod]  <- Managed by a Deployment
\`\`\`

1. **Pod**: The smallest deployable unit. Usually 1 container (or 1 container + sidecars).
2. **Deployment**: Declares desired state (e.g. \`replicas: 3\`). Handles zero-downtime rolling updates and rollbacks.
3. **Service**: Stable internal IP address and DNS name that load balances traffic across healthy pods matching label selectors.
4. **ConfigMap & Secret**: Injects configuration and environment variables without baking them into container images.

### Zero-Downtime Rolling Update
\`\`\`yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Spin up 1 new pod before killing an old one
      maxUnavailable: 0  # Keep 100% capacity during deployments
\`\`\`

### Health Probes
- **Liveness Probe**: "Is the app running?" If it fails, Kubernetes kills and restarts the container.
- **Readiness Probe**: "Is the app ready to accept traffic?" If it fails, Kubernetes stops routing network traffic to this pod until it recovers.`,
    code: `// Kubernetes Rolling Update & Health Probe Simulator
class KubernetesDeployment {
  constructor(name, replicas, image) {
    this.name = name;
    this.replicas = replicas;
    this.image = image;
    this.pods = Array.from({ length: replicas }, (_, i) => ({
      id: \`\${name}-\${i + 1}\`,
      image: image,
      healthy: true,
      ready: true
    }));
  }

  async rollOut(newImage) {
    console.log(\`🚀 Starting Rolling Update for \${this.name} to \${newImage}...\`);
    for (let i = 0; i < this.pods.length; i++) {
      const oldPod = this.pods[i];
      console.log(\`[Step \${i + 1}/\${this.pods.length}] Creating new pod with \${newImage}...\`);
      
      this.pods[i] = { id: \`\${this.name}-v2-\${i + 1}\`, image: newImage, healthy: true, ready: true };
      console.log(\`✅ New pod \${this.pods[i].id} passed Readiness Probe. Terminating old pod \${oldPod.id}\`);
    }
    console.log(\`🎉 Deployment \${this.name} successfully updated to \${newImage} with ZERO downtime!\`);
  }
}

const myApp = new KubernetesDeployment('skillmap-api', 3, 'api:v1.0.0');
console.log('Current Pods:', myApp.pods.map(p => p.id));
myApp.rollOut('api:v2.0.0');`,
    quiz: [
      { q: 'What is the difference between a Liveness Probe and a Readiness Probe?', options: ['Liveness checks CPU; Readiness checks disk space', 'Liveness restarts the container on failure; Readiness removes the pod from receiving traffic without killing it', 'Readiness is only used in staging clusters', 'There is no difference'], answer: 1 },
      { q: 'Which Kubernetes object provides a stable network identity and load-balances across pods?', options: ['ConfigMap', 'Service', 'Namespace', 'VolumeClaim'], answer: 1 },
      { q: 'What does a maxUnavailable: 0 setting in a RollingUpdate strategy guarantee?', options: ['The cluster will run for free', 'No existing pods will be killed until a new replacement pod is healthy and ready to serve traffic', 'All pods update simultaneously in 1 second', 'Deployments are blocked completely'], answer: 1 },
      { q: 'What is the role of a Kubernetes ConfigMap?', options: ['To store TLS private keys securely', 'To decouple configuration values and environment variables from container images', 'To allocate CPU cores to physical nodes', 'To compile TypeScript into JavaScript'], answer: 1 }
    ]
  },
  {
    id: 'cicd-github-actions',
    title: 'CI/CD Automation with GitHub Actions',
    duration: '14 min',
    xp: 40,
    content: `## CI/CD Pipeline Automation

Continuous Integration and Continuous Deployment (CI/CD) ensures that code pushed to main branches is automatically tested, linted, built, and deployed safely.

### GitHub Actions Workflow Anatomy
A workflow is defined in \`.github/workflows/ci.yml\`:

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
\`\`\`

### Production Best Practices
1. **Dependency Caching**: Always enable \`cache: 'npm'\` or \`actions/cache\` to prevent re-downloading gigabytes on every PR.
2. **Matrix Builds**: Run tests across multiple runtime versions or operating systems simultaneously.
3. **Secrets Hygiene**: Use GitHub Repository Secrets and never echo sensitive tokens in runner logs.
4. **Branch Protection**: Block merging PRs until all required CI checks pass.`,
    code: `// CI/CD Automated Pipeline Execution Simulator
class CIPipeline {
  constructor(name) {
    this.name = name;
    this.stages = [];
  }

  addStage(stageName, runFn) {
    this.stages.push({ name: stageName, run: runFn });
  }

  async execute() {
    console.log(\`🚀 Triggering CI/CD Workflow: \${this.name}\`);
    const startTime = Date.now();

    for (const stage of this.stages) {
      console.log(\`🔄 Running Stage: \${stage.name}...\`);
      const pass = await stage.run();
      if (!pass) {
        console.error(\`❌ Stage Failed: \${stage.name}. Aborting pipeline! Exit Code 1.\`);
        return { success: false, failedStage: stage.name };
      }
      console.log(\`✅ Stage Passed: \${stage.name}\`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(\`🎉 Pipeline Passed All Stages in \${duration}s! Ready for Production Deploy.\`);
    return { success: true };
  }
}

const pipeline = new CIPipeline("Main PR Validation");
pipeline.addStage("1. Static Analysis (ESLint)", () => true);
pipeline.addStage("2. Unit & Integration Tests (Vitest)", () => true);
pipeline.addStage("3. Production Bundle Build (Vite)", () => true);

pipeline.execute();`,
    quiz: [
      { q: 'What does the matrix strategy in GitHub Actions accomplish?', options: ['Generates green terminal animations', 'Runs jobs concurrently across multiple runtime versions, environments, or OS platforms', 'Compiles code directly into assembly', 'Deletes broken branches automatically'], answer: 1 },
      { q: 'Why is "npm ci" preferred over "npm install" in CI environments?', options: ['It uses 10x less memory', 'It installs exact dependency versions from package-lock.json cleanly without modifying the lockfile', 'It is an official npm plugin', 'It skips downloading packages'], answer: 1 },
      { q: 'How should sensitive production credentials (API keys, DB secrets) be passed to GitHub Actions?', options: ['Hardcoded in .github/workflows/ci.yml', 'Committed to a public .env file in Git', 'Stored in GitHub Encrypted Repository Secrets and injected as environment variables', 'Sent via Slack webhooks'], answer: 2 },
      { q: 'What is the primary benefit of Branch Protection Rules?', options: ['Prevents unauthorized users from reading code', 'Enforces that PRs must pass automated CI checks and code reviews before merging to main', 'Charges users for broken commits', 'Disables git clone for competitors'], answer: 1 }
    ]
  }
];

export const extraSystemDesignLessons = [
  {
    id: 'redis-caching-ratelimiting',
    title: 'Redis In-Memory Caching & Rate Limiting',
    duration: '16 min',
    xp: 50,
    content: `## High-Performance Caching with Redis

Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine.

### Common Caching Strategies
1. **Cache-Aside (Lazy Loading)**:
   - Application checks Redis first.
   - If **Cache Hit**: return cached data immediately (< 1ms).
   - If **Cache Miss**: query PostgreSQL database, write result to Redis with a TTL (Time-To-Live), and return to client.
2. **Write-Through**: Application writes to cache and DB simultaneously.
3. **Write-Behind (Write-Back)**: Application writes to cache first; cache asynchronously persists to DB in batches.

### Sliding-Window Rate Limiting
To protect APIs from abuse and DDoS, rate limiting restricts how many requests a user or IP can make in a given timeframe (e.g. 100 requests per minute).

Using Redis **Sorted Sets (ZSET)**:
1. Remove elements older than \`now - windowSize\` using \`ZREMRANGEBYSCORE\`.
2. Count remaining requests using \`ZCARD\`.
3. If count exceeds threshold, reject with **HTTP 429 Too Many Requests**.
4. Otherwise, add current timestamp using \`ZADD\` and allow request.`,
    code: `// Sliding Window Rate Limiter Simulator (Redis ZSET semantics)
class SlidingWindowRateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.userWindows = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.userWindows.has(userId)) {
      this.userWindows.set(userId, []);
    }

    const timestamps = this.userWindows.get(userId);

    // Evict timestamps older than the sliding window (ZREMRANGEBYSCORE)
    const validTimestamps = timestamps.filter(ts => ts > windowStart);
    this.userWindows.set(userId, validTimestamps);

    // Check capacity (ZCARD)
    if (validTimestamps.length >= this.limit) {
      console.warn(\`⛔ Rate limit exceeded for \${userId}! Allowed: \${this.limit}/\${this.windowMs}ms\`);
      return false;
    }

    // Add current request timestamp (ZADD)
    validTimestamps.push(now);
    console.log(\`✅ Request approved for \${userId} (\${validTimestamps.length}/\${this.limit} used)\`);
    return true;
  }
}

const limiter = new SlidingWindowRateLimiter(3, 1000); // 3 requests per 1 sec
limiter.isAllowed("user-101");
limiter.isAllowed("user-101");
limiter.isAllowed("user-101");
limiter.isAllowed("user-101"); // Should be rejected`,
    quiz: [
      { q: 'How does Cache-Aside (Lazy Loading) handle a cache miss?', options: ['Returns an HTTP 500 error', 'Reads data from the primary database, writes it to the cache with a TTL, and returns it to the client', 'Deletes all records from the database', 'Restarts the Redis server'], answer: 1 },
      { q: 'Why is Redis so much faster (sub-millisecond) than traditional relational databases?', options: ['It uses quantum algorithms', 'It stores data entirely in RAM and uses single-threaded non-blocking I/O event loops', 'It only stores plain text strings', 'It does not support network connections'], answer: 1 },
      { q: 'Which Redis data structure is optimal for implementing a sliding-window rate limiter?', options: ['Hashes', 'Sorted Sets (ZSET) indexed by unix timestamps', 'Bitmaps', 'Streams'], answer: 1 },
      { q: 'What HTTP status code should be returned when a client exceeds their rate limit?', options: ['400 Bad Request', '403 Forbidden', '429 Too Many Requests', '503 Service Unavailable'], answer: 2 }
    ]
  },
  {
    id: 'event-driven-kafka',
    title: 'Event-Driven Architecture with Apache Kafka',
    duration: '18 min',
    xp: 55,
    content: `## Event-Driven Systems & Apache Kafka

In an **Event-Driven Architecture**, services communicate by publishing and reacting to immutable events rather than making synchronous blocking HTTP calls.

### Core Kafka Architecture
\`\`\`
[Producers] -> [ Kafka Topic: Orders ] -> [Consumer Group: Payments]
                   Partition 0         -> [Consumer Group: Inventory]
                   Partition 1         -> [Consumer Group: Email Notifications]
                   Partition 2
\`\`\`

1. **Topic**: A category or feed name to which records are published.
2. **Partition**: Topics are split into ordered, immutable sequences of records for horizontal scalability across broker nodes.
3. **Consumer Group**: A set of consumers cooperating to consume data from a topic. Each partition is consumed by only ONE consumer within a given consumer group!
4. **Offset**: A unique sequential integer assigned to each record within a partition. Consumers track their progress by committing offsets.

### Delivery Semantics
- **At-Most-Once**: Offsets committed before processing. Messages can be lost if a consumer crashes, but never duplicated.
- **At-Least-Once**: Offsets committed AFTER successful processing. Messages are never lost, but consumers must be **idempotent** (handle potential duplicates).
- **Exactly-Once**: Requires idempotent producers and transactional commits across Kafka topics.`,
    code: `// Event-Driven Message Broker & Partition Consumer Simulator
class EventBroker {
  constructor() {
    this.topics = new Map();
  }

  createTopic(topicName, partitionCount = 3) {
    this.topics.set(topicName, {
      partitions: Array.from({ length: partitionCount }, () => []),
      consumers: []
    });
  }

  publish(topicName, key, payload) {
    const topic = this.topics.get(topicName);
    if (!topic) throw new Error(\`Topic \${topicName} does not exist\`);

    // Hash partitioning
    const partitionIndex = Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % topic.partitions.length;
    const offset = topic.partitions[partitionIndex].length;
    const event = { key, payload, offset, timestamp: Date.now() };

    topic.partitions[partitionIndex].push(event);
    console.log(\`📢 Event Published -> [\${topicName} | P\${partitionIndex} | Offset \${offset}]:\`, payload);

    // Notify subscribed consumer
    topic.consumers.forEach(c => c(event, partitionIndex));
  }

  subscribe(topicName, consumerFn) {
    const topic = this.topics.get(topicName);
    if (topic) topic.consumers.push(consumerFn);
  }
}

const broker = new EventBroker();
broker.createTopic("user.registered", 3);
broker.subscribe("user.registered", (event, p) => {
  console.log(\`⚙️ Consumer Worker received on Partition \${p}: Welcome email sent to \${event.payload.email}\`);
});

broker.publish("user.registered", "user-uuid-1", { email: "dev@skillmap.io", name: "Alex" });`,
    quiz: [
      { q: 'What is a Kafka partition and why is it used?', options: ['A memory leak protection device', 'An ordered, immutable log of records that enables horizontal parallelism and throughput scaling', 'A tool to convert JSON into XML', 'A network firewall between microservices'], answer: 1 },
      { q: 'In Kafka, if a topic has 4 partitions and a consumer group has 4 consumers, how are partitions assigned?', options: ['All consumers read all partitions', 'Each consumer is assigned exactly 1 partition', 'Only 1 consumer reads all 4 partitions while others sleep', 'Partitions are divided randomly per millisecond'], answer: 1 },
      { q: 'Why is "At-Least-Once" delivery semantics the most popular in microservices?', options: ['It requires no configuration', 'It guarantees no events are dropped during network failures, relying on idempotent consumers to handle duplicates', 'It guarantees zero network latency', 'It deletes database records automatically'], answer: 1 },
      { q: 'What is a Kafka offset?', options: ['The time difference between server clocks', 'A sequential identifier assigned to each record in a partition that tracks consumer position', 'The CPU percentage consumed by a broker', 'The port number where Kafka listens'], answer: 1 }
    ]
  },
  {
    id: 'postgres-indexing-acid',
    title: 'PostgreSQL Performance & ACID Transactions',
    duration: '16 min',
    xp: 45,
    content: `## PostgreSQL Indexing & Concurrency Internals

Understanding how PostgreSQL executes queries and isolates transactions is essential for building scalable backend architectures.

### Index Types
1. **B-Tree (Default)**: Balanced tree for equality (\`=\`) and range queries (\`<\`, \`>\`, \`BETWEEN\`, \`ORDER BY\`).
2. **GIN (Generalized Inverted Index)**: Indexes composite elements (arrays, JSONB columns, full-text search).
3. **BRIN (Block Range Index)**: Compact index for massive timeseries tables where physical row storage correlates with column values (e.g. \`created_at\`).

### EXPLAIN ANALYZE Breakdown
Always inspect query execution plans:
\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM users WHERE email = 'operative@skillmap.io';
\`\`\`
- **Seq Scan**: Scans every single table page O(N). Slow on large tables.
- **Index Scan**: Uses B-tree to pinpoint heap pages O(log N). Fast!
- **Bitmap Index Scan**: Combines multiple indexes using in-memory bit vectors.

### ACID Properties
- **Atomicity**: All operations in a transaction succeed or all roll back.
- **Consistency**: Database constraints (Foreign Keys, Uniqueness) are never violated.
- **Isolation**: Concurrent transactions do not corrupt each other's state (Read Committed, Repeatable Read, Serializable).
- **Durability**: Committed data is written to Write-Ahead Log (WAL) on disk.`,
    code: `// Database Query Execution Cost Simulator: Seq Scan vs B-Tree Index
function simulateQuery(totalRecords, targetId, hasIndex = false) {
  console.log(\`🔍 Executing query: SELECT * FROM table WHERE id = \${targetId} on \${totalRecords.toLocaleString()} rows...\`);
  
  if (!hasIndex) {
    // Sequential Scan O(N)
    const cost = totalRecords;
    console.warn(\`⚠️ Seq Scan: Inspected \${cost.toLocaleString()} rows sequentially. Query Cost: \${cost}\`);
    return { plan: 'Seq Scan', cost };
  } else {
    // B-Tree Index Lookup O(log2 N)
    const depth = Math.ceil(Math.log2(totalRecords));
    console.log(\`⚡ Index Scan using btree_id: Tree depth is \${depth} levels. Target located immediately! Query Cost: \${depth}\`);
    return { plan: 'Index Scan', cost: depth };
  }
}

simulateQuery(1000000, 742918, false); // Without Index
simulateQuery(1000000, 742918, true);  // With B-Tree Index`,
    quiz: [
      { q: 'Which PostgreSQL index type is most appropriate for querying JSONB documents or array containment?', options: ['B-Tree', 'GIN (Generalized Inverted Index)', 'Hash Index', 'BRIN'], answer: 1 },
      { q: 'What does "EXPLAIN ANALYZE" do in PostgreSQL?', options: ['Translates SQL into Python code', 'Actually executes the SQL query and displays exact execution times and buffer hit statistics', 'Formats query indentation automatically', 'Deletes duplicate rows from the table'], answer: 1 },
      { q: 'What is the role of the Write-Ahead Log (WAL) in PostgreSQL?', options: ['To log user chat messages', 'To ensure Durability by logging changes before writing to data files so recovery is possible after crashes', 'To serve cached HTTP responses', 'To encrypt SQL passwords in memory'], answer: 1 },
      { q: 'In ACID transactions, what does Atomicity guarantee?', options: ['Queries run in under 1 nanosecond', 'Either all statements in the transaction complete successfully, or all changes are rolled back', 'Multiple users can view different passwords', 'The database operates in an atomic reactor'], answer: 1 }
    ]
  }
];

export const extraAgenticLessons = [
  {
    id: 'vector-db-pgvector',
    title: 'Vector Databases & pgvector Semantic Search',
    duration: '16 min',
    xp: 55,
    content: `## Vector Embeddings & Semantic Search

Traditional databases search using exact keyword matches. **Vector Databases** search by **meaning and conceptual similarity**.

### How Vector Embeddings Work
An embedding model (like \`text-embedding-3-small\`) maps text into a high-dimensional dense vector of numbers (e.g. 1536 floats).
- Words with similar meanings have high cosine similarity (angle between vectors is close to 0 degrees).

### Distance Metrics
1. **Cosine Distance** (\`<=>\`): Measures angle between vectors. Robust to text length differences.
2. **Euclidean / L2 Distance** (\`<->\`): Measures straight-line distance between points.
3. **Inner / Dot Product** (\`<#>\`): Best for normalized vectors. Fastest computation.

### Indexing with pgvector in PostgreSQL
\`\`\`sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table with 1536-dimensional embeddings
CREATE TABLE knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536)
);

-- Create HNSW Index for ultra-fast approximate nearest neighbor (ANN) search
CREATE INDEX ON knowledge_base USING hnsw (embedding vector_cosine_ops);

-- Query nearest matches
SELECT content, 1 - (embedding <=> $query_embedding) AS similarity
FROM knowledge_base
ORDER BY embedding <=> $query_embedding
LIMIT 5;
\`\`\``,
    code: `// Vector Dot Product & Cosine Similarity Calculator Simulator
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 4-dimensional mock embeddings for concepts
const embeddings = {
  "Docker Containerization": [0.92, 0.12, 0.85, 0.05],
  "Kubernetes Pod Orchestration": [0.89, 0.15, 0.90, 0.08],
  "Italian Pasta Recipe": [0.02, 0.95, 0.05, 0.88]
};

const query = [0.90, 0.10, 0.88, 0.04]; // Query: "Deploying container apps"

console.log("--- Semantic Similarity Scores to Query ---");
for (const [title, vec] of Object.entries(embeddings)) {
  const sim = cosineSimilarity(query, vec);
  console.log(\`\${(sim * 100).toFixed(1)}% match -> "\${title}"\`);
}`,
    quiz: [
      { q: 'What does a text embedding model output?', options: ['An HTML web page', 'A dense high-dimensional numerical vector representing semantic meaning', 'An encrypted password hash', 'A SQL table schema'], answer: 1 },
      { q: 'Why is HNSW (Hierarchical Navigable Small World) preferred for vector indexing in pgvector?', options: ['It uses zero disk space', 'It provides logarithmic search complexity and high recall for Approximate Nearest Neighbors (ANN)', 'It requires no RAM', 'It translates English into Spanish'], answer: 1 },
      { q: 'What is the relationship between Cosine Similarity and Cosine Distance in pgvector (<=>)?', options: ['Cosine Distance = 1 - Cosine Similarity', 'They are identical', 'Distance is always negative', 'Similarity is divided by 100'], answer: 0 },
      { q: 'When two text snippets have almost identical meaning, their vector cosine similarity is closest to:', options: ['0.0', '-1.0', '1.0', '100.0'], answer: 2 }
    ]
  },
  {
    id: 'agentic-rag-hybrid',
    title: 'Production RAG & Hybrid Search Architecture',
    duration: '18 min',
    xp: 60,
    content: `## Advanced Retrieval-Augmented Generation (RAG)

Basic RAG fails in production because of poor chunking, lost context, and keyword blindness. **Production RAG** combines multiple retrieval and ranking steps.

### Production RAG Pipeline
\`\`\`
User Query
   |
   +--> Keyword Search (BM25 / Full-Text) ----+
   |                                          |-> Reciprocal Rank Fusion (RRF)
   +--> Dense Vector Search (pgvector) -------+          |
                                                         V
                                              Cross-Encoder Reranker (Cohere)
                                                         |
                                                         V
                                            Context Window -> LLM Generation
\`\`\`

### 1. Chunking Strategies
- **Fixed-Size Chunking**: Slices text every 500 tokens with 50-token overlap. Simple but can split sentences.
- **Recursive Character Chunking**: Splits by paragraphs (\`\\n\\n\`), then sentences (\`. \`), preserving conceptual coherence.
- **Parent-Document Retrieval**: Embeds small 100-token chunks for precise retrieval, but passes the larger 1000-token parent document to the LLM.

### 2. Hybrid Search & Reciprocal Rank Fusion (RRF)
Vector search captures semantic intent ("fast autos") while BM25 captures exact identifiers ("Error 0x80070057"). Combining both yields superior recall.

### 3. Cross-Encoder Re-Ranking
A bi-encoder retrieves the top 20 candidate documents fast. A heavy cross-encoder reranker analyzes the (query, document) pairs together to surface the true top 3 passages for generation.`,
    code: `// Production Hybrid RAG Search & Reciprocal Rank Fusion (RRF) Simulator
class HybridRAG {
  constructor(documents) {
    this.documents = documents;
  }

  // Reciprocal Rank Fusion: RRF_score = 1 / (60 + rank)
  fuseResults(denseRanked, sparseRanked, k = 60) {
    const scores = new Map();

    denseRanked.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) || 0) + (1 / (k + rank + 1)));
    });

    sparseRanked.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) || 0) + (1 / (k + rank + 1)));
    });

    const sortedIds = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    return sortedIds.map(([id, rrfScore]) => {
      const doc = this.documents.find(d => d.id === id);
      return { ...doc, rrfScore: rrfScore.toFixed(4) };
    });
  }
}

const corpus = [
  { id: 1, text: "Configure Postgres connection pooling with PgBouncer to prevent connection exhaustion." },
  { id: 2, text: "Kubernetes pod autoscaling using HPA and custom Prometheus metrics." },
  { id: 3, text: "Optimizing PostgreSQL database connection pools and connection timeouts." }
];

const rag = new HybridRAG(corpus);
const denseResults = [corpus[2], corpus[0]];
const sparseResults = [corpus[0], corpus[2]];

const fused = rag.fuseResults(denseResults, sparseResults);
console.log("Top RAG Passages after Reciprocal Rank Fusion:", fused);`,
    quiz: [
      { q: 'What problem does Hybrid Search solve in RAG systems?', options: ['It translates audio to video', 'It combines semantic vector search (understanding meaning) with keyword search (exact technical IDs, codes, and names)', 'It deletes outdated documents automatically', 'It cuts OpenAI API bills to zero'], answer: 1 },
      { q: 'What is the purpose of a Cross-Encoder Reranker in modern RAG?', options: ['To generate SQL tables', 'To re-score and re-order top candidate passages with high precision before sending them to the LLM context window', 'To split PDF files into pages', 'To compress images into WebP'], answer: 1 },
      { q: 'Why is chunk overlap (e.g. 10-15%) used in document chunking?', options: ['To double the database size', 'To prevent critical context and sentence continuity from being truncated across chunk boundaries', 'To satisfy copyright laws', 'Because vectors require even token numbers'], answer: 1 },
      { q: 'In Parent-Document Retrieval, what is stored for vector search vs what is sent to the LLM?', options: ['Images are searched; text is sent to LLM', 'Small sub-chunks are embedded for precise retrieval; the larger parent document is sent to the LLM for rich context', 'Only document titles are embedded', 'Full databases are embedded'], answer: 1 }
    ]
  },
  {
    id: 'langgraph-multi-agent-loop',
    title: 'Multi-Agent Orchestration with LangGraph',
    duration: '20 min',
    xp: 65,
    content: `## Stateful Multi-Agent Systems & LangGraph

Single-agent systems get stuck in loops when handling multifaceted software tasks. **LangGraph** enables building multi-agent architectures modeled as stateful cyclic graphs.

### StateGraph Core Concepts
1. **State**: A shared typed schema (e.g. \`messages: list\`) passed between all nodes.
2. **Nodes**: Independent Python or TypeScript functions or agents (e.g. \`ResearchAgent\`, \`CoderAgent\`, \`ReviewerAgent\`).
3. **Edges & Conditional Edges**: Determine control flow. A conditional edge evaluates the current state and decides which node to execute next.
4. **Checkpointer & Time Travel**: Persists state after every node execution. Enables state rewind, human-in-the-loop approvals, and recovery from failures.

### Multi-Agent Supervisor Pattern
\`\`\`
                 [ User Prompt ]
                        |
                        V
              [ Supervisor Agent ]
             /          |         \\
     [Coder Agent] [Tester Agent] [Docs Agent]
             \\          |         /
              +-> [ State Update ] -+
                        |
            (Loop until task marked DONE)
\`\`\``,
    code: `// LangGraph Multi-Agent State Machine Simulator
class StateGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(name, fn) {
    this.nodes.set(name, fn);
  }

  addEdge(fromNode, toNode) {
    this.edges.set(fromNode, toNode);
  }

  async run(initialState) {
    let state = { ...initialState };
    let currentNode = 'supervisor';
    let steps = 0;

    console.log("🚀 Starting LangGraph Multi-Agent Execution...");

    while (currentNode && steps < 10) {
      steps++;
      const nodeFn = this.nodes.get(currentNode);
      console.log(\`\\n📍 Executing Node [\${currentNode.toUpperCase()}]...\`);
      
      const update = await nodeFn(state);
      state = { ...state, ...update };

      currentNode = this.edges.get(currentNode);
      if (state.status === 'COMPLETE') break;
    }

    console.log("\\n🎉 LangGraph Execution Finished. Final State:", state);
    return state;
  }
}

const graph = new StateGraph();
graph.addNode('supervisor', () => {
  console.log("Supervisor: Delegating code implementation to CoderAgent.");
  return { status: 'CODING', task: 'Implement rate limiter' };
});

graph.addNode('coder', () => {
  console.log("Coder: Written 25 lines of Redis Token Bucket code.");
  return { status: 'TESTING', code: 'class TokenBucket { ... }' };
});

graph.addNode('tester', () => {
  console.log("Tester: Running automated unit tests. 5/5 passed!");
  return { status: 'COMPLETE', testsPassed: true };
});

graph.addEdge('supervisor', 'coder');
graph.addEdge('coder', 'tester');

graph.run({ prompt: 'Build a production rate limiter' });`,
    quiz: [
      { q: 'In LangGraph, how is state managed across multiple agents?', options: ['Through global window variables', 'Via a shared typed state dictionary or schema passed to each node, with checkpoint persistence', 'Using raw text files on the desktop', 'State is not supported in LangGraph'], answer: 1 },
      { q: 'What is a Conditional Edge in LangGraph?', options: ['A CSS border style', 'A routing function that inspects the current graph state and dynamically selects the next node to invoke', 'A hardware connection between GPUs', 'An edge that can only run once per day'], answer: 1 },
      { q: 'What capability does LangGraph Checkpointing provide?', options: ['Syntax highlighting in terminal', 'State persistence after every step, enabling Human-in-the-loop approvals, rewinds, and crash recovery', 'Automatic spell checking', 'Compresses images into zip files'], answer: 1 },
      { q: 'Why is the Multi-Agent Supervisor pattern effective for complex engineering tasks?', options: ['It requires no LLM tokens', 'A supervisor agent breaks big goals into focused subtasks and delegates to specialized subagents with scoped toolsets', 'It forces all code into a single monolithic file', 'It prevents git merge conflicts automatically'], answer: 1 }
    ]
  },
  {
    id: 'mcp-protocol-tools',
    title: 'Model Context Protocol (MCP) & Autonomous Tools',
    duration: '16 min',
    xp: 55,
    content: `## The Model Context Protocol (MCP) Standard

Anthropic's open-standard **Model Context Protocol (MCP)** provides a secure, universal protocol for connecting AI models to external tools, local filesystems, developer environments, and enterprise data sources.

### MCP Core Topology
\`\`\`
[ AI Application (Host) ]
           |
      [ MCP Client ]
     /       |      \\
  (stdio)  (SSE)  (Stream)
   /         |        \\
[Git MCP] [DB MCP] [Filesystem MCP]
(Server)  (Server)  (Server)
\`\`\`

1. **MCP Host**: The LLM interface (e.g. Claude Desktop, Antigravity IDE, Cursor).
2. **MCP Client**: Maintains 1:1 protocol sessions with MCP servers.
3. **MCP Server**: Lightweight programs exposing specific capabilities through standard JSON-RPC 2.0 primitives:
   - **Tools**: Executable functions callable by the model (e.g. \`execute_sql\`, \`read_file\`).
   - **Resources**: Read-only contextual data (e.g. database schemas, logs).
   - **Prompts**: Reusable prompt templates and workflows.

### Standard Transports
- **stdio**: Standard Input/Output. Ideal for local tools, fast and zero network configuration.
- **SSE (Server-Sent Events)**: HTTP streaming. Used for remote or hosted MCP microservices.`,
    code: `// MCP JSON-RPC 2.0 Protocol Server & Tool Execution Simulator
class MCPServer {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.tools = new Map();
  }

  registerTool(name, description, schema, handler) {
    this.tools.set(name, { name, description, schema, handler });
  }

  async handleRequest(request) {
    const { id, method, params } = request;
    console.log(\`📥 [MCP JSON-RPC] Handling: \${method}\`);

    if (method === 'tools/list') {
      const toolList = Array.from(this.tools.values()).map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.schema
      }));
      return { jsonrpc: '2.0', id, result: { tools: toolList } };
    }

    if (method === 'tools/call') {
      const tool = this.tools.get(params.name);
      if (!tool) {
        return { jsonrpc: '2.0', id, error: { code: -32601, message: 'Tool not found' } };
      }
      const output = await tool.handler(params.arguments);
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(output) }] } };
    }
  }
}

const server = new MCPServer("github-tools", "1.0.0");
server.registerTool("create_branch", "Create a git branch", { branchName: "string" }, (args) => {
  return { status: "created", branch: args.branchName, sha: "a1b2c3d4" };
});

server.handleRequest({ jsonrpc: '2.0', id: 1, method: 'tools/list' }).then(r => console.log('tools/list response:', r));
server.handleRequest({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'create_branch', arguments: { branchName: 'feature/mcp' } } }).then(r => console.log('tools/call response:', r));`,
    quiz: [
      { q: 'What is the Model Context Protocol (MCP)?', options: ['A new programming language designed by Google', 'An open standard for securely connecting AI models to external tools, databases, and developer environments', 'A hardware interface for PCI-e slots', 'A database index algorithm'], answer: 1 },
      { q: 'What messaging format is used in MCP communications?', options: ['Raw binary strings', 'JSON-RPC 2.0 specification', 'XML with SOAP headers', 'CSV files'], answer: 1 },
      { q: 'What are the three core primitives an MCP server can expose?', options: ['Colors, Fonts, Spacing', 'Tools (functions), Resources (data), and Prompts (templates)', 'CPU, GPU, RAM', 'Get, Post, Delete'], answer: 1 },
      { q: 'Which MCP transport is typically used for running fast, local developer tools without networking overhead?', options: ['WebSockets', 'stdio (Standard Input/Output)', 'Bluetooth', 'FTP'], answer: 1 }
    ]
  }
];

export const modernFrontendTrack = {
  id: 'modern-frontend',
  title: 'Modern Frontend (React 19 & Next.js 15)',
  icon: '⚛️',
  color: '#00d2ff',
  gradient: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
  desc: 'React 19 Server Components, Actions, Next.js 15 App Router, and Advanced TypeScript.',
  lessons: [
    {
      id: 'react19-modern-actions',
      title: 'React 19 Actions & Optimistic UI',
      duration: '16 min',
      xp: 50,
      content: `## The React 19 Paradigm Shift

React 19 revolutionizes full-stack and client web development by introducing native async transitions, form Actions, and built-in optimistic rendering hooks.

### 1. React 19 Actions
Before React 19, handling form submissions required manual \`isLoading\`, \`error\`, and \`preventDefault()\` handlers. React 19 introduces native **Actions**:

\`\`\`jsx
import { useActionState } from 'react';

function ProfileEditor({ updateNameAction }) {
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const res = await updateNameAction(formData.get('name'));
    return res;
  }, { error: null, success: false });

  return (
    <form action={formAction}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update Name'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
\`\`\`

### 2. Optimistic Updates with \`useOptimistic\`
Users expect instant feedback. \`useOptimistic\` updates the UI immediately while an asynchronous server action is in-flight, automatically rolling back if the request fails!

### 3. The \`use()\` Hook
The new \`use()\` API can read promises and context inside render functions, integrating seamlessly with Suspense boundaries.`,
      code: `// React 19 Optimistic State Machine Simulator
class OptimisticFeedSimulator {
  constructor(initialPosts) {
    this.serverPosts = [...initialPosts];
    this.optimisticPosts = [...initialPosts];
  }

  async addPostAction(newPostTitle) {
    const tempId = \`temp-\${Date.now()}\`;
    const optimisticItem = { id: tempId, title: newPostTitle, pending: true };

    this.optimisticPosts.unshift(optimisticItem);
    console.log("⚡ Optimistic UI Updated Instantly:", this.optimisticPosts);

    try {
      await new Promise(r => setTimeout(r, 200));
      const confirmedPost = { id: \`post-\${Date.now()}\`, title: newPostTitle, pending: false };
      this.serverPosts.unshift(confirmedPost);
      this.optimisticPosts = [...this.serverPosts];
      console.log("✅ Server Action Confirmed! UI Synced:", this.optimisticPosts);
    } catch {
      this.optimisticPosts = [...this.serverPosts];
      console.error("❌ Action Failed. Optimistic state rolled back to server state!");
    }
  }
}

const feed = new OptimisticFeedSimulator([{ id: 1, title: "Welcome to React 19", pending: false }]);
feed.addPostAction("Learning useOptimistic & Actions");`,
      quiz: [
        { q: 'What does React 19 useOptimistic accomplish?', options: ['Compresses images in React', 'Renders an immediate optimistic UI state while an async server operation completes, rolling back automatically on error', 'Replaces TypeScript', 'Connects directly to MongoDB from the browser'], answer: 1 },
        { q: 'Which React 19 hook handles async form state, errors, and pending flags natively?', options: ['useActionState', 'useEffect', 'useReducer', 'useLayoutEffect'], answer: 0 },
        { q: 'How does the React 19 use() API differ from standard hooks?', options: ['It can be called conditionally or inside loops and unwraps Promises directly with Suspense', 'It can only run on Sundays', 'It cannot read React Context', 'It only works with HTML canvas'], answer: 0 },
        { q: 'What is a key performance benefit of React Server Components (RSC)?', options: ['They run faster on Safari', 'Their dependencies and libraries are kept on the server and never shipped to the client JavaScript bundle', 'They eliminate CSS files', 'They force browsers to use WebGL'], answer: 1 }
      ]
    },
    {
      id: 'nextjs15-app-router',
      title: 'Next.js 15 App Router & Server Actions',
      duration: '18 min',
      xp: 55,
      content: `## Next.js 15 App Router Architecture

Next.js 15 represents the pinnacle of modern web architecture, unifying React 19 Server Components, streaming SSR, and secure Server Actions.

### File-System Routing Hierarchy
\`\`\`
app/
 ├── layout.tsx       # Root shell, navbar, theme provider
 ├── page.tsx         # Route /
 ├── loading.tsx      # Instant Suspense fallback skeleton
 ├── error.tsx        # Client error boundary
 └── api/
     └── route.ts     # Edge / Node Route Handlers
\`\`\`

### Server Actions (\`'use server'\`)
Execute backend logic directly from UI components with zero REST endpoint boilerplate:

\`\`\`tsx
// app/actions.ts
'use server';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({ title: z.string().min(3) });

export async function createTodo(formData: FormData) {
  const parsed = schema.safeParse({ title: formData.get('title') });
  if (!parsed.success) throw new Error("Invalid input");
  await db.todo.create({ data: { title: parsed.data.title } });
}
\`\`\`

### Partial Prerendering (PPR)
PPR combines the speed of static sites with the power of dynamic server rendering in a single HTTP request: the static page shell is served instantly from the CDN, while dynamic components stream in via React Suspense.`,
      code: `// Next.js 15 Streaming SSR & Suspense Simulator
class NextServerRenderer {
  async renderPage() {
    console.log("🚀 [Edge CDN] Instant response: Serving static HTML shell...");
    console.log(\`
      <html>
        <header>SkillMap Header</header>
        <div id="content">
          <!-- Suspense Fallback -->
          <div class="skeleton">Loading personalized curriculum...</div>
        </div>
      </html>
    \`);

    await new Promise(r => setTimeout(r, 200));
    console.log("🌊 [Stream Chunk 1] Dynamic User Roadmap streamed to browser.");

    await new Promise(r => setTimeout(r, 150));
    console.log("🌊 [Stream Chunk 2] Recommended AI Tutorials streamed. Stream closed.");
  }
}

const renderer = new NextServerRenderer();
renderer.renderPage();`,
      quiz: [
        { q: 'What does the "use server" directive declare in Next.js 15?', options: ['Runs the file on an Apache HTTP server', 'Marks a function or file as a Server Action that executes exclusively on the server', 'Enables WebSocket connections', 'Disables TypeScript checking'], answer: 1 },
        { q: 'What is Next.js Partial Prerendering (PPR)?', options: ['A mode that disables CSS', 'Serving a static page shell immediately from edge CDN while streaming dynamic parts with Suspense in one connection', 'Rendering half the page in black and white', 'Pre-building pages only for mobile devices'], answer: 1 },
        { q: 'In the App Router, what is the role of loading.tsx?', options: ['Shows a 404 page', 'Acts as an automatic React Suspense boundary fallback while the sibling page.tsx loads data', 'Compiles JavaScript into WebAssembly', 'Validates user passwords'], answer: 1 },
        { q: 'Why should input validation (like Zod) always be performed inside Server Actions?', options: ['To make the code longer', 'Because client-side validation can be bypassed by malicious HTTP requests directly hitting the server action endpoint', 'Zod is required by the React compiler', 'To format dates automatically'], answer: 1 }
      ]
    },
    {
      id: 'advanced-typescript',
      title: 'Advanced TypeScript: Generics, Mapped & Branded Types',
      duration: '16 min',
      xp: 45,
      content: `## Advanced TypeScript Architecture

Writing clean, type-safe enterprise code requires mastering TypeScript's advanced type-level programming features.

### 1. Discriminated Unions (Pattern Matching)
\`\`\`typescript
type APIResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; code: number };

function handle(res: APIResponse<User>) {
  if (res.status === 'success') {
    console.log(res.data.name); // TS knows 'data' exists!
  } else {
    console.error(res.error);    // TS knows 'error' exists!
  }
}
\`\`\`

### 2. Branded (Nominal) Types
Prevent accidental ID swapping (e.g. passing an \`OrderId\` where a \`UserId\` is expected):
\`\`\`typescript
type Brand<K, T> = K & { readonly __brand: T };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

let uId = 'u_123' as UserId;
let oId = 'o_456' as OrderId;
// uId = oId; // ❌ Compile Error! Prevents catastrophic bugs!
\`\`\`

### 3. Conditional Types & the \`infer\` Keyword
\`\`\`typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;
type Str = Flatten<string[]>; // type is string
\`\`\``,
      code: `// Discriminated Union & Type-Safe Dispatcher Simulator
class ActionDispatcher {
  dispatch(action) {
    switch (action.type) {
      case 'SKILL_LEARNED':
        console.log(\`🎯 XP Awarded: +\${action.xp} for mastering \${action.skillName}\`);
        return { success: true, newXP: action.xp };
      case 'STREAK_EXTENDED':
        console.log(\`🔥 Streak extended to \${action.days} days!\`);
        return { success: true, days: action.days };
      default:
        throw new Error(\`Unhandled action: \${JSON.stringify(action)}\`);
    }
  }
}

const dispatcher = new ActionDispatcher();
dispatcher.dispatch({ type: 'SKILL_LEARNED', skillName: 'React 19', xp: 50 });
dispatcher.dispatch({ type: 'STREAK_EXTENDED', days: 14 });`,
      quiz: [
        { q: 'What is a Discriminated Union in TypeScript?', options: ['A union of union types', 'A union of object types having a common literal property (tag) that allows TypeScript to narrow types accurately', 'A type that deletes union members', 'An interface with private fields'], answer: 1 },
        { q: 'What problem do Branded (Nominal) Types solve?', options: ['They speed up web page load times', 'They prevent assigning structurally identical primitive types (like UserId vs OrderId) to each other by mistake', 'They add trademarks to the code', 'They allow numbers to be strings'], answer: 1 },
        { q: 'What does the "infer" keyword do in conditional types?', options: ['Guesses the variable name', 'Introduces a type variable within a type condition to be deduced automatically', 'Converts errors into warnings', 'Forces the compiler to guess types'], answer: 1 },
        { q: 'Why is "satisfies" operator often preferred over type assertion ("as")?', options: ['It runs faster in Node', 'It validates that an expression matches a type WITHOUT widening the inferred literal types', 'It disables null checks', 'It formats strings automatically'], answer: 1 }
      ]
    }
  ]
};

export const highPerformanceBackendTrack = {
  id: 'high-performance-backend',
  title: 'High-Performance Backend & Go',
  icon: '🏎️',
  color: '#00add8',
  gradient: 'linear-gradient(135deg, #00add8, #007d9c)',
  desc: 'Go concurrency, worker pools, gRPC microservices, and distributed architecture.',
  lessons: [
    {
      id: 'go-concurrency-workers',
      title: 'Go Goroutines & High-Throughput Worker Pools',
      duration: '18 min',
      xp: 55,
      content: `## Concurrency in Go: Goroutines & Channels

Go was designed at Google specifically for scalable network services. Its concurrency model is based on **CSP (Communicating Sequential Processes)**: "Do not communicate by sharing memory; instead, share memory by communicating."

### Goroutines vs OS Threads
- **OS Thread**: 1–2 MB fixed stack size. Context switching requires kernel space overhead.
- **Goroutine**: Starts at only **2 KB** dynamically resizable stack! A single Go process can effortlessly run 100,000+ goroutines concurrently.

### Channels & Worker Pool Pattern
A worker pool processes large volumes of background tasks with a controlled number of concurrent workers:

\`\`\`go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, j)
        time.Sleep(time.Millisecond * 100)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Spin up 3 concurrent workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)
}
\`\`\``,
      code: `// Go-Style Concurrent Worker Pool Simulator
class GoWorkerPool {
  constructor(workerCount) {
    this.workerCount = workerCount;
    this.jobQueue = [];
  }

  submit(jobId, taskDurationMs) {
    this.jobQueue.push({ id: jobId, duration: taskDurationMs });
  }

  async start() {
    console.log(\`🏎️ Starting Go Worker Pool with \${this.workerCount} concurrent goroutines...\`);
    const workers = Array.from({ length: this.workerCount }, (_, i) => this.runWorker(i + 1));
    await Promise.all(workers);
    console.log("🏁 All jobs processed across worker pool!");
  }

  async runWorker(workerId) {
    while (this.jobQueue.length > 0) {
      const job = this.jobQueue.shift();
      if (!job) break;
      console.log(\`[Worker \${workerId}] Starting Job \${job.id}...\`);
      await new Promise(r => setTimeout(r, job.duration));
      console.log(\`✅ [Worker \${workerId}] Finished Job \${job.id}\`);
    }
  }
}

const pool = new GoWorkerPool(3);
pool.submit("ProcessPayment-101", 100);
pool.submit("IndexResume-102", 70);
pool.submit("SendEmail-103", 50);
pool.submit("GeneratePDF-104", 80);
pool.start();`,
      quiz: [
        { q: 'What is the initial memory overhead of a Go Goroutine compared to an OS Thread?', options: ['Same (2 MB)', 'Goroutines start at only ~2 KB of memory compared to 1-2 MB for OS threads', 'Goroutines take 1 GB', 'Goroutines use zero memory'], answer: 1 },
        { q: 'What is the CSP concurrency principle adopted by Go?', options: ['Always use global variables with mutexes', 'Do not communicate by sharing memory; instead, share memory by communicating via channels', 'Never run more than 1 thread', 'Only use recursive functions'], answer: 1 },
        { q: 'Why is the Worker Pool pattern used in backend systems?', options: ['To consume 100% of memory', 'To cap concurrent task execution, preventing resource exhaustion and database connection starvation under heavy load', 'To format JSON responses', 'To restart crashed containers'], answer: 1 },
        { q: 'What happens when sending to an unbuffered channel in Go when no receiver is ready?', options: ['The program crashes', 'The sending goroutine blocks until another goroutine reads from the channel', 'The message is written to disk', 'The channel doubles its size'], answer: 1 }
      ]
    },
    {
      id: 'grpc-microservices',
      title: 'gRPC & Protocol Buffers for High-Speed Microservices',
      duration: '16 min',
      xp: 50,
      content: `## High-Performance Microservices with gRPC

While REST over JSON/HTTP 1.1 is universal for public APIs, internal microservices require high throughput and ultra-low latency. **gRPC** uses **HTTP/2** and binary **Protocol Buffers (Protobuf)**.

### REST vs gRPC Comparison
| Feature | REST | gRPC |
|---|---|---|
| **Protocol** | HTTP/1.1 or HTTP/2 | HTTP/2 (Multiplexed Streams) |
| **Payload Format** | Text JSON (verbose) | Binary Protobuf (compact, ~7x smaller) |
| **Contract** | OpenAPI / Swagger (optional) | Strict \`.proto\` schema (mandatory) |
| **Streaming** | Request/Response (SSE for 1-way) | Bidirectional Streaming |
| **Code Generation** | Third-party tools | Built-in \`protoc\` for Go, Java, TS, Python |

### Protobuf Schema (\`user.proto\`)
\`\`\`protobuf
syntax = "proto3";

package userservice;

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc StreamMetrics (Empty) returns (stream MetricPoint);
}

message UserRequest {
  string user_id = 1;
}

message UserResponse {
  string name = 1;
  string email = 2;
  int32 xp = 3;
}
\`\`\``,
      code: `// Protobuf Binary vs JSON Serialization Comparison Simulator
function compareSerialization(sampleData) {
  const jsonString = JSON.stringify(sampleData);
  const jsonBytes = new TextEncoder().encode(jsonString).length;

  let protoBytes = 0;
  for (const [, val] of Object.entries(sampleData)) {
    protoBytes += 1;
    if (typeof val === 'number') protoBytes += 2;
    else if (typeof val === 'string') protoBytes += 1 + val.length;
  }

  console.log(\`📦 Payload: \${sampleData.name} (\${sampleData.email})\`);
  console.log(\`📄 JSON Payload Size: \${jsonBytes} bytes\`);
  console.log(\`⚡ Binary Protobuf Size: \${protoBytes} bytes (~\${Math.round((1 - protoBytes/jsonBytes)*100)}% smaller!)\`);
  return { jsonBytes, protoBytes };
}

compareSerialization({
  userId: "usr_82947192",
  name: "Senior AI Engineer",
  email: "lead@skillmap.io",
  xp: 15420,
  active: true
});`,
      quiz: [
        { q: 'Why is gRPC significantly faster than standard REST with JSON?', options: ['It does not use network cables', 'It uses binary serialization (Protobuf) and HTTP/2 multiplexing over a single persistent TCP connection', 'It skips authentication checks', 'It only works on localhost'], answer: 1 },
        { q: 'What is the role of the .proto file in a gRPC architecture?', options: ['Defines styling for the browser', 'Acts as a strict, language-agnostic contract for service methods and message structures used to generate client/server stubs', 'Stores secret database passwords', 'Configures Docker containers'], answer: 1 },
        { q: 'What streaming capability does gRPC natively support over HTTP/2?', options: ['Only 1-way text streaming', 'Full Bidirectional streaming where client and server can send sequences of messages concurrently', 'Analog radio streaming', 'Email streaming'], answer: 1 },
        { q: 'Why is Protobuf serialization smaller in payload size than JSON?', options: ['Protobuf replaces keys with numbered binary field tags and encodes numbers as compact varints instead of ascii text', 'Protobuf removes consonants from text', 'Protobuf compresses files using 7zip', 'Protobuf only allows 10 words per object'], answer: 0 }
      ]
    }
  ]
};
