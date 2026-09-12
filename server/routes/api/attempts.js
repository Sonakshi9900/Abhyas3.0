const express = require('express');
const router = express.Router();
const Attempt = require('../../models/Attempt');
const Question = require('../../models/Question');
const fs = require('fs');
const path = require('path');

const getFallbackQuestions = () => {
  const jsonPath = path.join(__dirname, '../../data/questions_cache.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
  return [];
};

// @route   POST /api/attempts/submit
// @desc    Submit a quiz/test attempt and compute score with 1/3 negative marking
router.post('/submit', async (req, res) => {
  try {
    const { title, level, mode, answers, durationSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid answers array.' });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const evaluatedAnswers = answers.map(item => {
      const { qNo, userOption, correctOption } = item;
      
      let isCorrect = false;
      if (userOption === null || userOption === undefined) {
        skippedCount++;
      } else if (userOption === correctOption) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }

      return {
        qNo,
        userOption,
        correctOption,
        isCorrect
      };
    });

    const totalQuestions = answers.length;
    const rawScore = correctCount * 1.0;
    const negativePenalty = wrongCount * (1 / 3);
    const netMarks = parseFloat((rawScore - negativePenalty).toFixed(2));

    const attemptData = {
      title: title || 'BPSC TRE Practice Attempt',
      level: level || 'prt',
      mode: mode || 'practice',
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      rawScore,
      negativePenalty: parseFloat(negativePenalty.toFixed(2)),
      netMarks,
      durationSeconds: durationSeconds || 0,
      answers: evaluatedAnswers
    };

    let savedAttempt = attemptData;
    try {
      savedAttempt = await Attempt.create(attemptData);
    } catch (err) {
      console.warn('[Attempts API] Mongo Save Warning:', err.message);
      savedAttempt._id = `attempt-${Date.now()}`;
    }

    res.json({
      success: true,
      data: savedAttempt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/attempts/history
// @desc    Get user attempt history
router.get('/history', async (req, res) => {
  try {
    let attempts = [];
    try {
      attempts = await Attempt.find().sort({ createdAt: -1 }).limit(20);
    } catch (err) {
      attempts = [];
    }

    res.json({
      success: true,
      data: attempts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
