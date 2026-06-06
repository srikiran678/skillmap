// ============================================================
// LESSON CONTENT DATABASE — SkillMap
// W3Schools-inspired bite-sized lessons with quizzes
// ============================================================

export const LESSON_TRACKS = [
  {
    id: 'web-fundamentals',
    title: 'Web Fundamentals',
    icon: '🌐',
    color: '#e34c26',
    gradient: 'linear-gradient(135deg, #e34c26, #f06529)',
    desc: 'HTML, CSS, and JavaScript essentials for every developer.',
    lessons: [
      {
        id: 'html-intro',
        title: 'Introduction to HTML',
        duration: '10 min',
        xp: 30,
        content: `## What is HTML?

HTML (HyperText Markup Language) is the **standard markup language** for creating web pages. It describes the structure of a web page.

HTML elements are represented by **tags**, like \`<h1>\`, \`<p>\`, \`<div>\`.

### Basic Structure
Every HTML page has this skeleton:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
\`\`\`

### Key Tags
| Tag | Purpose |
|-----|---------|
| \`<h1>\`–\`<h6>\` | Headings |
| \`<p>\` | Paragraph |
| \`<a href="">\` | Link |
| \`<img src="">\` | Image |
| \`<div>\` | Container |
| \`<span>\` | Inline container |

> **Pro Tip:** Always use semantic HTML tags like \`<header>\`, \`<main>\`, \`<footer>\` for better accessibility and SEO.`,
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Page</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
    h1 { color: #e34c26; }
    .card { background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <h1>🌐 Hello, SkillMap!</h1>
  <div class="card">
    <p>This is my <strong>first</strong> HTML page.</p>
    <p>I'm learning <em>web development</em> step by step.</p>
    <a href="https://skillmap.orpinapp" target="_blank">Visit SkillMap →</a>
  </div>
</body>
</html>`,
        quiz: [
          { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Transfer Markup Logic', 'HyperText Machine Learning', 'Hyper Transfer Meta Language'], answer: 0 },
          { q: 'Which tag is used for the largest heading?', options: ['<h6>', '<header>', '<h1>', '<big>'], answer: 2 },
          { q: 'Which tag creates a hyperlink?', options: ['<link>', '<url>', '<a>', '<href>'], answer: 2 },
          { q: 'Where does webpage content go?', options: ['<head>', '<body>', '<html>', '<meta>'], answer: 1 },
        ]
      },
      {
        id: 'css-basics',
        title: 'CSS Styling Basics',
        duration: '12 min',
        xp: 35,
        content: `## What is CSS?

CSS (Cascading Style Sheets) controls the **visual presentation** of HTML elements — colors, fonts, layouts, spacing, and more.

### Three Ways to Add CSS

1. **Inline** — \`<p style="color: red;">\`
2. **Internal** — \`<style>\` tag inside \`<head>\`
3. **External** — \`<link rel="stylesheet" href="style.css">\`

### Selectors
\`\`\`css
/* Element selector */
p { color: blue; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { font-size: 2rem; }

/* Combinators */
div > p { margin: 0; }        /* direct child */
h1 + p { margin-top: 0; }   /* adjacent sibling */
\`\`\`

### The Box Model
Every HTML element is a box with:
- **Content** → padding → border → **margin**

\`\`\`css
.box {
  width: 200px;
  padding: 16px;
  border: 2px solid #333;
  margin: 20px auto;
}
\`\`\`

### Flexbox Quick Reference
\`\`\`css
.container {
  display: flex;
  justify-content: center;   /* horizontal alignment */
  align-items: center;        /* vertical alignment */
  gap: 16px;
}
\`\`\``,
        code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: white; padding: 30px; }
  
  .card-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 12px;
    padding: 24px;
    flex: 1;
    min-width: 160px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .card:hover { transform: translateY(-4px); }
  .card h3 { font-size: 2rem; margin-bottom: 8px; }
  .card p { opacity: 0.8; font-size: 0.9rem; }
</style>
</head>
<body>
  <h2 style="margin-bottom:20px;">🎨 CSS Flexbox Demo</h2>
  <div class="card-grid">
    <div class="card"><h3>📚</h3><p>Learn</p></div>
    <div class="card" style="background:linear-gradient(135deg,#f093fb,#f5576c)"><h3>🏆</h3><p>Achieve</p></div>
    <div class="card" style="background:linear-gradient(135deg,#4facfe,#00f2fe)"><h3>🚀</h3><p>Grow</p></div>
  </div>
</body>
</html>`,
        quiz: [
          { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Color Style Syntax'], answer: 1 },
          { q: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground'], answer: 2 },
          { q: 'What is the correct Flexbox property to center items horizontally?', options: ['align-items: center', 'justify-content: center', 'text-align: center', 'margin: auto'], answer: 1 },
          { q: 'In the box model, what is outside the border?', options: ['padding', 'content', 'margin', 'outline'], answer: 2 },
        ]
      },
      {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        duration: '15 min',
        xp: 40,
        content: `## JavaScript: The Language of the Web

JavaScript (JS) makes web pages **interactive** — it handles events, manipulates the DOM, fetches data, and runs logic.

### Variables
\`\`\`js
let name = "Alice";         // block-scoped, reassignable
const PI = 3.14;            // block-scoped, constant
var legacy = "old style";   // function-scoped (avoid)
\`\`\`

### Functions
\`\`\`js
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function
const double = (n) => n * 2;

// Default parameters
const welcome = (name = "World") => \`Welcome, \${name}!\`;
\`\`\`

### Arrays and Objects
\`\`\`js
const skills = ["React", "Python", "SQL"];
skills.push("Docker");
const react = skills[0];

const user = {
  name: "Alice",
  level: 5,
  getTitle() { return \`Level \${this.level} Developer\`; }
};
\`\`\`

### DOM Manipulation
\`\`\`js
const el = document.getElementById("output");
el.textContent = "Hello from JS!";
el.style.color = "cyan";

document.querySelector(".btn").addEventListener("click", () => {
  alert("Button clicked!");
});
\`\`\``,
        code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 24px; }
  input { background: #161b22; border: 1px solid #30363d; color: white; padding: 8px 12px; border-radius: 6px; width: 220px; font-size: 1rem; }
  button { background: #238636; color: white; border: none; padding: 9px 18px; border-radius: 6px; cursor: pointer; margin-left: 8px; font-size: 1rem; }
  button:hover { background: #2ea043; }
  #output { margin-top: 20px; padding: 16px; background: #161b22; border-radius: 8px; border-left: 4px solid #238636; font-size: 1.1rem; min-height: 50px; }
  .tag { display: inline-block; margin: 4px; padding: 4px 10px; background: #21262d; border-radius: 99px; font-size: 0.85rem; color: #79c0ff; }
</style>
</head>
<body>
  <h3>🧠 JavaScript Interactive Demo</h3>
  <p style="opacity:0.6;margin:8px 0 16px">Type your name and click the button!</p>
  
  <input id="nameInput" placeholder="Enter your name..." />
  <button onclick="greetUser()">Greet Me!</button>
  
  <div id="output">Your greeting will appear here...</div>
  
  <p style="margin-top:20px;opacity:0.5;">Random skill tags:</p>
  <div id="tags"></div>
  
  <script>
    const skills = ["React","Python","SQL","Docker","TypeScript","AWS","GraphQL","CSS"];
    
    function greetUser() {
      const name = document.getElementById('nameInput').value || 'Developer';
      const level = Math.floor(Math.random() * 10) + 1;
      document.getElementById('output').innerHTML = 
        \`👋 Hello, <strong>\${name}</strong>! You're a Level \${level} SkillMap operative! 🚀\`;
    }
    
    // Generate random tags
    const tagsEl = document.getElementById('tags');
    skills.sort(() => Math.random()-0.5).slice(0,5).forEach(s => {
      tagsEl.innerHTML += \`<span class="tag">\${s}</span>\`;
    });
  </script>
</body>
</html>`,
        quiz: [
          { q: 'Which keyword declares a block-scoped constant?', options: ['var', 'let', 'const', 'def'], answer: 2 },
          { q: 'What does `document.getElementById("id")` do?', options: ['Creates a new element', 'Selects an HTML element by ID', 'Deletes an element', 'Adds a CSS class'], answer: 1 },
          { q: 'What is the output of: `console.log(typeof "hello")`?', options: ['"text"', '"string"', '"char"', '"word"'], answer: 1 },
          { q: 'Which method adds an element to the end of an array?', options: ['push()', 'append()', 'add()', 'insert()'], answer: 0 },
        ]
      },
    ]
  },
  {
    id: 'python-essentials',
    title: 'Python Essentials',
    icon: '🐍',
    color: '#3776ab',
    gradient: 'linear-gradient(135deg, #3776ab, #ffd43b)',
    desc: 'Python programming from basics to data processing.',
    lessons: [
      {
        id: 'python-intro',
        title: 'Python Basics',
        duration: '12 min',
        xp: 35,
        content: `## Why Python?

Python is one of the world's most popular languages — **readable**, **versatile**, and used everywhere from web backends to AI/ML to data science and automation.

### Variables and Types
\`\`\`python
name = "Alice"          # str
age = 25                # int
salary = 75000.50       # float
is_employed = True      # bool
skills = ["Python", "SQL"]  # list
\`\`\`

### Functions
\`\`\`python
def greet(name, title="Developer"):
    return f"Hello, {name} the {title}!"

# Lambda
square = lambda x: x ** 2
\`\`\`

### List Comprehensions
\`\`\`python
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
\`\`\`

### Control Flow
\`\`\`python
for skill in ["Python", "SQL", "React"]:
    print(f"Learning: {skill}")

score = 85
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
print(grade)  # B
\`\`\`

### Dictionaries
\`\`\`python
user = {
    "name": "Alice",
    "xp": 1500,
    "level": 8
}

print(user["name"])       # Alice
user["coins"] = 200       # add key
print(user.get("rank", "Unranked"))  # safe access
\`\`\``,
        code: `# Python Playground — Try editing this!

skills = ["Python", "React", "SQL", "Docker", "AWS"]

print("=== SkillMap Python Demo ===")
print()

# List comprehension
upper = [s.upper() for s in skills]
print("Skills (uppercase):", upper)
print()

# Dictionary
profile = {
    "name": "Operative",
    "xp": 1500,
    "level": 8,
    "streak": 12
}

print(f"👤 Name: {profile['name']}")
print(f"⚡ XP: {profile['xp']}")
print(f"🔥 Streak: {profile['streak']} days")
print()

# Function
def compute_readiness(skills_have, skills_need):
    overlap = set(s.lower() for s in skills_have) & set(s.lower() for s in skills_need)
    return round(len(overlap) / len(skills_need) * 100, 1)

job_requirements = ["Python", "SQL", "React", "Docker", "Kubernetes"]
readiness = compute_readiness(skills, job_requirements)
print(f"🎯 Career Readiness: {readiness}%")

# Loop with index
print()
print("📚 Learning Priority:")
for i, skill in enumerate(job_requirements, 1):
    status = "✅" if skill in skills else "📖"
    print(f"  {i}. {status} {skill}")`,
        quiz: [
          { q: 'Which symbol is used for comments in Python?', options: ['//', '/* */', '#', '--'], answer: 2 },
          { q: 'What is the output of `len([1, 2, 3])`?', options: ['2', '3', '4', 'Error'], answer: 1 },
          { q: 'What does `range(5)` produce?', options: ['[1,2,3,4,5]', '[0,1,2,3,4]', '[0,1,2,3,4,5]', '[1,2,3,4]'], answer: 1 },
          { q: 'Which is a valid Python dictionary?', options: ['(key: value)', '[key, value]', '{key: value}', '<key=value>'], answer: 2 },
        ]
      },
      {
        id: 'python-data',
        title: 'Data Structures in Python',
        duration: '14 min',
        xp: 40,
        content: `## Python Data Structures

Python's built-in data structures are powerful, flexible, and used everywhere.

### Lists — Ordered, Mutable
\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")          # add to end
fruits.remove("banana")        # remove by value
fruits.sort()                   # sort in place
last = fruits.pop()            # remove and return last
\`\`\`

### Tuples — Ordered, Immutable
\`\`\`python
point = (3, 7)           # x, y coordinates
x, y = point             # unpacking
rgb = (255, 128, 0)
\`\`\`

### Sets — Unordered, Unique
\`\`\`python
skills = {"Python", "SQL", "Python"}  # {"Python", "SQL"}
skills.add("React")
required = {"Python", "React", "Docker"}
gap = required - skills              # what I'm missing
\`\`\`

### Dictionaries — Key-Value
\`\`\`python
profile = {"name": "Alice", "xp": 5000}

# Iteration
for key, value in profile.items():
    print(f"{key}: {value}")

# Dict comprehension
squared = {n: n**2 for n in range(5)}  # {0:0, 1:1, 2:4, 3:9, 4:16}
\`\`\`

### Stacks & Queues using Deque
\`\`\`python
from collections import deque
queue = deque(["task1", "task2"])
queue.appendleft("urgent")   # add to front
next_task = queue.pop()      # remove from right
\`\`\``,
        code: `from collections import Counter, defaultdict

# Sample learning data
completed_lessons = [
    "Python Basics", "CSS", "HTML", "Python Basics",
    "React", "SQL", "React", "Docker", "React"
]

print("📊 Lesson Completion Analysis")
print("="*40)

# Count with Counter
counts = Counter(completed_lessons)
print("\\nTop lessons completed:")
for lesson, count in counts.most_common(3):
    bar = "█" * count
    print(f"  {lesson:<20} {bar} ({count}x)")

# Set operations
my_skills = {"Python", "CSS", "HTML", "React"}
job_skills = {"Python", "React", "Docker", "Kubernetes", "SQL"}

print("\\n🎯 Skill Gap Analysis:")
print(f"  You have:    {my_skills}")
print(f"  Job needs:   {job_skills}")
print(f"  ✅ Matched:   {my_skills & job_skills}")
print(f"  📖 Missing:   {job_skills - my_skills}")

# defaultdict for grouping
by_type = defaultdict(list)
resources = [("Python", "Tutorial"), ("React", "Video"), ("SQL", "Course"), ("Python", "Book")]
for skill, rtype in resources:
    by_type[skill].append(rtype)

print("\\n📚 Resources by skill:")
for skill, types in by_type.items():
    print(f"  {skill}: {', '.join(types)}")`,
        quiz: [
          { q: 'Which data structure allows duplicate values?', options: ['Set', 'Dictionary keys', 'List', 'Frozen set'], answer: 2 },
          { q: 'What does `set1 - set2` return?', options: ['Union of both sets', 'Elements in set1 but not set2', 'Elements in set2 but not set1', 'Intersection'], answer: 1 },
          { q: 'How do you add a key-value pair to a dict `d`?', options: ['d.add(k,v)', 'd.push(k,v)', 'd[k] = v', 'd.set(k,v)'], answer: 2 },
          { q: 'Tuples in Python are:', options: ['Mutable and ordered', 'Immutable and ordered', 'Mutable and unordered', 'Immutable and unordered'], answer: 1 },
        ]
      },
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science Foundations',
    icon: '📊',
    color: '#00b4d8',
    gradient: 'linear-gradient(135deg, #00b4d8, #0077b6)',
    desc: 'Statistics, analysis, and visualization fundamentals.',
    lessons: [
      {
        id: 'stats-basics',
        title: 'Statistics for Data Science',
        duration: '15 min',
        xp: 45,
        content: `## Statistics: The Foundation of Data Science

Statistics allows us to summarize, analyze, and draw conclusions from data.

### Descriptive Statistics
\`\`\`python
import statistics as stats

data = [23, 45, 67, 23, 89, 12, 45, 67, 90, 23]

print(f"Mean:   {stats.mean(data):.1f}")      # average
print(f"Median: {stats.median(data):.1f}")    # middle value
print(f"Mode:   {stats.mode(data)}")          # most frequent
print(f"StdDev: {stats.stdev(data):.2f}")     # spread
\`\`\`

### Key Concepts
- **Mean** (μ) — Average; sensitive to outliers
- **Median** — Middle value; robust to outliers
- **Standard Deviation** (σ) — How spread out data is
- **Variance** (σ²) — Standard deviation squared

### Normal Distribution
The "bell curve" — most data points near the mean:
- 68% of data within **1σ** of mean
- 95% within **2σ**
- 99.7% within **3σ**

### Correlation vs. Causation
\`\`\`python
# Correlation measures linear relationship between variables
# r = 1.0  → perfect positive
# r = 0.0  → no relationship
# r = -1.0 → perfect negative

# Ice cream sales ↑ and drowning rates ↑ are correlated
# But ice cream doesn't cause drowning — summer does!
\`\`\`

### Hypothesis Testing
\`\`\`python
# Null hypothesis (H₀): No effect / no difference
# Alternative (H₁): There IS an effect
# p-value < 0.05 → reject H₀ → result is "significant"
\`\`\``,
        code: `import statistics as stats
import random

# Simulate learning scores dataset
random.seed(42)
scores_before = [random.randint(40, 70) for _ in range(20)]
scores_after = [s + random.randint(5, 25) for s in scores_before]

print("📊 SkillMap Learning Impact Analysis")
print("="*45)

def summarize(label, data):
    print(f"\\n{label}:")
    print(f"  Mean:     {stats.mean(data):.1f}")
    print(f"  Median:   {stats.median(data):.1f}")
    print(f"  Std Dev:  {stats.stdev(data):.1f}")
    print(f"  Min/Max:  {min(data)} / {max(data)}")

summarize("Before SkillMap", scores_before)
summarize("After SkillMap", scores_after)

# Calculate improvement
improvements = [a - b for a, b in zip(scores_after, scores_before)]
avg_improvement = stats.mean(improvements)

print(f"\\n🚀 Average Improvement: +{avg_improvement:.1f} points")
print(f"✅ Students improved: {sum(1 for i in improvements if i > 0)}/{len(improvements)}")

# Simple histogram (ASCII)
print("\\n📈 Score Distribution (After):")
bins = {"40-54":0, "55-69":0, "70-84":0, "85-100":0}
for s in scores_after:
    if s < 55: bins["40-54"] += 1
    elif s < 70: bins["55-69"] += 1
    elif s < 85: bins["70-84"] += 1
    else: bins["85-100"] += 1

for label, count in bins.items():
    bar = "█" * count
    print(f"  {label}: {bar} {count}")`,
        quiz: [
          { q: 'Which measure is most resistant to outliers?', options: ['Mean', 'Mode', 'Median', 'Variance'], answer: 2 },
          { q: 'A p-value of 0.03 means:', options: ['The result is not significant', 'The result is significant at 5% level', 'The null hypothesis is true', 'There is 3% chance of being correct'], answer: 1 },
          { q: 'Correlation of 0.95 between two variables means:', options: ['Strong causation', 'Weak relationship', 'Strong positive relationship', 'Strong negative relationship'], answer: 2 },
          { q: 'Standard deviation measures:', options: ['The average value', 'The middle value', 'The spread of data', 'The most common value'], answer: 2 },
        ]
      },
    ]
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: '🏗️',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    desc: 'Design scalable, reliable distributed systems.',
    lessons: [
      {
        id: 'system-design-intro',
        title: 'System Design Fundamentals',
        duration: '20 min',
        xp: 60,
        content: `## What is System Design?

System design is the process of defining the **architecture, components, modules, and data flow** of a system to satisfy specified requirements.

### Key Pillars of System Design
1. **Scalability** — Handle growing load (horizontal vs vertical scaling)
2. **Availability** — Minimize downtime (99.9% = 8.7h downtime/year)
3. **Reliability** — Correct behavior even under failure
4. **Performance** — Low latency, high throughput
5. **Maintainability** — Easy to update, debug, extend

### Load Balancing
\`\`\`
Client → Load Balancer → [Server 1, Server 2, Server 3]
\`\`\`
Distributes requests across multiple servers. Algorithms:
- **Round Robin** — Distribute evenly in order
- **Least Connections** — Send to least busy server
- **Consistent Hashing** — Same user → same server (sticky sessions)

### Caching (Redis, Memcached)
\`\`\`
Client → Cache HIT  → return cached result (fast!)
Client → Cache MISS → DB query → store in cache → return
\`\`\`
Cache invalidation strategies: TTL, write-through, write-back.

### Databases
| Type | Examples | Use Case |
|------|---------|----------|
| **SQL** | PostgreSQL, MySQL | Structured data, ACID |
| **NoSQL** | MongoDB, DynamoDB | Flexible schema, scale |
| **Cache** | Redis | Fast key-value |
| **Search** | Elasticsearch | Full-text search |

### CAP Theorem
A distributed system can guarantee only **2 of 3**:
- **C**onsistency — All nodes see same data
- **A**vailability — Always respond
- **P**artition Tolerance — Work despite network failure

> Real systems must choose: CP (banks) or AP (social media).

### Microservices vs Monolith
- **Monolith** — Single deployable unit; simple but hard to scale
- **Microservices** — Independent services; complex but scalable`,
        code: `// System Design: Simple Rate Limiter Simulation

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.clients = new Map();
  }
  
  isAllowed(clientId) {
    const now = Date.now();
    
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, { count: 1, startTime: now });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }
    
    const client = this.clients.get(clientId);
    
    // Reset window if expired
    if (now - client.startTime > this.windowMs) {
      client.count = 1;
      client.startTime = now;
      return { allowed: true, remaining: this.maxRequests - 1 };
    }
    
    if (client.count >= this.maxRequests) {
      const resetIn = Math.ceil((this.windowMs - (now - client.startTime)) / 1000);
      return { allowed: false, remaining: 0, resetIn };
    }
    
    client.count++;
    return { allowed: true, remaining: this.maxRequests - client.count };
  }
}

// Demo
const limiter = new RateLimiter(5, 10000); // 5 req per 10 seconds
const userId = "user_123";

console.log("🚦 Rate Limiter Simulation");
console.log("Max: 5 requests per 10 seconds");
console.log("================================");

for (let i = 1; i <= 7; i++) {
  const result = limiter.isAllowed(userId);
  const status = result.allowed ? "✅ ALLOWED" : "❌ BLOCKED";
  const info = result.allowed 
    ? \`Remaining: \${result.remaining}\`
    : \`Try again in \${result.resetIn}s\`;
  console.log(\`Request \${i}: \${status} — \${info}\`);
}`,
        quiz: [
          { q: 'What is horizontal scaling?', options: ['Making one server more powerful', 'Adding more servers to handle load', 'Increasing RAM of existing server', 'Optimizing database queries'], answer: 1 },
          { q: 'In the CAP theorem, a banking system usually prioritizes:', options: ['Availability + Partition Tolerance', 'Consistency + Partition Tolerance', 'Consistency + Availability', 'None of the above'], answer: 1 },
          { q: 'What is a cache hit?', options: ['Cache runs out of memory', 'Requested data found in cache', 'Data not found in cache', 'Cache is cleared'], answer: 1 },
          { q: 'Which is NOT a benefit of microservices?', options: ['Independent deployment', 'Technology flexibility', 'Simpler local development', 'Fault isolation'], answer: 2 },
        ]
      },
    ]
  },
  {
    id: 'dsa',
    title: 'DSA & Problem Solving',
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    desc: 'Data structures and algorithms for technical interviews.',
    lessons: [
      {
        id: 'arrays-basics',
        title: 'Arrays & Complexity',
        duration: '18 min',
        xp: 50,
        content: `## Arrays and Time Complexity

Arrays are the most fundamental data structure — an **ordered collection of elements** stored contiguously in memory.

### Big-O Notation (Complexity)

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | **O(1)** | O(n) |
| Search | O(n) | O(n) |
| Insert at end | O(1) amortized | O(1) |
| Insert at start | **O(n)** | O(1) |
| Delete | O(n) | O(1) |

**O(1) < O(log n) < O(n) < O(n log n) < O(n²)**

### Common Array Patterns

**Two Pointers:**
\`\`\`js
// Find pair that sums to target
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}
\`\`\`

**Sliding Window:**
\`\`\`js
// Max sum subarray of size k
function maxSumWindow(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

**Prefix Sum:**
\`\`\`js
function buildPrefixSum(arr) {
  const prefix = [0];
  for (const n of arr) prefix.push(prefix[prefix.length-1] + n);
  return prefix;
}
// Range sum [i..j] = prefix[j+1] - prefix[i]
\`\`\``,
        code: `// 🚀 DSA Demo: Common Array Patterns

// ---- Two Pointers: Reverse Array ----
function reverseArray(arr) {
  const result = [...arr];
  let left = 0, right = result.length - 1;
  while (left < right) {
    [result[left], result[right]] = [result[right], result[left]];
    left++; right--;
  }
  return result;
}

// ---- Sliding Window: Max Subarray Sum ----
function maxWindowSum(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    max = Math.max(max, sum);
  }
  return max;
}

// ---- Prefix Sum ----
function rangeSum(arr, i, j) {
  const prefix = [0];
  for (const n of arr) prefix.push(prefix[prefix.length-1] + n);
  return prefix[j+1] - prefix[i];
}

// DEMO
const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
console.log("Original:    ", nums.join(', '));
console.log("Reversed:    ", reverseArray(nums).join(', '));
console.log();
console.log("Max window-3 sum:", maxWindowSum(nums, 3));
console.log("Range sum [2..6]:", rangeSum(nums, 2, 6));
console.log();

// Complexity Demo
const sizes = [100, 1000, 10000, 100000];
console.log("⏱️ Time Complexity Demo:");
console.log("n".padEnd(10), "O(n)".padEnd(10), "O(n²)");
for (const n of sizes) {
  console.log(
    String(n).padEnd(10),
    String(n).padEnd(10),
    String(n * n)
  );
}`,
        quiz: [
          { q: 'What is the time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
          { q: 'The Two Pointer technique is useful for:', options: ['Tree traversal', 'Sorted array problems', 'Hash table operations', 'Stack problems'], answer: 1 },
          { q: 'What does O(n²) mean?', options: ['Constant time', 'Linear time', 'Quadratic time', 'Logarithmic time'], answer: 2 },
          { q: 'Prefix sum is best used for:', options: ['Sorting arrays', 'Fast range sum queries', 'Reversing arrays', 'Binary search'], answer: 1 },
        ]
      },
    ]
  },
];

// ── Helper Functions ──────────────────────────────────────────
export const getAllLessons = () =>
  LESSON_TRACKS.flatMap(track =>
    track.lessons.map(lesson => ({ ...lesson, trackId: track.id, trackTitle: track.title, trackIcon: track.icon }))
  );

export const getLesson = (trackId, lessonId) => {
  const track = LESSON_TRACKS.find(t => t.id === trackId);
  if (!track) return null;
  return track.lessons.find(l => l.id === lessonId) || null;
};

export const getTrack = (trackId) =>
  LESSON_TRACKS.find(t => t.id === trackId) || null;
