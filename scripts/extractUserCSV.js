const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\sonak\\.gemini\\antigravity-ide\\brain\\36908326-6e95-4d8c-9a1e-b47b286340d8\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\sonak\\OneDrive\\Desktop\\AbhyasTRE\\data\\subjMathsPractise.csv';

const rawLog = fs.readFileSync(logPath, 'utf-8');
const lines = rawLog.split('\n');

let extractedCSV = [];

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('subjMathsPractise.csv') || lines[i].includes('subjPractise.csv')) {
    try {
      const parsed = JSON.parse(lines[i]);
      const str = JSON.stringify(parsed);
      const idx = str.indexOf('"Subject","Topic"');
      if (idx !== -1) {
        // Found the CSV start!
        const sub = str.substring(idx);
        const csvLines = sub.split('\\n');
        for (let cl of csvLines) {
          cl = cl.replace(/\\"/g, '"').replace(/\\r/g, '').trim();
          if (cl.startsWith('+')) cl = cl.substring(1).trim();
          if (cl.startsWith('"Maths"') || cl.startsWith('"Subject"')) {
            // Remove trailing quote escapes if any
            if (cl.endsWith('"}')) cl = cl.substring(0, cl.length - 2);
            if (cl.endsWith('"}]')) cl = cl.substring(0, cl.length - 3);
            extractedCSV.push(cl);
          }
        }
        if (extractedCSV.length > 10) break;
      }
    } catch(e) {}
  }
}

if (extractedCSV.length > 0) {
  // Deduplicate and filter
  const uniqueLines = Array.from(new Set(extractedCSV));
  fs.writeFileSync(targetPath, uniqueLines.join('\n'), 'utf-8');
  console.log(`Extracted ${uniqueLines.length} lines into ${targetPath}`);
} else {
  console.log('No CSV content found in logs.');
}
