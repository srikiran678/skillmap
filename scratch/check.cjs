const fs = require('fs');
const content = fs.readFileSync('./src/data/jobSkillsDB.js', 'utf8');

const titles = [];
const lines = content.split('\n');
for (const line of lines) {
  if (line.includes('jobTitle:')) {
    const match = line.match(/jobTitle:\s*["']([^"']+)["']/);
    if (match) titles.push(match[1]);
  }
}

const dups = titles.filter((item, index) => titles.indexOf(item) !== index);
console.log('DUPLICATES:', dups);
