const fs = require('fs');

const logPath = 'C:\\Users\\sonak\\.gemini\\antigravity-ide\\brain\\36908326-6e95-4d8c-9a1e-b47b286340d8\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\sonak\\OneDrive\\Desktop\\AbhyasTRE\\data\\subjMathsPractise.csv';

const rawLog = fs.readFileSync(logPath, 'utf-8');
const lines = rawLog.split('\n');

// Find the last line in transcript_full.jsonl which is the latest USER_INPUT
const lastLine = lines[lines.length - 1] || lines[lines.length - 2];
console.log('Last line length:', lastLine ? lastLine.length : 0);

// Search for diff_block_start in log
let csvContent = [];
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('diff_block_start')) {
    const text = lines[i];
    const splitted = text.split('\\n');
    for (let s of splitted) {
      let cleaned = s.replace(/\\"/g, '"').replace(/\\r/g, '').trim();
      if (cleaned.startsWith('+')) cleaned = cleaned.substring(1).trim();
      if (cleaned.startsWith('"Subject"') || cleaned.startsWith('"Maths"')) {
        csvContent.push(cleaned);
      }
    }
    if (csvContent.length > 5) break;
  }
}

console.log('Extracted lines:', csvContent.length);

if (csvContent.length > 0) {
  // Deduplicate
  const unique = Array.from(new Set(csvContent));
  fs.writeFileSync(targetPath, unique.join('\n'), 'utf-8');
  console.log(`Saved ${unique.length} CSV lines to ${targetPath}`);
}
