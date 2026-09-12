import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config';

const HistoryDrawer = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('abhyastre_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      fetch(`${API_BASE}/api/attempts/history`, { headers })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setHistory(data.data);
          }
        })
        .catch(() => {
          // Load local storage fallback
          const local = localStorage.getItem('abhyastre_attempts');
          if (local) {
            setHistory(JSON.parse(local));
          }
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(28, 37, 65, 0.6)', zIndex: 2000,
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: 'var(--paper)',
        height: '100%', padding: '20px', overflowY: 'auto',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: 'Fraunces', fontSize: 20 }}>
            {lang === 'hi' ? 'प्रयास इतिहास' : 'Attempt History'}
          </h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        {history.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
            {lang === 'hi' ? 'अभी तक कोई प्रयास रिकॉर्ड नहीं हुआ है।' : 'No test attempts recorded yet.'}
          </p>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="structure-card" style={{ marginBottom: 12, padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                {item.title || 'BPSC TRE Practice'}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 8, display: 'flex', gap: 10 }}>
                <span><Calendar size={12} style={{ display: 'inline', marginRight: 2 }} /> {new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                <span><Clock size={12} style={{ display: 'inline', marginRight: 2 }} /> {item.mode === 'test' ? 'Test Mode' : 'Practice'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                <span>{lang === 'hi' ? 'अंक:' : 'Score:'} <b style={{ color: 'var(--correct)' }}>{item.correctCount}</b> / {item.totalQuestions}</span>
                {item.netMarks !== undefined && (
                  <span style={{ color: 'var(--ink)' }}>{lang === 'hi' ? 'अंक:' : 'Marks:'} <b>{item.netMarks}</b></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryDrawer;
