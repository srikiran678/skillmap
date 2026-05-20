import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/jobSkillsDB.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const newRoles = `
  // ── SPACE TECH ──
  {
    jobTitle: "Aerospace Software Engineer",
    domain: "Space Tech",
    icon: "🚀",
    description: "Develop flight software, simulation, and mission control systems for spacecraft.",
    avgSalary: "$120,000 – $180,000",
    skillsRequired: [
      { skill: "C++", levelNeeded: "Advanced" },
      { skill: "Python", levelNeeded: "Intermediate" },
      { skill: "Embedded Systems", levelNeeded: "Advanced" },
      { skill: "Real-Time OS (RTOS)", levelNeeded: "Intermediate" },
      { skill: "Simulink", levelNeeded: "Beginner" },
      { skill: "Control Systems", levelNeeded: "Intermediate" },
      { skill: "Astrodynamics", levelNeeded: "Beginner" }
    ],
    academicRelevance: ["Aerospace Engineering", "Computer Science", "Physics"],
    relatedJobs: ["Avionics Engineer", "Simulation Engineer"]
  },
  
  // ── NEURAL ENGINEERING ──
  {
    jobTitle: "Brain-Computer Interface (BCI) Developer",
    domain: "Neural Engineering",
    icon: "🧠",
    description: "Build software to translate neural signals into digital commands.",
    avgSalary: "$130,000 – $200,000",
    skillsRequired: [
      { skill: "Python", levelNeeded: "Advanced" },
      { skill: "Signal Processing", levelNeeded: "Advanced" },
      { skill: "Machine Learning", levelNeeded: "Intermediate" },
      { skill: "C++", levelNeeded: "Intermediate" },
      { skill: "Neuroscience Basics", levelNeeded: "Intermediate" },
      { skill: "Deep Learning", levelNeeded: "Beginner" },
      { skill: "Data Visualization", levelNeeded: "Intermediate" }
    ],
    academicRelevance: ["Bioengineering", "Neuroscience", "Computer Science"],
    relatedJobs: ["Neural Engineer", "Bio-signal Analyst"]
  },
  
  // ── QUANTUM COMPUTING ──
  {
    jobTitle: "Quantum Algorithm Researcher",
    domain: "Quantum Computing",
    icon: "⚛️",
    description: "Design and implement algorithms for quantum computers.",
    avgSalary: "$140,000 – $220,000",
    skillsRequired: [
      { skill: "Quantum Mechanics", levelNeeded: "Advanced" },
      { skill: "Linear Algebra", levelNeeded: "Advanced" },
      { skill: "Qiskit", levelNeeded: "Intermediate" },
      { skill: "Python", levelNeeded: "Advanced" },
      { skill: "Cryptography", levelNeeded: "Intermediate" },
      { skill: "C++", levelNeeded: "Beginner" }
    ],
    academicRelevance: ["Physics", "Mathematics", "Computer Science"],
    relatedJobs: ["Quantum Software Engineer", "Quantum Cryptographer"]
  }
];`;

if (!dbContent.includes("Aerospace Software Engineer")) {
  const parts = dbContent.split("];\r\n\r\nexport const DOMAINS");
  if(parts.length === 2) {
    dbContent = parts[0] + ",\n" + newRoles.replace("];", "") + "];\r\n\r\nexport const DOMAINS" + parts[1];
    fs.writeFileSync(dbPath, dbContent, 'utf8');
    console.log("Database expanded successfully.");
  } else {
      const parts2 = dbContent.split("];\n\nexport const DOMAINS");
      if(parts2.length === 2) {
          dbContent = parts2[0] + ",\n" + newRoles.replace("];", "") + "];\n\nexport const DOMAINS" + parts2[1];
          fs.writeFileSync(dbPath, dbContent, 'utf8');
          console.log("Database expanded successfully.");
      } else {
        console.log("Could not find array end.");
      }
  }
} else {
  console.log("Database already expanded.");
}
