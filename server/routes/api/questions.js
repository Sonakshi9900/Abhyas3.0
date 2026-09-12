const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Question = require('../../models/Question');
const { getFallbackQuestions } = require('../../utils/fallback');

// @route   GET /api/questions
// @desc    Get filtered list of questions (sanitized without correct answer key or solutions)
router.get('/', async (req, res) => {
  try {
    const { level, paper, subject, topic, year, limit } = req.query;
    let questions = [];

    // Try MongoDB query first with answer/solution exclusion
    try {
      const filter = {};
      if (level) filter.levels = level;
      if (paper) filter.paper = paper;
      if (subject) filter.subject = subject;
      if (topic && topic !== 'all') filter.topic = topic;
      if (year) filter.year = parseInt(year);

      let query = Question.find(filter)
        .select('-en.sol -hi.sol -correct -originalCorrectChar')
        .sort({ numId: 1 });
      if (limit) query = query.limit(parseInt(limit));

      questions = await query.exec();
    } catch (err) {
      console.warn('[API Questions] Mongo Query Error, falling back to JSON cache:', err.message);
      questions = [];
    }

    // Fallback to JSON cache if Mongo returned no records or errored (sanitized = true)
    if (!questions || questions.length === 0) {
      let cached = getFallbackQuestions(true); // Strip correct answers and solutions
      if (level) cached = cached.filter(q => q.levels && q.levels.includes(level));
      if (paper) cached = cached.filter(q => q.paper === paper);
      if (subject) cached = cached.filter(q => q.subject === subject);
      if (topic && topic !== 'all') cached = cached.filter(q => q.topic === topic);
      if (year) cached = cached.filter(q => q.year === parseInt(year));
      if (limit) cached = cached.slice(0, parseInt(limit));
      questions = cached;
    }

    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/questions/subjects
// @desc    Get list of unique subjects with question counts
router.get('/subjects', async (req, res) => {
  try {
    const { level } = req.query;
    let allQ = [];

    try {
      allQ = await Question.find(level ? { levels: level } : {});
    } catch (err) {
      allQ = [];
    }

    if (!allQ || allQ.length === 0) {
      allQ = getFallbackQuestions(true);
      if (level) allQ = allQ.filter(q => q.levels && q.levels.includes(level));
    }

    const counts = {};
    allQ.forEach(q => {
      const s = q.subject || 'General';
      counts[s] = (counts[s] || 0) + 1;
    });

    const subjectList = Object.keys(counts).map(subject => ({
      name: subject,
      count: counts[subject]
    })).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: subjectList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/questions/bulk-import
// @desc    Bulk insert questions from CSV/JSON data
router.post('/bulk-import', async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide an array of question objects.' });
    }

    let inserted = [];
    try {
      inserted = await Question.insertMany(questions);
    } catch (e) {
      console.warn('[API Questions] Mongo bulk insert warning:', e.message);
    }

    // Update JSON cache
    const cachePath = path.join(__dirname, '../../data/questions_cache.json');
    let existing = [];
    if (fs.existsSync(cachePath)) {
      try { existing = JSON.parse(fs.readFileSync(cachePath, 'utf-8')); } catch (err) {}
    }
    const merged = [...existing, ...questions];
    fs.writeFileSync(cachePath, JSON.stringify(merged, null, 2), 'utf-8');

    res.json({
      success: true,
      count: questions.length,
      message: `Successfully imported ${questions.length} questions!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
