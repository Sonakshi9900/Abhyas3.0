const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\sonak\\.gemini\\antigravity-ide\\brain\\36908326-6e95-4d8c-9a1e-b47b286340d8\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\sonak\\OneDrive\\Desktop\\AbhyasTRE\\data\\subjMathsPractise.csv';

if (!fs.existsSync(logPath)) {
  console.error('Log file not found!');
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf-8');
const lines = content.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  const line = lines[i];
  if (line.includes('[diff_block_start]')) {
    try {
      const obj = JSON.parse(line);
      const text = JSON.stringify(obj);
      const diffStart = text.indexOf('[diff_block_start]');
      const diffEnd = text.indexOf('[diff_block_end]');
      if (diffStart !== -1 && diffEnd !== -1) {
        let snippet = text.substring(diffStart + 18, diffEnd);
        // Clean up escaped newlines and diff prefixes (+ or -)
        snippet = snippet.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\"/g, '"');
        const csvLines = snippet.split('\n')
          .map(l => l.startsWith('+') ? l.substring(1) : (l.startsWith('-') ? '' : l))
          .filter(l => l.trim().length > 0 && l.includes('Maths'));
        
        if (csvLines.length > 0) {
          const header = '"Subject","Topic","Q_No","Question_EN","Question_HI","Opt1_EN","Opt1_HI","Opt2_EN","Opt2_HI","Opt3_EN","Opt3_HI","Opt4_EN","Opt4_HI","Opt5_EN","Opt5_HI","Correct_Option","Sol_EN","Sol_HI"';
          const fullCSV = [header, ...csvLines].join('\n');
          fs.writeFileSync(targetPath, fullCSV, 'utf-8');
          console.log(`Successfully restored ${csvLines.length} rows to ${targetPath}`);
          break;
        }
      }
    } catch (e) {
      console.error('Error parsing line:', e);
    }
  }
}
