import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LEVELS = {
  prt: { 
    code: 'prt', 
    en: 'PRT · Classes 1–5', 
    hi: 'PRT · कक्षा 1–5', 
    badge: '1–5', 
    descEn: 'Primary Teacher (General & Subject)', 
    descHi: 'प्राथमिक शिक्षक (सामान्य एवं विषय)', 
    hasCDP: true,
    papers: [ 
      { key: 'language', en: 'Language (Qualifying)', hi: 'भाषा (क्वालीफाइंग)', marks: 30, qualifying: true }, 
      { key: 'gs', en: 'General Studies (incl. CDP)', hi: 'सामान्य अध्ययन (CDP सहित)', marks: 120 } 
    ]
  },
  tgt68: { 
    code: 'tgt68', 
    en: 'TGT · Classes 6–8', 
    hi: 'TGT · कक्षा 6–8', 
    badge: '6–8', 
    descEn: 'Middle School Teacher', 
    descHi: 'मध्य विद्यालय शिक्षक', 
    hasCDP: false,
    papers: [ 
      { key: 'language', en: 'Language', hi: 'भाषा', marks: 30, qualifying: true }, 
      { key: 'gs', en: 'General Studies', hi: 'सामान्य अध्ययन', marks: 40 }, 
      { key: 'subject', en: 'Concerned Subject', hi: 'संबंधित विषय', marks: 80 } 
    ],
    subjects: ['Mathematics', 'General Science', 'Social Science', 'Hindi', 'English', 'Sanskrit', 'Urdu'] 
  },
  tgt910: { 
    code: 'tgt910', 
    en: 'TGT · Classes 9–10', 
    hi: 'TGT · कक्षा 9–10', 
    badge: '9–10', 
    descEn: 'Secondary School Teacher', 
    descHi: 'माध्यमिक शिक्षक', 
    hasCDP: false,
    papers: [ 
      { key: 'language', en: 'Language', hi: 'भाषा', marks: 30, qualifying: true }, 
      { key: 'gs', en: 'General Studies', hi: 'सामान्य अध्ययन', marks: 40 }, 
      { key: 'subject', en: 'Concerned Subject', hi: 'संबंधित विषय', marks: 80 } 
    ],
    subjects: ['Hindi', 'English', 'Sanskrit', 'Urdu', 'General Science', 'Mathematics', 'Social Science', 'Physical Education', 'Fine Arts'] 
  },
  pgt1112: { 
    code: 'pgt1112', 
    en: 'PGT · Classes 11–12', 
    hi: 'PGT · कक्षा 11–12', 
    badge: '11–12', 
    descEn: 'Senior Secondary Teacher', 
    descHi: 'उच्च माध्यमिक शिक्षक', 
    hasCDP: false,
    papers: [ 
      { key: 'language', en: 'Language', hi: 'भाषा', marks: 30, qualifying: true }, 
      { key: 'gs', en: 'General Studies', hi: 'सामान्य अध्ययन', marks: 40 }, 
      { key: 'subject', en: 'Concerned Subject', hi: 'संबंधित विषय', marks: 80 } 
    ],
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'History', 'Geography', 'Political Science', 'Economics', 'Hindi', 'English', 'Computer Science'] 
  }
};

const LevelSelector = ({ onSelectLevel }) => {
  const { lang } = useLanguage();

  return (
    <div className="screen">
      <h1 className="hero" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi' ? 'आप किस पद की तैयारी कर रहे हैं?' : 'Which post are you preparing for?'}
      </h1>
      <p className="lede" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi'
          ? 'प्रत्येक स्तर की अपनी पेपर संरचना और विषय सूची होती है — सही प्रश्न सेट देखने के लिए अपना स्तर चुनें।'
          : 'Each level has its own paper structure and subject list — pick yours to see the right question set.'}
      </p>

      <div>
        {Object.values(LEVELS).map((lvl) => (
          <div 
            key={lvl.code} 
            className="level-card"
            onClick={() => onSelectLevel(lvl.code)}
          >
            <div className="lc-top">
              <div className="lc-badge">{lvl.badge}</div>
              <div>
                <div className="lc-title" lang-hi={lang === 'hi' ? '' : undefined}>
                  {lang === 'hi' ? lvl.hi : lvl.en}
                </div>
                <div className="lc-desc" lang-hi={lang === 'hi' ? '' : undefined}>
                  {lang === 'hi' ? lvl.descHi : lvl.descEn}
                </div>
              </div>
            </div>

            <div className="lc-parts">
              {lvl.papers.map((p, idx) => (
                <div key={idx} className="lc-part" lang-hi={lang === 'hi' ? '' : undefined}>
                  {lang === 'hi' ? p.hi : p.en} <b>{p.marks}{lang === 'hi' ? 'अं' : 'm'}</b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
