const express = require('express');
const router = express.Router();
const Paper = require('../../models/Paper');
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

// @route   GET /api/papers
// @desc    Get papers for level
router.get('/', async (req, res) => {
  try {
    const { level } = req.query;
    let papers = [];

    try {
      papers = await Paper.find(level ? { level } : {}).sort({ year: -1 });
    } catch (e) {
      papers = [];
    }

    if (!papers || papers.length === 0) {
      const allQ = getFallbackQuestions();
      const years = [...new Set(allQ.map(q => q.year))];
      papers = years.map(y => ({
        _id: `mock-${y}`,
        titleEn: `BPSC TRE 4.0 — Class 1–5 (${y} PYQ Paper)`,
        titleHi: `BPSC TRE 4.0 — कक्षा 1–5 (${y} पिछला वर्ष का पेपर)`,
        level: level || 'prt',
        year: y,
        totalQuestions: allQ.filter(q => q.year === y).length || 150,
        totalMarks: 150,
        durationMins: 150,
        negativeMarking: 0.3333,
        paperType: 'full_mock'
      }));
    }

    res.json({
      success: true,
      data: papers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
