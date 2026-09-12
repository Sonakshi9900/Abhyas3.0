const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'data', 'subjMathsPractise.csv');
console.log('Reading:', csvPath);

if (!fs.existsSync(csvPath)) {
  console.error('File not found!');
  process.exit(1);
}

const text = fs.readFileSync(csvPath, 'utf-8');
console.log('File length bytes:', text.length);

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let insideQuote = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }
  return rows;
}

const rows = parseCSV(text);
console.log('Total rows parsed:', rows.length);

if (rows.length > 0) {
  console.log('Header:', rows[0]);
  const topics = new Set();
  rows.slice(1).forEach((r, idx) => {
    if (r.length > 1) {
      topics.add(r[1]); // Topic column
    }
  });
  console.log('Unique Topics Count:', topics.size);
  console.log('Topics List:', Array.from(topics));
}
