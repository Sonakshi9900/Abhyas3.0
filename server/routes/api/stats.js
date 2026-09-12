const express = require('express');
const router = express.Router();
const Question = require('../../models/Question');
const Attempt = require('../../models/Attempt');
const { getFallbackQuestions } = require('../../utils/fallback');

// @route   GET /api/stats/overview
// @desc    Overview statistics
router.get('/overview', async (req, res) => {
  try {
    let totalQuestions = 0;
    let attemptsCount = 0;

    try {
      totalQuestions = await Question.countDocuments();
      attemptsCount = await Attempt.countDocuments();
    } catch (e) {
      totalQuestions = 0;
      attemptsCount = 0;
    }

    if (totalQuestions === 0) {
      totalQuestions = getFallbackQuestions(true).length;
    }

    res.json({
      success: true,
      data: {
        totalQuestions,
        attemptsCount,
        examName: 'BPSC TRE 4.0 PRT 2024',
        levelsSupported: 4,
        negativeMarkingRatio: '1/3'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
