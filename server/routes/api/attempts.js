const express = require('express');
const router = express.Router();
const Attempt = require('../../models/Attempt');
const Question = require('../../models/Question');
const { getFallbackQuestionsRaw } = require('../../utils/fallback');
const { optionalAuth } = require('../../middleware/auth');

// @route   POST /api/attempts/submit
// @desc    Submit a quiz/test attempt and compute score server-side with 1/3 negative marking
// @access  Public / Optional Auth
router.post('/submit', optionalAuth, async (req, res) => {
  try {
    const { title, level, mode, answers, durationSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid answers array.' });
    }

    // Fetch all question records to verify correct answers server-side
    let dbQuestionsMap = {};
    const qNos = answers.map(a => a.qNo).filter(Boolean);

    try {
      if (qNos.length > 0) {
        const found = await Question.find({ qNo: { $in: qNos } });
        found.forEach(q => {
          dbQuestionsMap[q.qNo] = q;
        });
      }
    } catch (err) {
      console.warn('[Attempts API] Mongo Question Lookup Error, using raw JSON cache:', err.message);
      dbQuestionsMap = {};
    }

    // Fallback cache if DB questions not found
    const fallbackRaw = getFallbackQuestionsRaw();
    fallbackRaw.forEach(q => {
      if (q.qNo && !dbQuestionsMap[q.qNo]) {
        dbQuestionsMap[q.qNo] = q;
      }
    });

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const evaluatedAnswers = answers.map(item => {
      const { qNo, userOption } = item;
      const matchedQ = dbQuestionsMap[qNo] || null;

      // Extract ground-truth correct option from DB/cache question document
      const actualCorrectOption = matchedQ ? matchedQ.correct : 0;
      let isCorrect = false;

      if (userOption === null || userOption === undefined) {
        skippedCount++;
      } else if (Number(userOption) === Number(actualCorrectOption)) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }

      return {
        qNo,
        userOption: userOption !== undefined ? userOption : null,
        correctOption: actualCorrectOption,
        isCorrect,
        questionId: matchedQ ? matchedQ._id : undefined,
        solEn: matchedQ && matchedQ.en ? matchedQ.en.sol : '',
        solHi: matchedQ && matchedQ.hi ? matchedQ.hi.sol : ''
      };
    });

    const totalQuestions = answers.length;
    const rawScore = correctCount * 1.0;
    const negativePenalty = wrongCount * (1 / 3);
    const netMarks = parseFloat((rawScore - negativePenalty).toFixed(2));

    const attemptData = {
      userId: req.user ? req.user.id : null,
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
// @desc    Get user attempt history (scoped to user if authenticated)
// @access  Public / Optional Auth
router.get('/history', optionalAuth, async (req, res) => {
  try {
    let attempts = [];
    const filter = req.user ? { userId: req.user.id } : {};

    try {
      attempts = await Attempt.find(filter).sort({ createdAt: -1 }).limit(20);
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
