const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  level: { type: String, required: true }, // 'prt', 'tgt68', 'tgt910', 'pgt1112'
  year: { type: Number, required: true },
  totalQuestions: { type: Number, default: 150 },
  totalMarks: { type: Number, default: 150 },
  durationMins: { type: Number, default: 150 },
  negativeMarking: { type: Number, default: 0.3333 },
  paperType: { type: String, default: 'full_mock' }, // 'full_mock', 'subject_wise'
  subject: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Paper', PaperSchema);
