import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Download, FileText, ChevronDown } from 'lucide-react';

const NotesReader = ({ noteId, onBack }) => {
  const { lang } = useLanguage();
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUnits, setOpenUnits] = useState({ 0: true, 1: true });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/notes/${noteId}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.data) {
          setNoteData(data.data);
        }
      })
      .catch(err => {
        console.error('Fetch note detail error:', err);
        setLoading(false);
      });
  }, [noteId]);

  if (loading) {
    return (
      <div className="screen" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
        {lang === 'hi' ? 'नोट्स लोड हो रहे हैं...' : 'Loading note details...'}
      </div>
    );
  }

  if (!noteData) {
    return (
      <div className="screen">
        <p>{lang === 'hi' ? 'नोट्स नहीं मिले।' : 'Note not found.'}</p>
        <div className="back-link">
          <button 
            type="button" 
            className="back-btn" 
            onClick={(e) => { e.preventDefault(); onBack && onBack(); }}
          >
            ← {lang === 'hi' ? 'वापस' : 'back'}
          </button>
        </div>
      </div>
    );
  }

  const toggleUnit = (uIdx) => {
    setOpenUnits(prev => ({ ...prev, [uIdx]: !prev[uIdx] }));
  };

  const encodedPdfUrl = `/notes/${encodeURIComponent(noteData.pdfFileName)}`;

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={onBack}>
          <ArrowLeft size={14} /> {lang === 'hi' ? 'सभी विषय' : 'all subjects'}
        </button>

        <a 
          href={encodedPdfUrl} 
          download={noteData.pdfFileName}
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: 13, textDecoration: 'none' }}
        >
          <Download size={14} /> {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
        </a>
      </div>

      <h1 className="hero" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi' ? noteData.subjectNameHi : noteData.subjectNameEn}
      </h1>

      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 20 }}>
        <span><b>Code:</b> {noteData.subjectCode}</span> · 
        <span> <b>Year:</b> {noteData.year} Year</span> · 
        <span> <b>File:</b> <code style={{ fontSize: 11, background: 'var(--paper)', padding: '2px 6px', borderRadius: 4 }}>{noteData.pdfFileName}</code></span>
      </div>

      {/* Unit Accordion Cards */}
      {noteData.units && noteData.units.map((unit, uIdx) => (
        <div key={uIdx} className={`topic-card ${openUnits[uIdx] ? 'open' : ''}`}>
          <div className="topic-head" onClick={() => toggleUnit(uIdx)}>
            <div className="t-title" lang-hi={lang === 'hi' ? '' : undefined}>
              {lang === 'hi' ? unit.titleHi : unit.titleEn}
            </div>
            <div className="t-chevron">
              <ChevronDown size={18} />
            </div>
          </div>

          <div className="topic-body">
            <div className="topic-body-inner">
              {unit.topics && unit.topics.map((topic, tIdx) => (
                <div key={tIdx} style={{ marginBottom: tIdx < unit.topics.length - 1 ? 18 : 0 }}>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }} lang-hi={lang === 'hi' ? '' : undefined}>
                    {lang === 'hi' ? topic.titleHi : topic.titleEn}
                  </h4>
                  <p style={{ margin: 0, fontSize: 14, lineHeights: 1.65, color: 'var(--ink-soft)' }} lang-hi={lang === 'hi' ? '' : undefined}>
                    {lang === 'hi' ? topic.contentHi : topic.contentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="back-link" style={{ marginTop: 20 }}>
        <button 
          type="button" 
          className="back-btn" 
          onClick={(e) => { e.preventDefault(); onBack && onBack(); }}
        >
          ← {lang === 'hi' ? 'सभी विषय' : 'all subjects'}
        </button>
      </div>
    </div>
  );
};

export default NotesReader;
