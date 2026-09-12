import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LEVELS } from './LevelSelector';

const YearPicker = ({ levelCode, onStartMockTest, onBack }) => {
  const { lang } = useLanguage();
  const lvl = LEVELS[levelCode] || LEVELS.prt;

  const mockPapers = [
    {
      year: 2024,
      titleEn: 'BPSC TRE 4.0 (Class 1-5 PRT) Official PYQ',
      titleHi: 'BPSC TRE 4.0 (कक्षा 1-5) आधिकारिक पिछला वर्ष पेपर',
      totalQuestions: 150,
      mins: 150
    },
    {
      year: 2023,
      titleEn: 'BPSC TRE 3.0 Full Length Model Mock Paper',
      titleHi: 'BPSC TRE 3.0 संपूर्ण मॉडल मॉक टेस्ट',
      totalQuestions: 50,
      mins: 50
    }
  ];

  return (
    <div className="screen">
      <h1 className="hero">{lang === 'hi' ? 'पूर्ण मॉक टेस्ट' : 'Full Mock Tests'}</h1>
      <p className="lede">
        {lang === 'hi'
          ? 'Take Test असली परीक्षा जैसा अनुभव देता है — समयबद्ध, ऋणात्मक अंकन (⅓), उत्तर केवल अंत में दिखेंगे। Practice में हर प्रश्न के बाद उत्तर और समाधान तुरंत दिखता है।'
          : 'Take Test simulates the real exam — timed, negative marking, answers shown only at the end. Practice reveals the answer and solution after every question.'}
      </p>

      {mockPapers.map((paper, idx) => (
        <div key={idx}>
          <div className="year-group-label">{paper.year}</div>
          <div className="paper-card">
            <div className="pc-title">
              {lang === 'hi' ? paper.titleHi : paper.titleEn}
            </div>
            <div className="pc-meta">
              <span>{paper.totalQuestions} {lang === 'hi' ? 'प्रश्न' : 'questions'}</span>
              <span className="dot"></span>
              <span>~{paper.mins} {lang === 'hi' ? 'मिनट' : 'min'}</span>
              <span className="dot"></span>
              <span className="tag-pill en">English</span>
              <span className="tag-pill hi">हिन्दी</span>
            </div>

            <div className="pc-btn-row">
              <div 
                className="pc-btn test" 
                onClick={() => onStartMockTest(paper.year, 'test')}
              >
                {lang === 'hi' ? 'टेस्ट दें (Take Test)' : 'Take Test'}
              </div>
              <div 
                className="pc-btn practice" 
                onClick={() => onStartMockTest(paper.year, 'practice')}
              >
                {lang === 'hi' ? 'अभ्यास करें (Practice)' : 'Practice'}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="back-link">
        <button 
          type="button" 
          className="back-btn" 
          onClick={(e) => { e.preventDefault(); onBack && onBack(); }}
        >
          {lang === 'hi' ? '← वापस (Back)' : '← Back'}
        </button>
      </div>
    </div>
  );
};

export default YearPicker;
