const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, required: true },
  level: { type: String, required: true },
  mode: { type: String, enum: ['test', 'practice'], required: true },
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  skippedCount: { type: Number, required: true },
  rawScore: { type: Number, required: true },
  netMarks: { type: Number, required: true },
  negativePenalty: { type: Number, required: true },
  durationSeconds: { type: Number, default: 0 },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    qNo: String,
    userOption: Number, // null if skipped
    correctOption: Number,
    isCorrect: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('Attempt', AttemptSchema);
