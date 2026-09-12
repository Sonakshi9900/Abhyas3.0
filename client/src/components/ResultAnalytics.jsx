import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Eye } from 'lucide-react';

const ResultAnalytics = ({ resultData, onStartReview, onPracticeMore }) => {
  const { lang } = useLanguage();

  const {
    correct = 0,
    wrong = 0,
    skipped = 0,
    totalQuestions = 10,
    mode = 'test',
    tagLabel = ''
  } = resultData || {};

  const rawScore = correct * 1;
  const negativePenalty = wrong * (1 / 3);
  const netMarks = Math.max(0, parseFloat((rawScore - negativePenalty).toFixed(2)));
  const percentage = Math.round((correct / totalQuestions) * 100);

  useEffect(() => {
    if (percentage >= 50) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  return (
    <div className="screen">
      <div className="result-wrap">
        {/* Score Ring */}
        <div className="score-ring">
          <div className="num">{correct}</div>
          <div className="den">
            {lang === 'hi' ? `कुल ${totalQuestions} में से` : `out of ${totalQuestions}`}
          </div>
        </div>

        <div className="result-title">
          {percentage >= 80 ? (lang === 'hi' ? 'उत्कृष्ट प्रदर्शन!' : 'Outstanding Performance!') :
           percentage >= 50 ? (lang === 'hi' ? 'अच्छा प्रयास!' : 'Good Effort!') :
           (lang === 'hi' ? 'अभ्यास जारी रखें!' : 'Keep Practicing!')}
        </div>

        <div className="result-sub">
          {tagLabel || (lang === 'hi' ? 'BPSC TRE अभ्यास' : 'BPSC TRE Attempt')}
        </div>

        {/* Stats Row */}
        <div className="stat-row">
          <div className="stat correct">
            <div className="n">{correct}</div>
            <div className="l">{lang === 'hi' ? 'सही (CORRECT)' : 'CORRECT'}</div>
          </div>
          <div className="stat wrong">
            <div className="n">{wrong}</div>
            <div className="l">{lang === 'hi' ? 'गलत (WRONG)' : 'WRONG'}</div>
          </div>
          <div className="stat">
            <div className="n">{skipped}</div>
            <div className="l">{lang === 'hi' ? 'छोड़े (SKIPPED)' : 'SKIPPED'}</div>
          </div>
        </div>

        {/* Marks with 1/3 negative marking */}
        {mode === 'test' && (
          <div className="marks-row">
            <span className="m-label">
              {lang === 'hi' ? 'अंक (⅓ ऋणात्मक अंकन लागू)' : 'Net Marks (⅓ negative marking)'}
            </span>
            <span className="m-val">
              {netMarks} / {totalQuestions}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          <button className="btn btn-outline" onClick={onStartReview}>
            <Eye size={18} /> {lang === 'hi' ? 'उत्तर एवं समाधान समीक्षा करें' : 'Review Answers & Solutions'}
          </button>
          
          <button className="btn btn-primary" onClick={onPracticeMore}>
            <RefreshCw size={18} /> {lang === 'hi' ? 'कुछ और अभ्यास करें' : 'Practice Something Else'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
