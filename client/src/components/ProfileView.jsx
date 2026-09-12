import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, Moon, Sun, Award, LogOut, CheckCircle, AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck, LogIn } from 'lucide-react';
import { API_BASE } from '../config';

const ProfileView = ({ theme, onToggleTheme, userStats, autoOpenAuthModal = false, onUserChange }) => {
  const { lang } = useLanguage();
  
  // Persisted User Login State in localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('abhyastre_user');
      return saved ? JSON.parse(saved) : { name: 'Candidate User', email: '', isLoggedIn: false };
    } catch (e) {
      return { name: 'Candidate User', email: '', isLoggedIn: false };
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [showAuthModal, setShowAuthModal] = useState(autoOpenAuthModal || !user.isLoggedIn);
  
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Strict Email Validation Regex (must have @ and domain extension e.g. .com, .in, .org)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(emailInput.trim());

  // Password Validation Rules (Alphanumeric: Capital + Digit + Special Char + Length >= 6)
  const hasCapital = /[A-Z]/.test(passwordInput);
  const hasDigit = /[0-9]/.test(passwordInput);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordInput);
  const hasMinLength = passwordInput.length >= 6;
  const isPasswordValid = hasCapital && hasDigit && hasSpecial && hasMinLength;

  const isFormValid = isEmailValid && isPasswordValid && (authMode === 'login' || nameInput.trim().length > 0);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!isEmailValid) {
      setAuthError(
        lang === 'hi' 
          ? 'कृपया एक सही ईमेल आईडी दर्ज करें (जैसे: candidate@example.com)।' 
          : 'Please enter a valid email address with domain extension (e.g. candidate@example.com).'
      );
      return;
    }

    if (!isPasswordValid) {
      setAuthError(
        lang === 'hi' 
          ? 'पासवर्ड में कम से कम एक बड़ा अक्षर (A-Z), एक अंक (0-9), और एक विशेष वर्ण (!@#$%^&*) होना आवश्यक है।' 
          : 'Password must be alphanumeric and contain at least 1 Capital Letter (A-Z), 1 Digit (0-9), and 1 Special Character (!@#$%^&*).'
      );
      return;
    }

    try {
      const endpoint = authMode === 'login' ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const payload = authMode === 'login'
        ? { email: emailInput.trim(), password: passwordInput }
        : { name: nameInput.trim() || emailInput.trim().split('@')[0], email: emailInput.trim(), password: passwordInput };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.success) {
        setAuthError(data.message || (lang === 'hi' ? 'प्रमाणीकरण विफल रहा।' : 'Authentication failed.'));
        return;
      }

      const loggedInUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isLoggedIn: true
      };

      if (data.token) {
        localStorage.setItem('abhyastre_token', data.token);
      }
      localStorage.setItem('abhyastre_user', JSON.stringify(loggedInUser));

      setUser(loggedInUser);
      if (onUserChange) onUserChange(loggedInUser);

      setShowAuthModal(false);
      setPasswordInput('');
      setEmailInput('');
      setNameInput('');
    } catch (err) {
      setAuthError(lang === 'hi' ? 'सर्वर से कनेक्ट करने में त्रुटि।' : 'Failed to connect to authentication server.');
    }
  };

  const handleLogout = () => {
    const loggedOutState = { name: 'Candidate User', email: '', isLoggedIn: false };
    setUser(loggedOutState);
    localStorage.removeItem('abhyastre_user');
    localStorage.removeItem('abhyastre_token');
    if (onUserChange) onUserChange(loggedOutState);
  };

  const accuracy = userStats && userStats.totalQ > 0 
    ? Math.round((userStats.correct / userStats.totalQ) * 100) 
    : 0;

  return (
    <div className="screen">
      <h1 className="hero" lang-hi={lang === 'hi' ? '' : undefined}>
        {lang === 'hi' ? 'आपका खाता एवं सेटिंग्स' : 'Your Account & Settings'}
      </h1>

      {/* Theme-Aware Profile Card */}
      <div 
        className="profile-hero" 
        style={{ 
          background: 'var(--card)', 
          border: '1px solid var(--paper-line)', 
          padding: 20, 
          borderRadius: 12,
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div 
          className="p-avatar" 
          style={{ 
            background: user.isLoggedIn ? '#2563eb' : (theme === 'dark' ? '#272c3a' : '#e2e8f0'), 
            color: user.isLoggedIn ? '#ffffff' : 'var(--ink)', 
            fontWeight: 700, 
            fontSize: 22,
            width: 54,
            height: 54,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {user.isLoggedIn && user.name ? user.name.charAt(0).toUpperCase() : <User size={26} style={{ color: 'var(--ink)' }} />}
        </div>

        <div style={{ flex: 1 }}>
          <div className="p-name" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
            {user.isLoggedIn ? user.name : (lang === 'hi' ? 'लॉग इन नहीं हैं' : 'Not Signed In')}
          </div>
          
          <div className="p-email" style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>
            {user.isLoggedIn 
              ? user.email 
              : (lang === 'hi' ? 'अपनी प्रगति सहेजने के लिए लॉग इन करें' : 'Sign in to save test history and candidate profile')}
          </div>

          {!user.isLoggedIn && (
            <div style={{ marginTop: 6 }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5, 
                fontSize: 11.5, 
                fontWeight: 600, 
                padding: '3px 10px', 
                borderRadius: 12, 
                background: theme === 'dark' ? '#312e81' : '#e0e7ff', 
                color: theme === 'dark' ? '#c7d2fe' : '#3730a3',
                border: theme === 'dark' ? '1px solid #4338ca' : '1px solid #c7d2fe'
              }}>
                <LogIn size={12} /> {lang === 'hi' ? 'साइन इन आवश्यक' : 'Sign In Required'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stat-row" style={{ marginTop: 16 }}>
        <div className="stat">
          <div className="n">{userStats ? userStats.attempts : 0}</div>
          <div className="l">{lang === 'hi' ? 'टेस्ट दिए (TESTS TAKEN)' : 'TESTS TAKEN'}</div>
        </div>
        <div className="stat correct">
          <div className="n">{accuracy}%</div>
          <div className="l">{lang === 'hi' ? 'औसत सटीकता (ACCURACY)' : 'ACCURACY'}</div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="section-label" style={{ marginTop: 20 }}>
        {lang === 'hi' ? 'सेटिंग्स' : 'SETTINGS'}
      </div>

      <div className="settings-row">
        <div>
          <div className="s-label">{lang === 'hi' ? 'डार्क मोड (Dark Mode)' : 'Dark Mode'}</div>
          <div className="s-sub">{lang === 'hi' ? 'रात में पढ़ने के लिए आरामदायक थीम' : 'Easier on the eyes at night'}</div>
        </div>
        <div 
          className={`toggle-switch ${theme === 'dark' ? 'on' : ''}`}
          onClick={onToggleTheme}
        >
          <div className="knob"></div>
        </div>
      </div>

      {/* Auth Actions (Login / Logout) */}
      <div style={{ marginTop: 24 }}>
        {!user.isLoggedIn ? (
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={() => { setAuthError(''); setShowAuthModal(true); }}
          >
            <User size={18} /> {lang === 'hi' ? 'लॉग इन करें / नया खाता बनाएं' : 'Sign In / Create Account'}
          </button>
        ) : (
          <button 
            className="btn btn-danger" 
            style={{ width: '100%', padding: '12px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            onClick={handleLogout}
          >
            <LogOut size={18} /> {lang === 'hi' ? 'लॉग आउट करें (Log Out)' : 'Log Out'}
          </button>
        )}
      </div>

      {/* Auth Modal with Theme-Aware High Contrast Colors */}
      {showAuthModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(18, 20, 28, 0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div 
            className="structure-card" 
            style={{ 
              maxWidth: 460, 
              width: '100%', 
              margin: 0, 
              borderRadius: 12,
              background: 'var(--card)',
              border: '1px solid var(--paper-line)',
              color: 'var(--ink)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: 'Fraunces', fontSize: 20, color: 'var(--ink)' }}>
                {authMode === 'login' 
                  ? (lang === 'hi' ? 'लॉग इन करें' : 'Candidate Sign In') 
                  : (lang === 'hi' ? 'नया खाता बनाएं' : 'Create Candidate Account')}
              </h3>
              <button className="icon-btn" style={{ width: 28, height: 28, color: 'var(--ink)' }} onClick={() => setShowAuthModal(false)}>✕</button>
            </div>

            {authError && (
              <div style={{
                background: theme === 'dark' ? '#391e1d' : '#fef2f2', 
                border: theme === 'dark' ? '1px solid #e1685c' : '1px solid #fca5a5',
                color: theme === 'dark' ? '#fca5a5' : '#991b1b', 
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              {authMode === 'signup' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>
                    {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Anjali Kumari"
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--paper-line)', borderRadius: 8, background: 'var(--paper)', color: 'var(--ink)', fontSize: 14 }}
                  />
                </div>
              )}

              {/* Email Address Input */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>
                    {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Email Address'}
                  </label>
                  {emailInput.length > 0 && (
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: isEmailValid ? '#22c55e' : '#ef4444' }}>
                      {isEmailValid ? '✓ Valid Format' : '✗ Invalid Email Format'}
                    </span>
                  )}
                </div>

                <input 
                  type="email" 
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="candidate@example.com"
                  style={{ 
                    width: '100%', 
                    padding: '11px 14px', 
                    border: emailInput.length === 0 ? '1px solid var(--paper-line)' : isEmailValid ? '1.5px solid #22c55e' : '1.5px solid #ef4444', 
                    borderRadius: 8, 
                    background: 'var(--paper)', 
                    color: 'var(--ink)',
                    fontSize: 14 
                  }}
                />
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
                  {lang === 'hi' ? 'उदाहरण: user@domain.com (सही फॉर्मेट आवश्यक)' : 'Example: user@domain.com (Must include @ and domain)'}
                </div>
              </div>

              {/* Password Section */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>
                  {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', 
                      padding: '11px 40px 11px 14px', 
                      border: passwordInput.length === 0 ? '1px solid var(--paper-line)' : isPasswordValid ? '1.5px solid #22c55e' : '1.5px solid #ef4444', 
                      borderRadius: 8, 
                      background: 'var(--paper)', 
                      color: 'var(--ink)',
                      fontSize: 14 
                    }}
                  />
                  <button 
                    type="button"
                    style={{ position: 'absolute', right: 12, top: 11, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Requirements Checklist */}
                <div style={{ marginTop: 10, fontSize: 12, background: 'var(--paper)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--paper-line)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} style={{ color: 'var(--marigold-deep)' }} />
                    {lang === 'hi' ? 'पासवर्ड सुरक्षा नियम:' : 'Alphanumeric Password Rules:'}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                    <div style={{ color: hasCapital ? '#22c55e' : 'var(--ink-soft)', fontWeight: hasCapital ? 600 : 400, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{hasCapital ? '✓' : '○'}</span> {lang === 'hi' ? '1 बड़ा अक्षर (A-Z)' : '1 Capital Letter (A-Z)'}
                    </div>

                    <div style={{ color: hasDigit ? '#22c55e' : 'var(--ink-soft)', fontWeight: hasDigit ? 600 : 400, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{hasDigit ? '✓' : '○'}</span> {lang === 'hi' ? '1 अंक (0-9)' : '1 Digit (0-9)'}
                    </div>

                    <div style={{ color: hasSpecial ? '#22c55e' : 'var(--ink-soft)', fontWeight: hasSpecial ? 600 : 400, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{hasSpecial ? '✓' : '○'}</span> {lang === 'hi' ? '1 विशेष वर्ण (!@#$)' : '1 Special Char (!@#$)'}
                    </div>

                    <div style={{ color: hasMinLength ? '#22c55e' : 'var(--ink-soft)', fontWeight: hasMinLength ? 600 : 400, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{hasMinLength ? '✓' : '○'}</span> {lang === 'hi' ? 'कम से कम 6 अक्षर' : 'At least 6 chars'}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: 15, 
                  fontWeight: 600,
                  opacity: isFormValid ? 1 : 0.6,
                  cursor: isFormValid ? 'pointer' : 'not-allowed'
                }} 
                type="submit"
                disabled={!isFormValid}
              >
                {authMode === 'login' ? (lang === 'hi' ? 'लॉग इन करें' : 'Log In') : (lang === 'hi' ? 'खाता बनाएं' : 'Sign Up')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--ink-soft)' }}>
              {authMode === 'login' ? (
                <span style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, color: 'var(--marigold-deep)' }} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>
                  {lang === 'hi' ? 'नया खाता बनाएं (Sign Up)' : "Don't have an account? Create one"}
                </span>
              ) : (
                <span style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, color: 'var(--marigold-deep)' }} onClick={() => { setAuthMode('login'); setAuthError(''); }}>
                  {lang === 'hi' ? 'पहले से खाता है? लॉग इन करें' : 'Already have an account? Sign In'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
