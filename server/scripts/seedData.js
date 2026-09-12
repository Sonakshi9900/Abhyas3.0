const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');
const Paper = require('../models/Paper');
const connectDB = require('../config/db');

const determineSubject = (qNoStr, num) => {
  if (qNoStr.startsWith('E-')) return { paper: 'language', subject: 'English' };
  if (qNoStr.startsWith('H-')) return { paper: 'language', subject: 'Hindi' };
  if (num >= 31 && num <= 46) return { paper: 'gs', subject: 'Mathematics' };
  if (num >= 47 && num <= 62) return { paper: 'gs', subject: 'General Science' };
  if (num >= 63 && num <= 78) return { paper: 'gs', subject: 'Current Affairs' };
  if (num >= 79 && num <= 90) return { paper: 'gs', subject: 'Geography' };
  if (num >= 91 && num <= 104) return { paper: 'gs', subject: 'Indian National Movement' };
  if (num >= 105 && num <= 118) return { paper: 'gs', subject: 'Polity' };
  if (num >= 119 && num <= 134) return { paper: 'gs', subject: 'Environment' };
  if (num >= 135 && num <= 150) return { paper: 'gs', subject: 'Reasoning' };
  return { paper: 'gs', subject: 'General Studies' };
};

const seed = async () => {
  console.log('[Seed] Starting CSV Parsing & Database Seeding...');
  const csvFilePath = path.join(__dirname, '../../data/bpsc_tre4_2024_prt.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`[Seed Error] CSV file not found at: ${csvFilePath}`);
    process.exit(1);
  }

  const questionsData = [];
  let counter = 1;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const qNo = row['Q_No'] || `Q-${counter}`;
        const numId = parseInt(qNo.replace(/\D/g, '')) || counter;
        const { paper, subject } = determineSubject(qNo, numId);

        const correctOptNum = parseInt(row['Correct_Option']) || 1;
        const correctIndex = correctOptNum - 1; // 0-based

        const qObj = {
          qNo: qNo,
          numId: numId,
          levels: ['prt', 'tgt68', 'tgt910', 'pgt1112'],
          paper: paper,
          subject: subject,
          year: 2024,
          examName: 'BPSC TRE 4.0 (Class 1-5 PRT)',
          en: {
            q: row['Question_EN'],
            opts: [
              row['Opt1_EN'],
              row['Opt2_EN'],
              row['Opt3_EN'],
              row['Opt4_EN'],
              row['Opt5_EN']
            ],
            sol: row['Sol_EN'] || ''
          },
          hi: {
            q: row['Question_HI'],
            opts: [
              row['Opt1_HI'],
              row['Opt2_HI'],
              row['Opt3_HI'],
              row['Opt4_HI'],
              row['Opt5_HI']
            ],
            sol: row['Sol_HI'] || ''
          },
          correct: correctIndex,
          originalCorrectChar: String(correctOptNum)
        };

        questionsData.push(qObj);
        counter++;
      })
      .on('end', async () => {
        console.log(`[Seed] Successfully parsed ${questionsData.length} questions from CSV.`);

        // 1. Save locally as cached JSON file for instant API fallback
        const outputDir = path.join(__dirname, '../data');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(path.join(outputDir, 'questions_cache.json'), JSON.stringify(questionsData, null, 2), 'utf-8');
        console.log(`[Seed] Saved JSON cache to server/data/questions_cache.json`);

        // 2. Insert into MongoDB if connected
        try {
          const conn = await connectDB();
          if (conn) {
            await Question.deleteMany({});
            await Paper.deleteMany({});

            await Question.insertMany(questionsData);
            console.log(`[Seed] Inserted ${questionsData.length} questions into MongoDB.`);

            // Create Paper entry
            await Paper.create({
              titleEn: 'BPSC TRE 4.0 — Class 1–5 (2024 Previous Year Paper)',
              titleHi: 'BPSC TRE 4.0 — कक्षा 1–5 (2024 पिछला वर्ष का पेपर)',
              level: 'prt',
              year: 2024,
              totalQuestions: questionsData.length,
              totalMarks: questionsData.length,
              durationMins: 150,
              negativeMarking: 0.3333,
              paperType: 'full_mock'
            });
            console.log(`[Seed] Created Paper record in MongoDB.`);
            await mongoose.connection.close();
          }
        } catch (dbErr) {
          console.warn(`[Seed Warning] Could not populate MongoDB directly: ${dbErr.message}. JSON cache will be used.`);
        }

        console.log('[Seed] Seeding completed successfully!');
        resolve();
      })
      .on('error', (err) => {
        console.error('[Seed Error] Failed parsing CSV:', err);
        reject(err);
      });
  });
};

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seed;
