import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import LevelSelector, { LEVELS } from './components/LevelSelector';
import Dashboard from './components/Dashboard';
import PaperPicker from './components/PaperPicker';
import SubjectPicker from './components/SubjectPicker';
import YearPicker from './components/YearPicker';
import QuizEngine from './components/QuizEngine';
import ResultAnalytics from './components/ResultAnalytics';
import HistoryDrawer from './components/HistoryDrawer';
import NotesSection from './components/NotesSection';
import NotesReader from './components/NotesReader';
import ProfileView from './components/ProfileView';
import AuthPromptModal from './components/AuthPromptModal';

function AppContent() {
  const [tab, setTab] = useState('practice'); // 'practice' | 'notes' | 'profile'
  const [screen, setScreen] = useState('level'); // 'level' | 'dashboard' | 'papers' | 'subjects' | 'years' | 'quiz' | 'result' | 'notes-detail'
  const [theme, setTheme] = useState(() => localStorage.getItem('abhyastre_theme') || 'light');

  // Track User Login State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('abhyastre_user');
      return saved ? JSON.parse(saved) : { isLoggedIn: false };
    } catch (e) {
      return { isLoggedIn: false };
    }
  });

  // Verify JWT token on application mount
  useEffect(() => {
    const token = localStorage.getItem('abhyastre_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            const verifiedUser = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              isLoggedIn: true
            };
            setUser(verifiedUser);
            localStorage.setItem('abhyastre_user', JSON.stringify(verifiedUser));
          } else {
            localStorage.removeItem('abhyastre_token');
            localStorage.removeItem('abhyastre_user');
            setUser({ isLoggedIn: false });
          }
        })
        .catch(() => {
          // Keep local state if server temporarily unreachable
        });
    }
  }, []);

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [autoOpenProfileAuth, setAutoOpenProfileAuth] = useState(false);

  const [levelCode, setLevelCode] = useState('prt');
  const [paperKey, setPaperKey] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [quizMode, setQuizMode] = useState('practice');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [tagLabel, setTagLabel] = useState('');
  const [resultData, setResultData] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userStats, setUserStats] = useState({ attempts: 0, correct: 0, totalQ: 0 });

  const { lang } = useLanguage();

  // Handle Browser History & Back Button (popstate)
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ screen: 'level', tab: 'practice', levelCode: 'prt' }, '');
    }

    const handlePopState = (event) => {
      if (event.state) {
        if (event.state.screen) setScreen(event.state.screen);
        if (event.state.tab) setTab(event.state.tab);
        if (event.state.levelCode) setLevelCode(event.state.levelCode);
        if (event.state.selectedNoteId !== undefined) setSelectedNoteId(event.state.selectedNoteId);
      } else {
        setScreen('level');
        setTab('practice');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to push history state on navigation
  const navigateTo = (newScreen, extraState = {}) => {
    setScreen(newScreen);
    const nextState = {
      screen: newScreen,
      tab,
      levelCode,
      selectedNoteId,
      ...extraState
    };
    try {
      window.history.pushState(nextState, '');
    } catch (e) {
      console.warn('History pushState failed:', e);
    }
  };

  const handleGoBack = (targetFallback = null) => {
    if (window.history.state && window.history.state.screen !== 'level') {
      window.history.back();
    } else {
      if (targetFallback) {
        setScreen(targetFallback);
      } else {
        setScreen('level');
      }
    }
  };

  // Apply Theme Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('abhyastre_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleUserChange = (updatedUser) => {
    setUser(updatedUser);
    if (!updatedUser.isLoggedIn) {
      setScreen('level');
      setTab('practice');
    }
  };

  const checkAuthGuard = (actionCallback) => {
    if (!user || !user.isLoggedIn) {
      setShowAuthPrompt(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  const handleSelectTab = (newTab) => {
    if (newTab === 'notes' && (!user || !user.isLoggedIn)) {
      setShowAuthPrompt(true);
      return;
    }

    setTab(newTab);
    let nextScreen = screen;
    if (newTab === 'practice') {
      if (screen === 'notes-detail') nextScreen = levelCode ? 'dashboard' : 'level';
    }
    try {
      window.history.pushState({ screen: nextScreen, tab: newTab, levelCode, selectedNoteId }, '');
    } catch(e) {}
  };

  const handleSelectLevel = (code) => {
    checkAuthGuard(() => {
      setLevelCode(code);
      navigateTo('dashboard', { levelCode: code });
    });
  };

  const handleStartSubjectQuiz = (subject, topic = 'all') => {
    checkAuthGuard(() => {
      setLoading(true);
      setSubjectName(subject);
      const mode = 'practice';
      setQuizMode(mode);
      setIsReviewMode(false);

      let apiUrl = `/api/questions?level=${levelCode}&subject=${encodeURIComponent(subject)}`;
      if (topic && topic !== 'all') {
        apiUrl += `&topic=${encodeURIComponent(topic)}`;
      }

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          setLoading(false);
          if (data.success && data.data && data.data.length > 0) {
            setActiveQuestions(data.data);
          } else {
            fetch(`/api/questions?level=${levelCode}`)
              .then(r => r.json())
              .then(d => {
                if (d.data) setActiveQuestions(d.data);
              });
          }
          const topicSuffix = (topic && topic !== 'all') ? ` · ${topic}` : '';
          setTagLabel(`${subject}${topicSuffix} · ${lang === 'hi' ? 'अभ्यास' : 'Practice'}`);
          navigateTo('quiz', { levelCode });
        })
        .catch(err => {
          console.error('Fetch questions error:', err);
          setLoading(false);
        });
    });
  };

  const handleStartMockTest = (year, mode) => {
    checkAuthGuard(() => {
      setLoading(true);
      setQuizMode(mode);
      setIsReviewMode(false);
      const lvlInfo = LEVELS[levelCode] || LEVELS.prt;

      fetch(`/api/questions?level=${levelCode}&year=${year}`)
        .then(res => res.json())
        .then(data => {
          setLoading(false);
          if (data.success && data.data && data.data.length > 0) {
            setActiveQuestions(data.data);
          }
          setTagLabel(`${lang === 'hi' ? lvlInfo.hi : lvlInfo.en} · ${year} PYQ`);
          navigateTo('quiz', { levelCode });
        })
        .catch(err => {
          console.error('Fetch mock questions error:', err);
          setLoading(false);
        });
    });
  };

  const handleFinishQuiz = (attemptSummary) => {
    setResultData(attemptSummary);
    navigateTo('result', { levelCode });

    setUserStats(prev => ({
      attempts: prev.attempts + 1,
      correct: prev.correct + attemptSummary.correct,
      totalQ: prev.totalQ + attemptSummary.totalQuestions
    }));

    const token = localStorage.getItem('abhyastre_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    fetch('/api/attempts/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: attemptSummary.tagLabel,
        level: levelCode,
        mode: attemptSummary.mode,
        answers: attemptSummary.answers.map((ans, idx) => ({
          qNo: attemptSummary.activeQuestions[idx]?.qNo,
          userOption: ans
        })),
        durationSeconds: attemptSummary.durationSeconds
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setResultData(prev => ({
            ...prev,
            serverEvaluatedAttempt: data.data
          }));
        }
      })
      .catch(err => console.warn('Submit attempt API error:', err));
  };

  const handleOpenReader = (noteId) => {
    checkAuthGuard(() => {
      setSelectedNoteId(noteId);
      navigateTo('notes-detail', { selectedNoteId: noteId });
    });
  };

  const currentLevel = screen !== 'level' && screen !== 'notes-detail' ? levelCode : null;

  return (
    <div className="app-container">
      <Header
        currentTab={tab}
        onSelectTab={handleSelectTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentLevel={currentLevel}
        levelInfo={LEVELS[levelCode]}
        onGoHome={() => handleGoBack('level')}
        onToggleHistory={() => checkAuthGuard(() => setHistoryOpen(true))}
      />

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
          {lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
        </div>
      )}

      {!loading && (
        <>
          {/* TAB 1: PRACTICE & QUIZ FLOW */}
          {tab === 'practice' && (
            <>
              {screen === 'level' && (
                <LevelSelector onSelectLevel={handleSelectLevel} />
              )}

              {screen === 'dashboard' && (
                <Dashboard
                  levelCode={levelCode}
                  onSelectSubjectMode={() => checkAuthGuard(() => navigateTo('papers'))}
                  onSelectYearMode={() => checkAuthGuard(() => navigateTo('years'))}
                  onChangeLevel={() => handleGoBack('level')}
                />
              )}

              {screen === 'papers' && (
                <PaperPicker
                  levelCode={levelCode}
                  onSelectPaper={(key) => {
                    checkAuthGuard(() => {
                      setPaperKey(key);
                      navigateTo('subjects');
                    });
                  }}
                  onBack={() => handleGoBack('dashboard')}
                />
              )}

              {screen === 'subjects' && (
                <SubjectPicker
                  levelCode={levelCode}
                  onStartSubjectQuiz={handleStartSubjectQuiz}
                  onBack={() => handleGoBack('papers')}
                />
              )}

              {screen === 'years' && (
                <YearPicker
                  levelCode={levelCode}
                  onStartMockTest={handleStartMockTest}
                  onBack={() => handleGoBack('dashboard')}
                />
              )}

              {screen === 'quiz' && (
                <QuizEngine
                  activeQuestions={activeQuestions}
                  mode={quizMode}
                  tagLabel={tagLabel}
                  isReviewMode={isReviewMode}
                  onFinishQuiz={handleFinishQuiz}
                  onBackToResult={() => navigateTo('result')}
                />
              )}

              {screen === 'result' && (
                <ResultAnalytics
                  resultData={resultData}
                  onStartReview={() => { setIsReviewMode(true); navigateTo('quiz'); }}
                  onPracticeMore={() => navigateTo('dashboard')}
                />
              )}
            </>
          )}

          {/* TAB 2: D.EL.ED NOTES */}
          {tab === 'notes' && (
            <>
              {screen === 'notes-detail' ? (
                <NotesReader
                  noteId={selectedNoteId}
                  onBack={() => handleGoBack('notes')}
                />
              ) : (
                <NotesSection onOpenReader={handleOpenReader} />
              )}
            </>
          )}

          {/* TAB 3: PROFILE */}
          {tab === 'profile' && (
            <ProfileView
              theme={theme}
              onToggleTheme={toggleTheme}
              userStats={userStats}
              autoOpenAuthModal={autoOpenProfileAuth}
              onUserChange={handleUserChange}
            />
          )}
        </>
      )}

      {/* Sign In Required Lock Modal */}
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onGoToLogin={() => {
          setShowAuthPrompt(false);
          setAutoOpenProfileAuth(true);
          setTab('profile');
        }}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <div className="mark">AbhyasTRE</div>
            <div className="fine" lang-hi={lang === 'hi' ? '' : undefined}>
              {lang === 'hi'
                ? 'BPSC शिक्षक भर्ती परीक्षा अभ्यर्थियों के लिए एक स्वतंत्र तैयारी प्लेटफ़ॉर्म — पिछले वर्ष के प्रश्न, मॉक टेस्ट और D.El.Ed नोट्स एक ही जगह।'
                : 'An independent prep platform for BPSC Teacher Recruitment candidates — PYQs, mock tests and D.El.Ed notes in one place.'}
            </div>
          </div>
          <div className="fine" lang-hi={lang === 'hi' ? '' : undefined}>
            {lang === 'hi'
              ? 'BPSC या बिहार शिक्षा विभाग से संबद्ध नहीं।'
              : 'Not affiliated with BPSC or the Bihar Education Department.'}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
