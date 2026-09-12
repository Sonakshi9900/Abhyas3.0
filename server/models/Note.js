const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  contentEn: { type: String, required: true },
  contentHi: { type: String, required: true }
});

const UnitSchema = new mongoose.Schema({
  unitNum: { type: Number, required: true },
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  topics: [TopicSchema]
});

const NoteSchema = new mongoose.Schema({
  year: { type: String, enum: ['1st', '2nd'], required: true }, // '1st' or '2nd' year D.El.Ed
  subjectCode: { type: String, required: true }, // e.g. 'S-01', 'S-02', 'F-01'
  subjectNameEn: { type: String, required: true },
  subjectNameHi: { type: String, required: true },
  language: { type: String, enum: ['en', 'hi'], required: true }, // 'en' or 'hi'
  optionNumber: { type: Number, required: true, default: 1 }, // 1, 2, 3...
  pdfFileName: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  author: { type: String, default: 'AEPS / Future Online Classes' },
  descriptionEn: { type: String },
  descriptionHi: { type: String },
  isAvailable: { type: Boolean, default: true },
  units: [UnitSchema]
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
