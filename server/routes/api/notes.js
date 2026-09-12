const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Note = require('../../models/Note');

const getFallbackNotes = () => {
  const jsonPath = path.join(__dirname, '../../data/notes_cache.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
  return [];
};

// @route   GET /api/notes
// @desc    Get filtered list of D.El.Ed notes
router.get('/', async (req, res) => {
  try {
    const { year, subjectCode, language } = req.query;
    let notes = [];

    try {
      const filter = {};
      if (year) filter.year = year;
      if (subjectCode) filter.subjectCode = subjectCode;
      if (language) filter.language = language;

      notes = await Note.find(filter).sort({ subjectCode: 1, optionNumber: 1 });
    } catch (e) {
      notes = [];
    }

    if (!notes || notes.length === 0) {
      let cached = getFallbackNotes();
      if (year) cached = cached.filter(n => n.year === year);
      if (subjectCode) cached = cached.filter(n => n.subjectCode === subjectCode);
      if (language) cached = cached.filter(n => n.language === language);
      notes = cached;
    }

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/notes/subjects
// @desc    Get unique subject cards for a specific year and optional language
router.get('/subjects', async (req, res) => {
  try {
    const { year, language } = req.query;
    let allNotes = [];

    try {
      const filter = {};
      if (year) filter.year = year;
      if (language && language !== 'all') filter.language = language;
      allNotes = await Note.find(filter);
    } catch (e) {
      allNotes = [];
    }

    if (!allNotes || allNotes.length === 0) {
      allNotes = getFallbackNotes();
      if (year) allNotes = allNotes.filter(n => n.year === year);
      if (language && language !== 'all') allNotes = allNotes.filter(n => n.language === language);
    }

    const subjectsMap = {};
    allNotes.forEach(note => {
      const code = note.subjectCode;
      if (!subjectsMap[code]) {
        subjectsMap[code] = {
          subjectCode: code,
          subjectNameEn: note.subjectNameEn,
          subjectNameHi: note.subjectNameHi,
          year: note.year,
          notesCount: 0,
          languages: new Set(),
          notesList: []
        };
      }
      if (note.isAvailable !== false) {
        subjectsMap[code].notesCount++;
      }
      subjectsMap[code].languages.add(note.language);
      subjectsMap[code].notesList.push({
        id: String(note._id || `${note.subjectCode}-${note.language}-${note.optionNumber}`),
        subjectCode: note.subjectCode,
        titleEn: note.descriptionEn || note.subjectNameEn,
        titleHi: note.descriptionHi || note.subjectNameHi,
        language: note.language,
        optionNumber: note.optionNumber,
        pdfFileName: note.pdfFileName,
        pdfUrl: note.pdfUrl,
        author: note.author,
        isAvailable: note.isAvailable !== false
      });
    });

    const result = Object.values(subjectsMap).map(item => ({
      ...item,
      languages: Array.from(item.languages),
      hasAvailablePdf: item.notesList.some(n => n.isAvailable)
    })).sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/notes/:id
// @desc    Get detailed note by ID or subjectCode
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let note = null;

    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        note = await Note.findById(id);
      }
      if (!note) {
        note = await Note.findOne({
          $or: [
            { subjectCode: id },
            { pdfFileName: new RegExp(id, 'i') }
          ]
        });
      }
    } catch (e) {
      note = null;
    }

    if (!note) {
      const all = getFallbackNotes();
      note = all.find(n => (n._id && String(n._id) === id) || n.subjectCode === id || (n.pdfFileName && n.pdfFileName.includes(id)));
      if (!note && all.length > 0) {
        // Fallback to first matching subject note
        note = all.find(n => n.subjectCode.toLowerCase() === id.toLowerCase()) || all[0];
      }
    }

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
