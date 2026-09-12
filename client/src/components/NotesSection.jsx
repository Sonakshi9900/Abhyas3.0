import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, FileText, Download, Eye, AlertCircle, Clock } from 'lucide-react';
import { API_BASE } from '../config';

const NotesSection = ({ onOpenReader }) => {
  const { lang } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2nd'); // '1st' | '2nd'
  const [selectedLang, setSelectedLang] = useState('all'); // 'all' | 'en' | 'hi'
  const [subjectsList, setSubjectsList] = useState([]);
  const [activeSubjectModal, setActiveSubjectModal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/notes/subjects?year=${selectedYear}&language=${selectedLang}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.data) {
          setSubjectsList(data.data);
        }
      })
      .catch(err => {
        console.error('Fetch notes subjects error:', err);
        setLoading(false);
      });
  }, [selectedYear, selectedLang]);

  // Filter subjects by language filter if selected
  const filteredSubjects = subjectsList.filter(s => {
    if (selectedLang === 'all') return true;
    return s.languages && s.languages.includes(selectedLang);
  });

  return (
    <div className="screen">
      <h1 className="hero" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi' ? 'D.El.Ed पाठ्यक्रम नोट्स' : 'D.El.Ed Course Notes'}
      </h1>
      <p className="lede" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi'
          ? 'प्रारंभिक शिक्षा में डिप्लोमा (D.El.Ed) प्रथम वर्ष एवं द्वितीय वर्ष के विषयवार नोट्स — अंग्रेज़ी और हिंदी दोनों माध्यम में उपलब्ध।'
          : 'Diploma in Elementary Education (D.El.Ed) 1st & 2nd Year Subject Notes — available in English & Hindi.'}
      </p>

      {/* Year Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-pill ${selectedYear === '2nd' ? 'active' : ''}`}
          onClick={() => setSelectedYear('2nd')}
        >
          {lang === 'hi' ? 'द्वितीय वर्ष (2nd Year)' : '2nd Year Notes'}
        </button>

        <button 
          className={`filter-pill ${selectedYear === '1st' ? 'active' : ''}`}
          onClick={() => setSelectedYear('1st')}
        >
          {lang === 'hi' ? 'प्रथम वर्ष (1st Year)' : '1st Year Notes'}
        </button>
      </div>

      {/* Language Filter Pills */}
      <div className="filter-tabs" style={{ marginTop: -6 }}>
        <button 
          className={`filter-pill ${selectedLang === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedLang('all')}
        >
          {lang === 'hi' ? 'सभी भाषाएँ (All)' : 'All Languages'}
        </button>

        <button 
          className={`filter-pill ${selectedLang === 'hi' ? 'active' : ''}`}
          onClick={() => setSelectedLang('hi')}
        >
          {lang === 'hi' ? 'हिंदी (Hindi)' : 'Hindi (हिं)'}
        </button>

        <button 
          className={`filter-pill ${selectedLang === 'en' ? 'active' : ''}`}
          onClick={() => setSelectedLang('en')}
        >
          {lang === 'hi' ? 'अंग्रेज़ी (English)' : 'English (EN)'}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
          {lang === 'hi' ? 'नोट्स लोड हो रहे हैं...' : 'Loading notes...'}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
          {lang === 'hi' ? 'इस फ़िल्टर में कोई नोट्स नहीं मिले।' : 'No notes found for this filter.'}
        </div>
      ) : (
        /* Subject Cards Grid */
        <div className="notes-subject-grid">
          {filteredSubjects.map((subj, idx) => {
            const availableNotes = subj.notesList.filter(n => 
              n.isAvailable && (selectedLang === 'all' || n.language === selectedLang)
            );
            const hasAvailable = availableNotes.length > 0;

            return (
              <div 
                key={idx} 
                className="subj-note-card"
                onClick={() => setActiveSubjectModal(subj)}
                style={{ opacity: hasAvailable ? 1 : 0.85 }}
              >
                <div className="sn-badge">{subj.subjectCode}</div>
                <div style={{ flex: 1 }}>
                  <div className="sn-title" lang-hi={lang === 'hi' ? '' : undefined}>
                    {lang === 'hi' ? subj.subjectNameHi : subj.subjectNameEn}
                  </div>
                  
                  <div className="sn-sub" style={{ marginTop: 4 }}>
                    {hasAvailable ? (
                      <span style={{ color: 'var(--correct)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ✓ {availableNotes.length} {lang === 'hi' ? 'पीडीफ़ नोट्स उपलब्ध' : 'PDF note(s) available'}
                      </span>
                    ) : (
                      <span style={{ color: '#b45309', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {lang === 'hi' ? 'जल्द ही अपलोड किया जाएगा' : 'Will be uploaded soon'}
                      </span>
                    )}
                  </div>

                  <div className="sn-meta-tags" style={{ marginTop: 8 }}>
                    {subj.languages.includes('hi') && <span className="sn-tag">Hindi</span>}
                    {subj.languages.includes('en') && <span className="sn-tag">English</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Multi-Note Selection Modal */}
      {activeSubjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(28, 37, 65, 0.75)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="structure-card" style={{ maxWidth: 540, width: '100%', margin: 0, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span className="sc-title" style={{ display: 'inline-block', marginBottom: 4 }}>
                  {activeSubjectModal.subjectCode} · {selectedYear} Year
                </span>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces', fontSize: 18, color: 'var(--ink)' }}>
                  {lang === 'hi' ? activeSubjectModal.subjectNameHi : activeSubjectModal.subjectNameEn}
                </h3>
              </div>
              <button 
                className="icon-btn" 
                style={{ width: 28, height: 28 }} 
                onClick={() => setActiveSubjectModal(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
              {lang === 'hi'
                ? 'इस विषय के उपलब्ध पीडीफ़ नोट्स में से चुनें:'
                : 'Select from available PDF notes for this subject:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeSubjectModal.notesList
                .filter(noteItem => selectedLang === 'all' || noteItem.language === selectedLang)
                .map((noteItem, nIdx) => {
                  const isAvailable = noteItem.isAvailable && noteItem.pdfFileName;
                  const encodedPdfUrl = isAvailable ? `/notes/${encodeURIComponent(noteItem.pdfFileName)}` : '';

                  return (
                    <div 
                      key={nIdx} 
                      className="settings-row" 
                      style={{ 
                        flexDirection: 'column', 
                        alignItems: 'flex-start', 
                        padding: 14,
                        background: isAvailable ? 'var(--paper)' : '#fffbe6',
                        border: isAvailable ? '1px solid var(--paper-line)' : '1px solid #ffe58f'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                          Note Option #{noteItem.optionNumber} ({noteItem.language.toUpperCase()})
                        </span>
                        <span className={`tag-pill ${noteItem.language}`}>
                          {noteItem.language === 'hi' ? 'हिंदी' : 'English'}
                        </span>
                      </div>

                      {isAvailable ? (
                        <>
                          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '6px 0 12px' }}>
                            <b>PDF File:</b> <code style={{ fontSize: 11.5, background: '#eef2ff', color: '#3730a3', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                              {noteItem.pdfFileName}
                            </code>
                          </div>

                          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '8px 12px', fontSize: 12.5 }}
                              onClick={() => {
                                setActiveSubjectModal(null);
                                onOpenReader(noteItem.id || activeSubjectModal.subjectCode);
                              }}
                            >
                              <Eye size={14} /> {lang === 'hi' ? 'ऑनलाइन पढ़ें' : 'Read Online'}
                            </button>

                            <a 
                              href={encodedPdfUrl} 
                              download={noteItem.pdfFileName}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ padding: '8px 12px', fontSize: 12.5, textDecoration: 'none' }}
                            >
                              <Download size={14} /> {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
                            </a>
                          </div>
                        </>
                      ) : (
                        <div style={{ width: '100%', marginTop: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '10px 12px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 600
                          }}>
                            <Clock size={15} />
                            <span>
                              {lang === 'hi' ? 'विल बी अपलोडेड सून (जल्द ही अपलोड किया जाएगा)' : 'Will be uploaded soon'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
