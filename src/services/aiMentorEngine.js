// ============================================================
// SENIOR DEVELOPER AI AGENT & MENTOR ENGINE — SkillMap 2026
// Hybrid: Built-in Advanced Reasoning Engine + Live Cloud LLM (BYOK)
// ============================================================

const BYOK_CONFIG_KEY = 'skillmap_byok_config';

export const getBYOKConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(BYOK_CONFIG_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveBYOKConfig = (config) => {
  try {
    localStorage.setItem(BYOK_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save BYOK config:', e);
  }
};

// ── Built-in Senior Developer Knowledge Base ──────────────────
const SENIOR_DEV_PATTERNS = [
  {
    matches: ['docker', 'container', 'dockerfile', 'image'],
    title: 'Senior DevOps Architect on Containerization',
    response: `🐳 **Senior DevOps Insights on Production Docker Architecture**:

1. **Multi-Stage Builds**: Keep your final production image lean. Compile in a heavy builder stage (\`node:20-alpine\` or \`golang:1.22-alpine\`), and copy only the compiled binary/dist to a minimal runner.
2. **Layer Caching Optimization**: Copy \`package*.json\` and run \`npm ci\` *before* copying your application source code (\`COPY . .\`). Docker caches layers from top to bottom; changing code won't invalidate dependency layers.
3. **Non-Root Execution**: Never run as root. Always add:
   \`\`\`dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   \`\`\`
4. **Health Checks**: Define native \`HEALTHCHECK\` instructions so orchestrators know when the app is genuinely ready.

Would you like me to review your Dockerfile or generate a Kubernetes deployment manifest for it?`
  },
  {
    matches: ['kubernetes', 'k8s', 'pod', 'deployment', 'ingress'],
    title: 'Principal Cloud Architect on Kubernetes',
    response: `☸️ **Senior Kubernetes Engineering Advice**:

- **Zero-Downtime Rollouts**: In your \`Deployment\` spec, always configure:
  \`\`\`yaml
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  \`\`\`
  This guarantees that new replacement pods must pass readiness probes *before* old pods are terminated.
- **Probes**: Don't confuse \`livenessProbe\` (restarts frozen processes) with \`readinessProbe\` (removes unhealthy pods from Service endpoints without killing them).
- **Resources**: Always specify both \`requests\` (for scheduler placement) and \`limits\` (to prevent memory leaks from starving the node).

What specific microservice workload are you deploying?`
  },
  {
    matches: ['langgraph', 'agent', 'agents', 'mcp', 'multi-agent', 'langchain', 'crewai'],
    title: 'Lead AI Engineer on Autonomous Agent Systems',
    response: `🤖 **Lead AI Systems Engineer on Agent Architecture (2026)**:

1. **Move beyond naive prompts to Stateful Graphs**: Single prompt loops drift and hallucinate. Using **LangGraph**, model your application as a directed state graph (\`StateGraph\`) with typed schema, state reducers, and explicit conditional edges.
2. **Supervisor Pattern**:
   - Break monolithic agent tasks into specialized subagents: *Researcher*, *Coder*, *Tester*, *Reviewer*.
   - A Supervisor node evaluates progress and routes tasks dynamically until acceptance criteria are met.
3. **Model Context Protocol (MCP)**:
   - Anthropic's open MCP standard decouples tool definitions from individual models. Expose tools via JSON-RPC 2.0 over \`stdio\` (for local dev) or \`SSE\` (for remote APIs).
4. **Checkpointing & Human-in-the-Loop**:
   - Always persist graph state at critical decision boundaries (e.g. database deletions, external API writes) so a human can approve or rewind execution.

Would you like a production LangGraph or MCP server code example for your project?`
  },
  {
    matches: ['rag', 'vector', 'pgvector', 'embedding', 'semantic search', 'pinecone'],
    title: 'Staff AI/RAG Engineer on Semantic Search',
    response: `🔍 **Staff AI Engineer on Production RAG Architecture**:

Naive RAG (split text by 500 chars -> cosine similarity) fails in production. Here is how modern enterprise RAG is built:

1. **Hybrid Retrieval**: Combine dense semantic search (\`pgvector\` with HNSW index) and sparse keyword search (BM25 or PostgreSQL \`tsvector\`).
2. **Reciprocal Rank Fusion (RRF)**: Fuse both rankings using formula:
   $$\\text{RRF\\_Score} = \\sum_{m \\in M} \\frac{1}{60 + \\text{rank}_m(d)}$$
3. **Cross-Encoder Reranking**: Send top 25 candidates through a Cohere or BGE reranker to surface the true top 3 passages for generation.
4. **Chunk Overlap**: Always maintain 10–15% overlap to prevent vital sentence context from being sliced at chunk boundaries.

Need help writing a \`pgvector\` SQL migration or tuning an HNSW index?`
  },
  {
    matches: ['react', 'react 19', 'nextjs', 'next.js', 'frontend'],
    title: 'Principal Frontend Architect on React 19 & Next.js 15',
    response: `⚛️ **Principal Frontend Architect on Modern Web UI**:

- **React 19 Actions**: Replace tedious \`useState\` boilerplate for forms with \`useActionState\` and \`useFormStatus\`. They manage pending transitions and error states automatically.
- **Optimistic UI with \`useOptimistic\`**: Deliver instant 0ms visual feedback to users during network requests. If the server action throws, React automatically rolls back the UI.
- **Next.js 15 Partial Prerendering (PPR)**: Serve static shell from the edge CDN instantly, while streaming dynamic data into React \`<Suspense>\` slots in the same HTTP response.
- **TypeScript Strictness**: Use Discriminated Unions for UI states (\`{ status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T }\`) to make impossible states unrepresentable!

What component or state management challenge are you solving right now?`
  },
  {
    matches: ['redis', 'cache', 'caching', 'rate limit', 'ratelimit'],
    title: 'Senior Distributed Systems Architect on Caching',
    response: `⚡ **Senior Systems Architect on Redis Caching & Rate Limiting**:

1. **Cache-Aside (Lazy Loading)**:
   - Check Redis -> On hit return data (< 1ms).
   - On miss -> Query DB, set key in Redis with a reasonable TTL (e.g. 3600s + jitter to avoid cache stampede), return data.
2. **Sliding-Window Rate Limiting with Sorted Sets (ZSET)**:
   - Use Unix timestamps as the score and value.
   - Run: \`ZREMRANGEBYSCORE key 0 (now - windowMs)\`
   - Run: \`ZCARD key\`
   - If count >= limit, reject with **HTTP 429**.
   - Else: \`ZADD key now now\` and set expiration.
3. **Data Structure Selection**:
   - Fast counter -> \`INCR\`
   - Object cache -> \`HSET\` (memory efficient)
   - Real-time leaderboard -> \`ZSET\`

Would you like a code snippet implementing sliding-window rate limiting in Node.js or Go?`
  },
  {
    matches: ['go', 'golang', 'goroutine', 'grpc', 'protobuf'],
    title: 'Staff Backend Systems Engineer on Go & gRPC',
    response: `🏎️ **Staff Backend Engineer on Go Concurrency & High Throughput**:

- **Goroutines**: Start with only ~2 KB stack overhead. You can spawn 100,000+ goroutines on standard hardware.
- **Worker Pools**: Don't spawn unbounded goroutines per request. Use a fixed worker pool with buffered channels to prevent database connection exhaustion.
- **gRPC vs REST**:
  - gRPC uses binary Protobuf over HTTP/2 multiplexed streams, reducing payload size by ~70% and latency by ~4x compared to JSON over HTTP/1.1.
  - Ideal for east-west internal microservice communication with strict \`.proto\` contracts.
- **Channel Best Practices**:
  - The sender should close the channel, never the receiver.
  - Always use \`context.Context\` with timeouts for cancellation propagation.

Would you like an example worker pool implementation in Go?`
  },
  {
    matches: ['system design', 'architecture', 'scalability', 'kafka', 'microservices'],
    title: 'Chief Technical Architect on Scalability',
    response: `🏛️ **Chief Architect on System Design & Scalability**:

When designing high-throughput systems:
1. **Event-Driven Architecture with Kafka**:
   - Decouple publishers and subscribers using immutable, partitionable event logs.
   - Scale consumer throughput horizontally by increasing partition count. Ensure consumer handlers are **idempotent**!
2. **Database Sharding & Consistent Hashing**:
   - When a single DB instance hits I/O bottlenecks, shard by hash of user/tenant ID across independent nodes. Consistent hashing rings minimize data redistribution during node scaling.
3. **CAP & PACELC Tradeoffs**:
   - In distributed partitions (P), choose Consistency (C) vs Availability (A). If no partition (E), balance Latency (L) vs Consistency (C).

What is the expected QPS (queries per second) and read/write ratio of your system?`
  }
];

// ── Built-in Code Reviewer Agent ──────────────────────────────
export const reviewCodeWithAI = (code, lang = 'javascript') => {
  const issues = [];
  const suggestions = [];
  let score = 90;

  const lines = code.split('\n');

  // Syntax & best practice heuristics
  if (lang === 'javascript' || lang === 'html') {
    if (code.includes('var ')) {
      issues.push("Found 'var' declaration. Modern JS requires 'const' or 'let' to prevent variable hoisting and scope leakage.");
      score -= 10;
    }
    if (code.includes('console.log') && lines.length > 50) {
      suggestions.push("Multiple console.log statements detected. In production, consider structured telemetry or a logger (e.g. Pino/Winston).");
    }
    if (code.includes('== ') && !code.includes('=== ')) {
      issues.push("Loose equality ('==') detected. Use strict equality ('===') to avoid subtle type coercion bugs.");
      score -= 5;
    }
    if (code.includes('innerHTML') && !code.includes('DOMPurify')) {
      issues.push("Direct 'innerHTML' assignment detected without sanitization. High risk of Cross-Site Scripting (XSS). Use textContent or DOMPurify.");
      score -= 20;
    }
    if (code.includes('try {') && !code.includes('catch')) {
      issues.push("Unterminated or malformed try block.");
      score -= 15;
    }
  }

  if (lang === 'python') {
    if (code.includes('except:') && !code.includes('except Exception:')) {
      issues.push("Bare 'except:' caught! This intercepts system signals like KeyboardInterrupt. Catch specific exceptions or 'except Exception:'.");
      score -= 10;
    }
    if (code.includes('eval(')) {
      issues.push("Dangerous use of 'eval()'! Can lead to arbitrary remote code execution.");
      score -= 25;
    }
  }

  // Time complexity estimation
  let complexity = 'O(1) to O(N)';
  const loopCount = (code.match(/for\s*\(|while\s*\(|\.forEach|\.map/g) || []).length;
  if (loopCount >= 2 && (code.includes('for') && code.indexOf('for') !== code.lastIndexOf('for'))) {
    complexity = 'O(N²) - Nested loops detected';
    suggestions.push("Nested iteration detected. Check if a Hash Map (O(1) lookup) can optimize the time complexity to O(N).");
  } else if (loopCount === 1) {
    complexity = 'O(N) - Linear iteration';
  }

  return {
    score: Math.max(30, score),
    complexity,
    issues: issues.length ? issues : ["✅ Clean code! No critical syntax or safety anti-patterns detected."],
    suggestions: suggestions.length ? suggestions : ["💡 Idiomatic and clean structure."],
    verdict: score >= 80 ? "PRODUCTION READY" : score >= 60 ? "NEEDS REFACTORING" : "CRITICAL REFACTOR REQUIRED"
  };
};

// ── Live Cloud LLM Call (BYOK) ────────────────────────────────
export const callLiveCloudLLM = async ({ prompt, systemPrompt, conversationHistory = [] }) => {
  const config = getBYOKConfig();
  const provider = config.provider || 'gemini';
  const apiKey = config.apiKey?.trim();

  if (!apiKey) {
    throw new Error('No API Key configured. Please enter your API key in BYOK Settings or use the Local Senior Dev Engine.');
  }

  const sys = systemPrompt || "You are Sentinel, a world-class Senior Staff Software Engineer and interactive AI Tutor on SkillMap. Provide concise, highly actionable code snippets, architectural breakdowns, and friendly mentorship.";

  // 1. Google Gemini API
  if (provider === 'gemini') {
    const model = config.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [
      { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${sys}` }] },
      ...conversationHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";
  }

  // 2. OpenAI API
  if (provider === 'openai') {
    const model = config.model || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      { role: 'system', content: sys },
      ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response received from OpenAI.";
  }

  // 3. Groq API (High Speed Open Models)
  if (provider === 'groq') {
    const model = config.model || 'llama-3.3-70b-versatile';
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const messages = [
      { role: 'system', content: sys },
      ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "No response received from Groq.";
  }

  throw new Error(`Unsupported provider: ${provider}`);
};

// ── Unified AI Agent Query Dispatcher ─────────────────────────
export const querySeniorAITutor = async ({ message, conversationHistory = [], skillGaps = [], targetRole = '' }) => {
  const config = getBYOKConfig();

  // If user enabled Live Cloud AI and provided key, use live LLM
  if (config.enabled && config.apiKey) {
    try {
      let contextualSystem = "You are Sentinel, a Senior Staff Software Engineer and AI Tutor on SkillMap.";
      if (targetRole || skillGaps.length) {
        contextualSystem += ` The user is working towards target role: "${targetRole}" with active skill gaps: [${skillGaps.join(', ')}]. Tailor your technical examples and advice to help them master these gaps.`;
      }
      return await callLiveCloudLLM({ prompt: message, systemPrompt: contextualSystem, conversationHistory });
    } catch (err) {
      console.warn("Live Cloud LLM failed, falling back to Senior Dev Local Engine:", err.message);
      // Fall through to local engine
    }
  }

  // Built-in Senior Dev Reasoning Engine
  const lower = message.toLowerCase();

  // Check matching patterns
  for (const pattern of SENIOR_DEV_PATTERNS) {
    if (pattern.matches.some(m => lower.includes(m))) {
      return pattern.response;
    }
  }

  // Contextual Gap / Career Inquiry
  if (lower.includes('gap') || lower.includes('resume') || lower.includes('missing')) {
    if (skillGaps.length > 0) {
      return `🎯 **Custom Skill Gap Roadmap for ${targetRole || 'Your Target Role'}**:

Based on your resume analysis, here are your active gaps: **${skillGaps.join(', ')}**.

Recommended 3-Week Mastery Strategy:
- **Week 1 (${skillGaps[0] || 'Core Foundation'})**: Complete the hands-on tutorials in our Learn Hub. Focus on architectural primitives and code playgrounds.
- **Week 2 (${skillGaps[1] || 'Advanced Patterns'})**: Build a mini-project combining ${skillGaps.slice(0, 2).join(' + ')}.
- **Week 3 (System Integration)**: Write unit tests and containerize with Docker to prove production readiness on your GitHub!

Which of these skills would you like to dive into right now?`;
    }
  }

  if (lower.includes('quiz') || lower.includes('test me') || lower.includes('challenge')) {
    return `⚔️ **Senior Dev Quick Challenge**:

*Question*: In a distributed system handling 50,000 requests/second, you have a read-heavy endpoint querying PostgreSQL. The database CPU is at 95%.

Which architectural pattern should you apply first to eliminate the bottleneck?
1. Shard the database into 10 partitions
2. Introduce a Redis Cache-Aside layer with TTL + Jitter
3. Rewrite the backend in C++
4. Double the EC2 instance RAM

*Reply with your answer and rationale!*`;
  }

  // Generic technical mentor fallback
  return `🤖 **Sentinel (Senior Dev AI Tutor)**:

Great question, Operative! To tackle this like a senior engineer, I recommend breaking it down into:
1. **System Boundaries**: What are the inputs, throughput requirements, and expected SLAs?
2. **Core Technology Choice**: Use the best-fit tool for the job (e.g., PostgreSQL for relational ACID, Redis for caching, Kafka for streaming).
3. **Operational Guardrails**: Implement automated CI tests, Docker containerization, and distributed tracing.

Ask me about:
- 🐳 **Docker & Kubernetes** deployment best practices
- 🤖 **LangGraph & MCP** multi-agent workflows
- 🔍 **pgvector & Production RAG**
- ⚛️ **React 19 & Next.js 15** architecture
- 🏎️ **Go & gRPC** high-throughput microservices
- 💡 Or paste code for an **instant AI code review**!`;
};
