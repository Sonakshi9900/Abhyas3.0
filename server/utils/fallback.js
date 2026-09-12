const fs = require('fs');
const path = require('path');

const getQuestionsCachePath = () => path.join(__dirname, '../data/questions_cache.json');
const getNotesCachePath = () => path.join(__dirname, '../data/notes_cache.json');

/**
 * Reads fallback questions from cached JSON file.
 * @param {boolean} stripAnswers - If true, removes correct answer key and solutions to prevent client answer leaks.
 */
const getFallbackQuestions = (stripAnswers = false) => {
  const jsonPath = getQuestionsCachePath();
  if (!fs.existsSync(jsonPath)) return [];
  
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const questions = JSON.parse(raw);
    
    if (!stripAnswers) return questions;

    // Sanitize questions by stripping correct answer and solution explanations
    return questions.map(q => {
      const sanitized = { ...q };
      delete sanitized.correct;
      delete sanitized.originalCorrectChar;
      if (sanitized.en) {
        const { sol, ...enRest } = sanitized.en;
        sanitized.en = enRest;
      }
      if (sanitized.hi) {
        const { sol, ...hiRest } = sanitized.hi;
        sanitized.hi = hiRest;
      }
      return sanitized;
    });
  } catch (err) {
    console.warn('[Fallback Util] Error reading questions cache:', err.message);
    return [];
  }
};

/**
 * Returns raw fallback questions WITH correct answers and solutions (for server-side evaluation).
 */
const getFallbackQuestionsRaw = () => {
  return getFallbackQuestions(false);
};

/**
 * Reads fallback notes from cached JSON file.
 */
const getFallbackNotes = () => {
  const jsonPath = getNotesCachePath();
  if (!fs.existsSync(jsonPath)) return [];
  
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Fallback Util] Error reading notes cache:', err.message);
    return [];
  }
};

module.exports = {
  getFallbackQuestions,
  getFallbackQuestionsRaw,
  getFallbackNotes
};
