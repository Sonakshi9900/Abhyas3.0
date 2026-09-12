const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));
const Question = require(path.join(rootDir, 'server', 'models', 'Question'));

/**
 * Standard CSV line parser supporting double-quoted multi-line or escaped fields
 */
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

function parseCorrectIndex(val) {
  if (!val) return 0;
  const str = String(val).toUpperCase().trim();
  if (str === 'A' || str === '1') return 0;
  if (str === 'B' || str === '2') return 1;
  if (str === 'C' || str === '3') return 2;
  if (str === 'D' || str === '4') return 3;
  if (str === 'E' || str === '5') return 4;
  const num = parseInt(str);
  return isNaN(num) ? 0 : Math.max(0, Math.min(4, num - 1));
}

async function runImport() {
  let csvPath = path.join(rootDir, 'data', 'subjMathsPractise.csv');
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(rootDir, 'data', 'subjPractise.csv');
  }

  if (!fs.existsSync(csvPath)) {
    console.error('No CSV file found in data directory.');
    process.exit(1);
  }

  console.log(`Reading CSV from: ${csvPath}`);
  const rawText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(rawText);

  if (rows.length < 2) {
    console.error('CSV has no data rows.');
    process.exit(1);
  }

  const headers = rows[0].map(h => h.toLowerCase().replace(/['"]/g, ''));
  console.log('Headers:', headers);

  const getCol = (row, ...names) => {
    for (const name of names) {
      const idx = headers.indexOf(name.toLowerCase());
      if (idx !== -1 && row[idx] !== undefined) return row[idx];
    }
    return '';
  };

  const parsedQuestions = [];
  let numIdCounter = Date.now();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 5) continue;

    let subject = getCol(row, 'subject') || 'Mathematics';
    if (subject.toLowerCase() === 'maths') subject = 'Mathematics';

    const topic = getCol(row, 'topic') || 'General';
    const qNo = getCol(row, 'q_no', 'qno') || `M-${i}`;

    const enQ = getCol(row, 'question_en', 'en_q') || '';
    const hiQ = getCol(row, 'question_hi', 'hi_q') || enQ;

    const opt1En = getCol(row, 'opt1_en', 'opta_en') || 'Option A';
    const opt1Hi = getCol(row, 'opt1_hi', 'opta_hi') || opt1En;
    const opt2En = getCol(row, 'opt2_en', 'optb_en') || 'Option B';
    const opt2Hi = getCol(row, 'opt2_hi', 'optb_hi') || opt2En;
    const opt3En = getCol(row, 'opt3_en', 'optc_en') || 'Option C';
    const opt3Hi = getCol(row, 'opt3_hi', 'optc_hi') || opt3En;
    const opt4En = getCol(row, 'opt4_en', 'optd_en') || 'Option D';
    const opt4Hi = getCol(row, 'opt4_hi', 'optd_hi') || opt4En;
    const opt5En = getCol(row, 'opt5_en', 'opte_en') || 'None of the above / More than one of the above';
    const opt5Hi = getCol(row, 'opt5_hi', 'opte_hi') || 'उपर्युक्त में से कोई नहीं / उपर्युक्त में से एक से अधिक';

    const correctRaw = getCol(row, 'correct_option', 'correct', 'answer') || '1';
    const correctIdx = parseCorrectIndex(correctRaw);

    const solEn = getCol(row, 'sol_en', 'explanation_en') || '';
    const solHi = getCol(row, 'sol_hi', 'explanation_hi') || solEn;

    parsedQuestions.push({
      qNo: `MTH-${i}`,
      numId: numIdCounter++,
      levels: ['prt', 'tgt', 'pgt'],
      paper: 'gs',
      subject: 'Mathematics',
      topic: topic,
      year: 2024,
      examName: 'BPSC TRE Practice',
      en: {
        q: enQ,
        opts: [opt1En, opt2En, opt3En, opt4En, opt5En],
        sol: solEn
      },
      hi: {
        q: hiQ,
        opts: [opt1Hi, opt2Hi, opt3Hi, opt4Hi, opt5Hi],
        sol: solHi
      },
      correct: correctIdx,
      originalCorrectChar: String(correctRaw)
    });
  }

  console.log(`Successfully parsed ${parsedQuestions.length} Mathematics questions.`);

  // Update questions_cache.json
  const cachePath = path.join(rootDir, 'server', 'data', 'questions_cache.json');
  let existingCache = [];
  if (fs.existsSync(cachePath)) {
    try {
      existingCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch(e) {}
  }

  // Remove old Maths questions if re-importing, or keep existing non-Maths questions
  const nonMathsCache = existingCache.filter(q => q.subject !== 'Mathematics' && q.subject !== 'Maths');
  const finalCache = [...nonMathsCache, ...parsedQuestions];

  fs.writeFileSync(cachePath, JSON.stringify(finalCache, null, 2), 'utf-8');
  console.log(`Updated server/data/questions_cache.json. Total questions in cache: ${finalCache.length}`);

  // Seed into MongoDB
  try {
    await mongoose.connect('mongodb://localhost:27017/abhyastre');
    await Question.deleteMany({ subject: { $in: ['Mathematics', 'Maths'] } });
    await Question.insertMany(parsedQuestions);
    console.log(`Successfully seeded ${parsedQuestions.length} Mathematics questions into MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn('MongoDB sync skipped:', err.message);
  }
}

runImport().catch(console.error);
