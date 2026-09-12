import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LEVELS } from './LevelSelector';

const PaperPicker = ({ levelCode, onSelectPaper, onBack }) => {
  const { lang } = useLanguage();
  const lvl = LEVELS[levelCode] || LEVELS.prt;

  return (
    <div className="screen">
      <h1 className="hero">{lang === 'hi' ? 'पेपर चुनें' : 'Choose a paper'}</h1>
      <p className="lede">
        {lang === 'hi'
          ? 'इस स्तर के परीक्षा पेपर का चयन करें।'
          : 'Choose a paper from this level to view subject questions.'}
      </p>

      <div>
        {lvl.papers.map((p, idx) => (
          <div 
            key={idx} 
            className="paper-row"
            onClick={() => onSelectPaper(p.key)}
          >
            <span className="name">{lang === 'hi' ? p.hi : p.en}</span>
            <span className="count">
              {p.marks} {lang === 'hi' ? 'अंक' : 'marks'}
            </span>
          </div>
        ))}
      </div>

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

export default PaperPicker;
