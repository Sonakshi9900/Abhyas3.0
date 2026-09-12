const fs = require('fs');

const logPath = 'C:\\Users\\sonak\\.gemini\\antigravity-ide\\brain\\36908326-6e95-4d8c-9a1e-b47b286340d8\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\sonak\\OneDrive\\Desktop\\AbhyasTRE\\data\\subjMathsPractise.csv';

const rawLog = fs.readFileSync(logPath, 'utf-8');

// Find all lines that start with "Maths" or "Subject"
const csvLineRegex = /"Maths"\s*,\s*"[^"]+"\s*,\s*"[^"]+"[\s\S]*?(?="\r?\n"Maths"|\r?\n"Subject"|\\n"Maths"|\\n"Subject"|"\r?\n|\$)/g;

// Let's search for "Work and Time"
const workIdx = rawLog.indexOf('"Work and Time"');
console.log('Work and Time index:', workIdx);

if (workIdx !== -1) {
  // Extract chunk around workIdx
  const snippet = rawLog.substring(workIdx - 200, workIdx + 15000);
  console.log('Snippet length:', snippet.length);
  
  // Clean up escaped content
  let cleaned = snippet
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
  
  const lines = cleaned.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('"Maths"') || l.startsWith('"Subject"'));
  
  console.log('Found valid CSV lines:', lines.length);
  if (lines.length > 0) {
    const header = '"Subject","Topic","Q_No","Question_EN","Question_HI","Opt1_EN","Opt1_HI","Opt2_EN","Opt2_HI","Opt3_EN","Opt3_HI","Opt4_EN","Opt4_HI","Opt5_EN","Opt5_HI","Correct_Option","Sol_EN","Sol_HI"';
    const content = [header, ...lines.filter(l => !l.startsWith('"Subject"'))].join('\n');
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`Saved ${lines.length} lines to ${targetPath}`);
  }
}
