/**
 * Unit Test Suite for Quiz Attempt Scoring Logic and 1/3 Negative Marking Formula
 */

const calculateAttemptScore = (answers, questionsMap) => {
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  answers.forEach(item => {
    const { qNo, userOption } = item;
    const matchedQ = questionsMap[qNo] || null;
    const actualCorrectOption = matchedQ ? matchedQ.correct : 0;

    if (userOption === null || userOption === undefined) {
      skippedCount++;
    } else if (Number(userOption) === Number(actualCorrectOption)) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const totalQuestions = answers.length;
  const rawScore = correctCount * 1.0;
  const negativePenalty = wrongCount * (1 / 3);
  const netMarks = parseFloat((rawScore - negativePenalty).toFixed(2));

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    skippedCount,
    rawScore,
    negativePenalty: parseFloat(negativePenalty.toFixed(2)),
    netMarks
  };
};

describe('Quiz Attempt Scoring & 1/3 Negative Marking Tests', () => {
  const sampleQuestions = {
    'Q1': { qNo: 'Q1', correct: 0 },
    'Q2': { qNo: 'Q2', correct: 1 },
    'Q3': { qNo: 'Q3', correct: 2 },
    'Q4': { qNo: 'Q4', correct: 3 }
  };

  test('All correct answers yield full score with 0 penalty', () => {
    const answers = [
      { qNo: 'Q1', userOption: 0 },
      { qNo: 'Q2', userOption: 1 },
      { qNo: 'Q3', userOption: 2 },
      { qNo: 'Q4', userOption: 3 }
    ];

    const result = calculateAttemptScore(answers, sampleQuestions);

    expect(result.totalQuestions).toBe(4);
    expect(result.correctCount).toBe(4);
    expect(result.wrongCount).toBe(0);
    expect(result.skippedCount).toBe(0);
    expect(result.rawScore).toBe(4);
    expect(result.negativePenalty).toBe(0);
    expect(result.netMarks).toBe(4);
  });

  test('3 correct, 3 wrong deducts exactly 1.0 mark (3 * 1/3)', () => {
    const questionsMap = {
      'Q1': { qNo: 'Q1', correct: 0 },
      'Q2': { qNo: 'Q2', correct: 1 },
      'Q3': { qNo: 'Q3', correct: 2 },
      'Q4': { qNo: 'Q4', correct: 3 },
      'Q5': { qNo: 'Q5', correct: 0 },
      'Q6': { qNo: 'Q6', correct: 1 }
    };

    const answers = [
      { qNo: 'Q1', userOption: 0 }, // correct
      { qNo: 'Q2', userOption: 1 }, // correct
      { qNo: 'Q3', userOption: 2 }, // correct
      { qNo: 'Q4', userOption: 0 }, // wrong
      { qNo: 'Q5', userOption: 1 }, // wrong
      { qNo: 'Q6', userOption: 2 }  // wrong
    ];

    const result = calculateAttemptScore(answers, questionsMap);

    expect(result.totalQuestions).toBe(6);
    expect(result.correctCount).toBe(3);
    expect(result.wrongCount).toBe(3);
    expect(result.rawScore).toBe(3);
    expect(result.negativePenalty).toBe(1.0);
    expect(result.netMarks).toBe(2.0); // 3.0 - 1.0 = 2.0
  });

  test('Skipped questions do not incur negative penalty', () => {
    const answers = [
      { qNo: 'Q1', userOption: 0 }, // correct (+1)
      { qNo: 'Q2', userOption: null }, // skipped
      { qNo: 'Q3', userOption: null }, // skipped
      { qNo: 'Q4', userOption: 1 }  // wrong (-0.33)
    ];

    const result = calculateAttemptScore(answers, sampleQuestions);

    expect(result.totalQuestions).toBe(4);
    expect(result.correctCount).toBe(1);
    expect(result.wrongCount).toBe(1);
    expect(result.skippedCount).toBe(2);
    expect(result.negativePenalty).toBe(0.33);
    expect(result.netMarks).toBe(0.67); // 1 - 0.33 = 0.67
  });

  test('Client-sent correctOption is ignored in server calculation', () => {
    const answers = [
      { qNo: 'Q1', userOption: 2, correctOption: 2 }, // User says 2, lies correctOption is 2, DB ground truth is 0
    ];

    const result = calculateAttemptScore(answers, sampleQuestions);

    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(1);
    expect(result.netMarks).toBe(-0.33);
  });
});
