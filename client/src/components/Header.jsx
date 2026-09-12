import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Home, User, Sun, Moon, History } from 'lucide-react';

const Header = ({ 
  currentTab, 
  onSelectTab, 
  theme, 
  onToggleTheme, 
  currentLevel, 
  levelInfo, 
  onGoHome,
  onToggleHistory 
}) => {
  const { lang, setLang } = useLanguage();

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="brand" onClick={() => onSelectTab('practice')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/favicon.svg" alt="AbhyasTRE Logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <div>
            <span className="mark" style={{ display: 'block' }}>AbhyasTRE</span>
            <span className="sub">BPSC Teacher Recruitment · Exam Prep</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="site-nav">
          <div 
            className={`bn-item ${currentTab === 'practice' ? 'active' : ''}`}
            onClick={() => onSelectTab('practice')}
          >
            <Home size={17} />
            <span lang-hi={lang === 'hi' ? '' : undefined}>
              {lang === 'hi' ? 'अभ्यास (Practice)' : 'Practice'}
            </span>
          </div>

          <div 
            className={`bn-item ${currentTab === 'notes' ? 'active' : ''}`}
            onClick={() => onSelectTab('notes')}
          >
            <BookOpen size={17} />
            <span lang-hi={lang === 'hi' ? '' : undefined}>
              {lang === 'hi' ? 'D.El.Ed नोट्स' : 'D.El.Ed Notes'}
            </span>
          </div>

          <div 
            className={`bn-item ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => onSelectTab('profile')}
          >
            <User size={17} />
            <span lang-hi={lang === 'hi' ? '' : undefined}>
              {lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
            </span>
          </div>
        </nav>

        {/* Topbar Actions */}
        <div className="topbar-right">
          {onToggleHistory && (
            <button className="icon-btn" title="Attempt History" onClick={onToggleHistory}>
              <History size={16} />
            </button>
          )}

          <button className="icon-btn" onClick={onToggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="lang-toggle">
            <button 
              className={lang === 'en' ? 'active' : ''} 
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button 
              className={lang === 'hi' ? 'active' : ''} 
              onClick={() => setLang('hi')}
            >
              हिं
            </button>
          </div>

          <div 
            className="avatar-btn" 
            onClick={() => onSelectTab('profile')} 
            title="Profile"
          >
            {(() => {
              try {
                const saved = localStorage.getItem('abhyastre_user');
                const u = saved ? JSON.parse(saved) : null;
                if (u && u.isLoggedIn && u.name) return u.name.charAt(0).toUpperCase();
              } catch(e) {}
              return <User size={16} />;
            })()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
