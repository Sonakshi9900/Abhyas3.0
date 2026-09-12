const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));
const Question = require(path.join(rootDir, 'server', 'models', 'Question'));

/**
 * Helper to parse a standard CSV line handling quoted strings
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Converts Option Char (A/B/C/D/E or 1/2/3/4/5) to 0-indexed integer (0..4)
 */
function parseCorrectIndex(val) {
  if (!val) return 0;
  const str = String(val).toUpperCase().trim();
  if (str === 'A' || str === '1') return 0;
  if (str === 'B' || str === '2') return 1;
  if (str === 'C' || str === '3') return 2;
  if (str === 'D' || str === '4') return 3;
  if (str === 'E' || str === '5') return 4;
  const num = parseInt(str);
  return isNaN(num) ? 0 : Math.max(0, Math.min(4, num));
}

async function importCSV(csvFilePath) {
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV File Not Found:', csvFilePath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    console.error('CSV file must have a header line and at least 1 data row.');
    process.exit(1);
  }

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  console.log('CSV Headers:', headers);

  const getCol = (row, colName) => {
    const idx = headers.indexOf(colName.toLowerCase());
    return idx !== -1 ? row[idx] : '';
  };

  const newQuestions = [];
  let numIdCounter = Date.now();

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 3) continue;

    const levelStr = getCol(row, 'level') || 'prt';
    const levelsArr = levelStr.split(/[,;|]/).map(l => l.trim().toLowerCase());
    const paper = getCol(row, 'paper') || 'gs';
    const subject = getCol(row, 'subject') || 'Mathematics';
    const topic = getCol(row, 'topic') || 'General';
    const year = parseInt(getCol(row, 'year')) || 2024;
    const qNo = getCol(row, 'qNo') || `Q${i}`;

    const enQ = getCol(row, 'en_q') || getCol(row, 'question_en') || getCol(row, 'q_en') || '';
    const hiQ = getCol(row, 'hi_q') || getCol(row, 'question_hi') || getCol(row, 'q_hi') || enQ;

    const enOptA = getCol(row, 'en_opta') || getCol(row, 'opta_en') || 'Option A';
    const enOptB = getCol(row, 'en_optb') || getCol(row, 'optb_en') || 'Option B';
    const enOptC = getCol(row, 'en_optc') || getCol(row, 'optc_en') || 'Option C';
    const enOptD = getCol(row, 'en_optd') || getCol(row, 'optd_en') || 'Option D';
    const enOptE = getCol(row, 'en_opte') || getCol(row, 'opte_en') || 'More than one of the above / None of the above';

    const hiOptA = getCol(row, 'hi_opta') || getCol(row, 'opta_hi') || enOptA;
    const hiOptB = getCol(row, 'hi_optb') || getCol(row, 'optb_hi') || enOptB;
    const hiOptC = getCol(row, 'hi_optc') || getCol(row, 'optc_hi') || enOptC;
    const hiOptD = getCol(row, 'hi_optd') || getCol(row, 'optd_hi') || enOptD;
    const hiOptE = getCol(row, 'hi_opte') || getCol(row, 'opte_hi') || 'उपर्युक्त में से एक से अधिक / उपर्युक्त में से कोई नहीं';

    const correctRaw = getCol(row, 'correct') || getCol(row, 'answer') || 'A';
    const correctIdx = parseCorrectIndex(correctRaw);

    const solEn = getCol(row, 'sol_en') || getCol(row, 'explanation_en') || '';
    const solHi = getCol(row, 'sol_hi') || getCol(row, 'explanation_hi') || solEn;

    newQuestions.push({
      qNo,
      numId: numIdCounter++,
      levels: levelsArr,
      paper,
      subject,
      topic,
      year,
      examName: 'BPSC TRE Exam',
      en: {
        q: enQ,
        opts: [enOptA, enOptB, enOptC, enOptD, enOptE],
        sol: solEn
      },
      hi: {
        q: hiQ,
        opts: [hiOptA, hiOptB, hiOptC, hiOptD, hiOptE],
        sol: solHi
      },
      correct: correctIdx,
      originalCorrectChar: String(correctRaw)
    });
  }

  console.log(`Parsed ${newQuestions.length} questions from CSV.`);

  // Update questions_cache.json
  const cachePath = path.join(rootDir, 'server', 'data', 'questions_cache.json');
  let existingCache = [];
  if (fs.existsSync(cachePath)) {
    try { existingCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8')); } catch (e) {}
  }
  const mergedCache = [...existingCache, ...newQuestions];
  fs.writeFileSync(cachePath, JSON.stringify(mergedCache, null, 2), 'utf-8');
  console.log(`Updated server/data/questions_cache.json (Total Questions: ${mergedCache.length})`);

  // Insert into MongoDB if connected
  try {
    await mongoose.connect('mongodb://localhost:27017/abhyastre');
    await Question.insertMany(newQuestions);
    console.log(`Successfully seeded ${newQuestions.length} questions into MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn('MongoDB connection/seed skipped:', err.message);
  }
}

// Support command line argument: node scripts/importQuestionsFromCSV.js <path-to-csv>
const targetCSV = process.argv[2];
if (targetCSV) {
  importCSV(targetCSV).then(() => console.log('CSV Import Finished.')).catch(console.error);
} else {
  console.log('Usage: node scripts/importQuestionsFromCSV.js <path-to-your-csv-file>');
}

module.exports = { importCSV };
