import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Lock, LogIn, ShieldAlert, ArrowRight } from 'lucide-react';

const AuthPromptModal = ({ isOpen, onClose, onGoToLogin }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(6px)',
      zIndex: 2500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--paper-line)',
        borderRadius: 16,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: 440,
        padding: '30px 24px',
        textAlign: 'center',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        <div style={{
          width: 60, height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 16px rgba(59, 130, 246, 0.35)'
        }}>
          <Lock size={28} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'var(--ink)' }}>
          {lang === 'hi' ? 'साइन इन आवश्यक है' : 'Sign In Required'}
        </h2>

        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px' }}>
          {lang === 'hi'
            ? 'BPSC TRE अभ्यास प्रश्न, विषयवार टेस्ट, मॉक टेस्ट और D.El.Ed नोट्स का उपयोग करने के लिए कृपया पहले साइन इन करें।'
            : 'Please sign in first to access BPSC TRE practice questions, subject tests, mock tests, and D.El.Ed notes.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 15,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 10
            }}
            onClick={() => {
              onClose();
              onGoToLogin();
            }}
          >
            <LogIn size={18} />
            {lang === 'hi' ? 'प्रोफ़ाइल में जाकर साइन इन करें' : 'Go to Profile & Sign In'}
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: 13.5,
              fontWeight: 500,
              background: 'transparent',
              color: 'var(--ink-soft)',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            {lang === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
