const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\sonak';
const foundFiles = [];

function search(dir, depth = 0) {
  if (depth > 4) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'AppData') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        search(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        const name = entry.name.toLowerCase();
        if (name.includes('deled') || name.includes('s1') || name.includes('s2') || name.includes('s4') || name.includes('s5') || name.includes('s6') || name.includes('s7') || name.includes('s8') || name.includes('pedagogy') || name.includes('cognition') || name.includes('health') || name.includes('mathematics') || name.includes('english') || name.includes('hindi') || name.includes('s_') || name.includes('s-')) {
          const stat = fs.statSync(fullPath);
          foundFiles.push({ name: entry.name, path: fullPath, size: stat.size });
        }
      }
    }
  } catch(e) {}
}

console.log('Searching for D.El.Ed PDF files under C:\\Users\\sonak...');
search(rootDir);

console.log(`Found ${foundFiles.length} matching PDF files:\n`);
foundFiles.forEach((f, i) => {
  console.log(`${i+1}. [${(f.size/1024).toFixed(1)} KB] ${f.name}`);
  console.log(`   Path: ${f.path}`);
});
