const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  qNo: { type: String, required: true },
  numId: { type: Number, required: true },
  levels: [{ type: String, enum: ['prt', 'tgt68', 'tgt910', 'pgt1112'], default: ['prt'] }],
  paper: { type: String, required: true, default: 'gs' }, // 'language', 'gs', 'subject'
  subject: { type: String, required: true },
  topic: { type: String, default: 'General' },
  year: { type: Number, required: true, default: 2024 },
  examName: { type: String, default: 'BPSC TRE 4.0' },
  en: {
    q: { type: String, required: true },
    opts: [{ type: String, required: true }],
    sol: { type: String, default: '' }
  },
  hi: {
    q: { type: String, required: true },
    opts: [{ type: String, required: true }],
    sol: { type: String, default: '' }
  },
  correct: { type: Number, required: true }, // 0-indexed (0 to 4 corresponding to A, B, C, D, E)
  originalCorrectChar: { type: String, default: '1' }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
