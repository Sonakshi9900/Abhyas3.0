const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');
const connectDB = require('../config/db');

const seedReasoning = async () => {
  console.log('[Seed Reasoning] Starting CSV Parsing...');
  const csvFilePath = path.join(__dirname, '../../data/subjReasoningPractise.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`[Seed Error] CSV file not found at: ${csvFilePath}`);
    process.exit(1);
  }

  const reasoningQuestions = [];
  let index = 1;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const correctOptNum = parseInt(row['Correct_Option']) || 1;
        const correctIndex = Math.max(0, correctOptNum - 1);

        const qObj = {
          qNo: row['Q_No'] || `RSN16-${index}`,
          numId: 500 + index,
          levels: ['prt', 'tgt68', 'tgt910', 'pgt1112'],
          paper: 'gs',
          subject: 'Reasoning',
          topic: (row['Topic'] || 'General').trim(),
          year: 2024,
          examName: 'BPSC TRE Practice',
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

        reasoningQuestions.push(qObj);
        index++;
      })
      .on('end', async () => {
        console.log(`[Seed Reasoning] Parsed ${reasoningQuestions.length} reasoning questions from CSV.`);

        // 1. Update questions_cache.json
        const cachePath = path.join(__dirname, '../data/questions_cache.json');
        let existingQuestions = [];
        if (fs.existsSync(cachePath)) {
          try {
            existingQuestions = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
          } catch (e) {
            existingQuestions = [];
          }
        }

        // Filter out old Reasoning questions and append new ones
        const filtered = existingQuestions.filter(q => q.subject !== 'Reasoning');
        const updatedCache = [...filtered, ...reasoningQuestions];
        fs.writeFileSync(cachePath, JSON.stringify(updatedCache, null, 2), 'utf-8');
        console.log(`[Seed Reasoning] Updated questions_cache.json with ${reasoningQuestions.length} Reasoning questions (Total: ${updatedCache.length}).`);

        // 2. Insert into MongoDB
        try {
          await connectDB();
          await Question.deleteMany({ subject: 'Reasoning' });
          const inserted = await Question.insertMany(reasoningQuestions);
          console.log(`[Seed Reasoning] Successfully inserted ${inserted.length} questions into MongoDB Question collection.`);
          mongoose.disconnect();
          resolve();
        } catch (err) {
          console.error('[Seed Reasoning Mongo Error]:', err.message);
          resolve(); // Resolve even if Mongo errors so script finishes
        }
      })
      .on('error', (err) => {
        console.error('[Seed Reasoning Error]:', err);
        reject(err);
      });
  });
};

seedReasoning().then(() => {
  console.log('[Seed Reasoning] Seeding complete.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
