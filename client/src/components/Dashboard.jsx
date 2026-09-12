import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LEVELS } from './LevelSelector';
import { BookOpen, Award, ArrowLeft } from 'lucide-react';

const Dashboard = ({ levelCode, onSelectSubjectMode, onSelectYearMode, onChangeLevel }) => {
  const { lang } = useLanguage();
  const lvl = LEVELS[levelCode] || LEVELS.prt;

  return (
    <div className="screen">
      <h1 className="hero">{lang === 'hi' ? lvl.hi : lvl.en}</h1>
      <p className="lede">
        {lang === 'hi'
          ? '150 प्रश्न · 150 अंक · 2 घंटे 30 मिनट · प्रत्येक गलत उत्तर पर ⅓ अंक की कटौती।'
          : '150 questions · 150 marks · 2 hrs 30 min · ⅓ mark negative for each wrong answer.'}
      </p>

      {/* PAPER STRUCTURE CARD */}
      <div className="structure-card">
        <div className="sc-title">
          {lang === 'hi' ? 'पेपर संरचना' : 'PAPER STRUCTURE'}
        </div>
        {lvl.papers.map((p, i) => (
          <div key={i} className="sc-row">
            <span className="sc-name">
              {lang === 'hi' ? p.hi : p.en}
              {p.qualifying && (
                <span className="sc-tag">
                  {lang === 'hi' ? '(केवल क्वालीफाइंग)' : '(qualifying only)'}
                </span>
              )}
            </span>
            <span className="sc-marks">{p.marks}</span>
          </div>
        ))}
        <div className="sc-foot">
          <span>{lang === 'hi' ? 'कुल: 150 प्रश्न / 150 अंक' : 'Total: 150 questions / 150 marks'}</span>
          <span>{lang === 'hi' ? '2:30 घंटे' : '2h 30m'}</span>
        </div>
      </div>

      {/* MODES */}
      <div className="mode-card" onClick={onSelectSubjectMode}>
        <div className="bubble">S</div>
        <div className="txt">
          <strong>
            {lang === 'hi' ? 'विषयवार पिछले वर्ष के प्रश्न (Subject-wise PYQ)' : 'Subject-wise PYQ'}
          </strong>
          <span>
            {lang === 'hi'
              ? 'गणित, विज्ञान, हिंदी, इतिहास आदि विषयवार अभ्यास करें'
              : 'Practice subject-wise PYQs across Mathematics, Science, History, etc.'}
          </span>
        </div>
      </div>

      <div className="mode-card" onClick={onSelectYearMode}>
        <div className="bubble">Y</div>
        <div className="txt">
          <strong>
            {lang === 'hi' ? 'वर्षवार पूर्ण मॉक टेस्ट (Year-wise Full Mock Test)' : 'Year-wise Full Mock Test'}
          </strong>
          <span>
            {lang === 'hi'
              ? 'BPSC TRE 4.0 2024 का 150 प्रश्नों का असली पेपर टेस्ट या अभ्यास के रूप में दें'
              : 'Take the full 150-question 2024 BPSC TRE4 paper as a timed test or practice'}
          </span>
        </div>
      </div>

      <div className="back-link">
        <button 
          type="button" 
          className="back-btn" 
          onClick={(e) => { e.preventDefault(); onChangeLevel && onChangeLevel(); }}
        >
          {lang === 'hi' ? '← स्तर/पद बदलें (Change Level)' : '← Change Level / Post'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
