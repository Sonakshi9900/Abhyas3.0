import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Grid, AlertTriangle } from 'lucide-react';

const QuizEngine = ({ 
  activeQuestions, 
  mode = 'practice', 
  tagLabel = '', 
  isReviewMode = false, 
  onFinishQuiz,
  onBackToResult
}) => {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(new Array(activeQuestions.length).fill(null));
  const [checked, setChecked] = useState(new Array(activeQuestions.length).fill(false));
  const [timerSeconds, setTimerSeconds] = useState(activeQuestions.length * 60); // 1 min per question
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer effect for Test Mode
  useEffect(() => {
    if (mode !== 'test' || isReviewMode) return;

    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isReviewMode, answers]);

  const handleAutoSubmit = () => {
    submitAttempt();
  };

  const currentQ = activeQuestions[idx] || activeQuestions[0];
  if (!currentQ) return <div className="screen">No questions found.</div>;

  const qData = currentQ[lang] || currentQ.en || currentQ.hi;
  const isLast = idx === activeQuestions.length - 1;
  const showReveal = (mode === 'practice' && checked[idx]) || isReviewMode;

  const selectOption = (optIdx) => {
    if (showReveal && mode === 'practice') return;
    const newAns = [...answers];
    newAns[idx] = optIdx;
    setAnswers(newAns);
  };

  const handleCheckAnswer = () => {
    if (answers[idx] === null) return;
    const newChecked = [...checked];
    newChecked[idx] = true;
    setChecked(newChecked);
  };

  const handleNext = () => {
    if (idx < activeQuestions.length - 1) {
      setIdx(idx + 1);
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };

  const submitAttempt = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    activeQuestions.forEach((q, i) => {
      const userOpt = answers[i];
      if (userOpt === null || userOpt === undefined) {
        skipped++;
      } else if (userOpt === q.correct) {
        correct++;
      } else {
        wrong++;
      }
    });

    onFinishQuiz({
      answers,
      activeQuestions,
      correct,
      wrong,
      skipped,
      mode,
      tagLabel,
      totalQuestions: activeQuestions.length,
      durationSeconds: activeQuestions.length * 60 - timerSeconds
    });
  };

  const formatTimer = (secs) => {
    const m = Math.floor(Math.max(secs, 0) / 60);
    const s = Math.max(secs, 0) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="screen" style={{ paddingBottom: '60px' }}>
      {/* Quiz Top Header */}
      <div className="quiz-head">
        <div className="progress-strip">
          {activeQuestions.map((_, i) => {
            let cls = 'progress-dot';
            if (i === idx) cls += ' current';
            else if (answers[i] !== null) cls += ' done';
            return (
              <div 
                key={i} 
                className={cls}
                onClick={() => setIdx(i)}
                title={`Question ${i + 1}`}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </div>

        <div className="meta-row">
          <span className="q-count">
            {lang === 'hi' ? `प्रश्न ${idx + 1} / ${activeQuestions.length}` : `Question ${idx + 1} of ${activeQuestions.length}`}
          </span>

          <span className="q-tag">
            {currentQ.subject || 'General'} · {currentQ.year || 2024}
          </span>

          {mode === 'test' && !isReviewMode && (
            <span className={`timer-badge ${timerSeconds < 300 ? 'low' : ''}`}>
              <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
              {formatTimer(timerSeconds)}
            </span>
          )}

          <button 
            className="icon-btn" 
            style={{ width: 30, height: 30 }} 
            onClick={() => setShowPalette(!showPalette)}
            title="Question Palette"
          >
            <Grid size={14} />
          </button>
        </div>
      </div>

      {/* Review Mode Banner */}
      {isReviewMode && (
        <div className="review-banner">
          <CheckCircle size={16} />
          <span>
            {lang === 'hi'
              ? 'प्रयास समीक्षा (Review Mode) — सही उत्तर और समाधान दिखाए गए हैं।'
              : 'Reviewing attempt — correct answers & solutions revealed.'}
          </span>
        </div>
      )}

      {/* Palette Drawer Modal */}
      {showPalette && (
        <div className="structure-card" style={{ marginTop: 10, marginBottom: 10 }}>
          <div className="sc-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{lang === 'hi' ? 'प्रश्न पैलेट' : 'QUESTION PALETTE'}</span>
            <button className="back-link" style={{ background: 'none', border: 'none' }} onClick={() => setShowPalette(false)}>✕</button>
          </div>
          <div className="palette-grid">
            {activeQuestions.map((_, i) => {
              let cls = 'palette-btn';
              if (i === idx) cls += ' current';
              if (answers[i] !== null) cls += ' done';
              return (
                <button 
                  key={i} 
                  className={cls}
                  onClick={() => { setIdx(i); setShowPalette(false); }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="q-card">
        <div className="q-text" lang-hi={lang === 'hi' ? '' : undefined}>
          {qData.q}
        </div>

        {/* Options */}
        <div className="options-wrap">
          {qData.opts.map((optText, optIdx) => {
            let optCls = 'option';
            const isSelected = answers[idx] === optIdx;
            const isCorrect = optIdx === currentQ.correct;

            if (showReveal) {
              if (isCorrect) optCls += ' reveal-correct';
              else if (isSelected) optCls += ' reveal-wrong';
            } else if (isSelected) {
              optCls += ' selected';
            }

            return (
              <div 
                key={optIdx} 
                className={optCls}
                onClick={() => selectOption(optIdx)}
                lang-hi={lang === 'hi' ? '' : undefined}
              >
                <div className="oval">{optionLetters[optIdx]}</div>
                <div className="otxt">{optText}</div>
              </div>
            );
          })}
        </div>

        {/* Solution Explanation Box */}
        {showReveal && (
          <div className="solution-box">
            <div className="sol-label">{lang === 'hi' ? 'समाधान (Solution)' : 'SOLUTION'}</div>
            <div className="sol-text" lang-hi={lang === 'hi' ? '' : undefined}>
              {qData.sol || (lang === 'hi' ? 'समाधान उपलब्ध है।' : 'Detailed solution provided.')}
            </div>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="action-row">
        {isReviewMode ? (
          <div className="btn-line">
            <button className="btn btn-outline" disabled={idx === 0} onClick={handlePrev}>
              <ChevronLeft size={18} /> {lang === 'hi' ? 'पिछला' : 'Previous'}
            </button>
            <button className="btn btn-primary" onClick={isLast ? onBackToResult : handleNext}>
              {isLast ? (lang === 'hi' ? 'परिणाम पर वापस' : 'Back to Result') : (lang === 'hi' ? 'अगला' : 'Next')} <ChevronRight size={18} />
            </button>
          </div>
        ) : mode === 'practice' ? (
          <div className="btn-line">
            {showReveal ? (
              <button className="btn btn-primary" onClick={isLast ? submitAttempt : handleNext}>
                {isLast ? (lang === 'hi' ? 'परिणाम देखें' : 'See Result') : (lang === 'hi' ? 'अगला प्रश्न' : 'Next Question')} <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                disabled={answers[idx] === null} 
                onClick={handleCheckAnswer}
              >
                {lang === 'hi' ? 'उत्तर जांचें' : 'Check Answer'}
              </button>
            )}
          </div>
        ) : (
          /* Live Test Mode */
          <>
            <div className="btn-line">
              <button className="btn btn-outline" disabled={idx === 0} onClick={handlePrev}>
                <ChevronLeft size={18} /> {lang === 'hi' ? 'पिछला' : 'Previous'}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={isLast ? () => setShowSubmitModal(true) : handleNext}
              >
                {isLast ? (lang === 'hi' ? 'समाप्त' : 'Finish') : (lang === 'hi' ? 'अगला' : 'Next')} <ChevronRight size={18} />
              </button>
            </div>
            <div className="btn-line" style={{ marginTop: 6 }}>
              <button className="btn btn-danger" onClick={() => setShowSubmitModal(true)}>
                {lang === 'hi' ? 'टेस्ट जमा करें (Submit Test)' : 'Submit Test'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal for Submitting Test */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28, 37, 65, 0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div className="q-card" style={{ maxWidth: 420, width: '100%', margin: 0, textAlign: 'center' }}>
            <AlertTriangle size={36} color="var(--marigold-deep)" style={{ marginBottom: 10 }} />
            <h3 style={{ margin: '0 0 8px', fontFamily: 'Fraunces' }}>
              {lang === 'hi' ? 'क्या आप टेस्ट जमा करना चाहते हैं?' : 'Submit your test?'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
              {lang === 'hi'
                ? `आपने ${answers.filter(a => a !== null).length} / ${activeQuestions.length} प्रश्नों के उत्तर दिए हैं।`
                : `You have answered ${answers.filter(a => a !== null).length} of ${activeQuestions.length} questions.`}
            </p>
            <div className="btn-line">
              <button className="btn btn-outline" onClick={() => setShowSubmitModal(false)}>
                {lang === 'hi' ? 'जारी रखें' : 'Continue'}
              </button>
              <button className="btn btn-marigold" onClick={() => { setShowSubmitModal(false); submitAttempt(); }}>
                {lang === 'hi' ? 'हाँ, जमा करें' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEngine;
