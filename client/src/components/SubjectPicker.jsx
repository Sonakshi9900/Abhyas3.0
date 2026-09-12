import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Target, Sparkles, ArrowLeft, ArrowRight, Layers, FileText, ChevronRight, X } from 'lucide-react';
import { API_BASE } from '../config';

const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', nameHi: 'गणित', count: 16 },
  { name: 'General Science', nameHi: 'सामान्य विज्ञान', count: 16 },
  { name: 'Current Affairs', nameHi: 'सामयिकी एवं समसामयिकी', count: 16 },
  { name: 'Geography', nameHi: 'भूगोल एवं वातावरण', count: 12 },
  { name: 'Indian National Movement', nameHi: 'भारतीय राष्ट्रीय आंदोलन', count: 14 },
  { name: 'Polity', nameHi: 'भारतीय संविधान एवं राजनीति', count: 14 },
  { name: 'Environment', nameHi: 'पर्यावरण अध्ययन', count: 16 },
  { name: 'Reasoning', nameHi: 'मानसिक क्षमता एवं तर्कशक्ति', count: 16 },
  { name: 'Hindi', nameHi: 'हिन्दी भाषा एवं साहित्य', count: 22 },
  { name: 'English', nameHi: 'अंग्रेजी भाषा (English)', count: 8 }
];

// Topic-wise Breakdown for All BPSC TRE Subjects
const SUBJECT_TOPICS = {
  'Mathematics': [
    { en: 'Work and Time', hi: 'समय और कार्य' },
    { en: 'Pipes and Cisterns', hi: 'नल और टंकी' },
    { en: 'Time, Speed and Distance', hi: 'समय, चाल और दूरी' },
    { en: 'Train, Boat and Stream', hi: 'रेलगाड़ी, नाव और धारा' },
    { en: 'Percentage', hi: 'प्रतिशत' },
    { en: 'Profit and Loss', hi: 'लाभ और हानि' },
    { en: 'Ratio and Proportion', hi: 'अनुपात और समानुपात' },
    { en: 'Simple Interest', hi: 'साधारण ब्याज' },
    { en: 'Compound Interest', hi: 'चक्रवृद्धि ब्याज' },
    { en: 'Number System & Simplification', hi: 'संख्या पद्धति एवं सरलीकरण' },
    { en: 'Average & Ages', hi: 'औसत एवं आयु संबंधी प्रश्न' },
    { en: 'Mixture and Alligation', hi: 'मिश्रण एवं पृथक्कीकरण' },
    { en: 'Algebra', hi: 'बीजगणित' },
    { en: 'Mensuration 2D', hi: 'क्षेत्रमिति 2D' },
    { en: 'Mensuration 3D', hi: 'क्षेत्रमिति 3D' },
    { en: 'Trigonometry', hi: 'त्रिकोणमिति' },
    { en: 'Height and Distance', hi: 'ऊँचाई और दूरी' },
    { en: 'Geometry', hi: 'ज्यामिति' },
    { en: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति' },
    { en: 'Statistics & Probability', hi: 'सांख्यिकी और प्रायिकता' }
  ],
  'General Science': [
    { en: 'Physics: Motion, Force & Energy', hi: 'भौतिकी: गति, बल एवं ऊर्जा' },
    { en: 'Physics: Light, Sound & Electricity', hi: 'भौतिकी: प्रकाश, ध्वनि एवं विद्युत' },
    { en: 'Chemistry: Matter & Chemical Reactions', hi: 'रसायन: पदार्थ एवं रासायनिक अभिक्रियाएँ' },
    { en: 'Chemistry: Metals, Non-Metals & Acids', hi: 'रसायन: धातु, अधातु, अम्ल व क्षार' },
    { en: 'Biology: Human Body & Physiology', hi: 'जीव विज्ञान: मानव शरीर व क्रिया विज्ञान' },
    { en: 'Biology: Plants, Nutrition & Diseases', hi: 'जीव विज्ञान: पादप जगत, पोषण व बीमारियाँ' }
  ],
  'Indian National Movement': [
    { en: '1857 Revolt & Freedom Struggle', hi: '1857 का प्रथम स्वतंत्रता संग्राम' },
    { en: 'INC Formation & Era of Moderates', hi: 'कांग्रेस की स्थापना एवं उदारवादी युग' },
    { en: 'Swadeshi Movement & Bengal Partition (1905)', hi: 'स्वदेशी आंदोलन एवं बंगाल विभाजन' },
    { en: 'Gandhian Era & Civil Disobedience', hi: 'गांधीवादी युग एवं सविनय अवज्ञा आंदोलन' },
    { en: 'Quit India Movement (1942) & Role of Bihar', hi: 'भारत छोड़ो आंदोलन एवं बिहार की भूमिका' }
  ],
  'Geography': [
    { en: 'Physical Geography & Solar System', hi: 'भौतिक भूगोल एवं सौरमंडल' },
    { en: 'Indian Geography: Rivers & Mountains', hi: 'भारत का भूगोल: नदियाँ एवं पर्वत' },
    { en: 'Indian Climate & Soils', hi: 'भारत की जलवायु एवं मिट्टियाँ' },
    { en: 'Geography of Bihar: Rivers & Resources', hi: 'बिहार का भूगोल: नदियाँ एवं संसाधन' }
  ],
  'Polity': [
    { en: 'Making of Constitution & Preamble', hi: 'संविधान निर्माण एवं प्रस्तावना' },
    { en: 'Fundamental Rights & Duties', hi: 'मौलिक अधिकार एवं कर्तव्य' },
    { en: 'President, Governor & Executive', hi: 'राष्ट्रपति, राज्यपाल एवं कार्यपालिका' },
    { en: 'Parliament & State Legislature', hi: 'संसद एवं राज्य विधानमंडल' },
    { en: 'Panchayati Raj & Local Self-Govt', hi: 'पंचायती राज एवं स्थानीय स्वशासन' }
  ],
  'Reasoning': [
    { en: 'Analogy', hi: 'सादृश्यता' },
    { en: 'Classification', hi: 'वर्गीकरण' },
    { en: 'Series', hi: 'श्रृंखला परीक्षण' },
    { en: 'Coding-Decoding', hi: 'कोडिंग-डिकोडिंग' },
    { en: 'Blood Relations', hi: 'रक्त संबंध' },
    { en: 'Direction & Distance', hi: 'दिशा एवं दूरी' },
    { en: 'Order & Ranking', hi: 'क्रम व्यवस्था एवं रैंकिंग' },
    { en: 'Mathematical Operations', hi: 'गणितीय संक्रियाएँ' },
    { en: 'Syllogism', hi: 'न्याय निगमन' },
    { en: 'Venn Diagram', hi: 'वेन आरेख' },
    { en: 'Dice & Cube', hi: 'पासा एवं घन' },
    { en: 'Calendar & Clock', hi: 'कैलेंडर एवं घड़ी' },
    { en: 'Non-Verbal Reasoning', hi: 'अशाब्दिक तर्कशक्ति' },
    { en: 'Statement & Assumption', hi: 'कथन एवं पूर्वधारणा' },
    { en: 'Statement & Conclusion', hi: 'कथन एवं निष्कर्ष' },
    { en: 'Seating Arrangement', hi: 'बैठक व्यवस्था' }
  ],
  'Hindi': [
    { en: 'Varnamala & Sandhi', hi: 'वर्णमाला एवं संधि' },
    { en: 'Samas & Upsarg-Pratyay', hi: 'समास, उपसर्ग व प्रत्यय' },
    { en: 'Sangya, Sarvanam & Visheshon', hi: 'संज्ञा, सर्वनाम व विशेषण' },
    { en: 'Vakya Shuddhi, Muhavare & Lokoktiyan', hi: 'वाक्य शुद्धि, मुहावरे व लोकोक्तियाँ' }
  ],
  'English': [
    { en: 'Parts of Speech & Tenses', hi: 'Parts of Speech & Tenses' },
    { en: 'Subject-Verb Agreement & Articles', hi: 'Subject-Verb Agreement & Articles' },
    { en: 'Vocabulary: Synonyms & Antonyms', hi: 'Vocabulary: Synonyms & Antonyms' }
  ],
  'Current Affairs': [
    { en: 'National & International Events', hi: 'राष्ट्रीय एवं अंतरराष्ट्रीय घटनाक्रम' },
    { en: 'Bihar Current Affairs & Govt Schemes', hi: 'बिहार समसामयिकी एवं सरकारी योजनाएँ' },
    { en: 'Awards, Sports & Appointments', hi: 'पुरस्कार, खेलकूद एवं नियुक्तियाँ' }
  ],
  'Environment': [
    { en: 'Ecosystem & Biodiversity', hi: 'पारिस्थितिकी तंत्र एवं जैव विविधता' },
    { en: 'Pollution & Climate Change', hi: 'प्रदूषण एवं जलवायु परिवर्तन' },
    { en: 'National Parks & Conservation', hi: 'राष्ट्रीय उद्यान एवं संरक्षण' }
  ]
};

const SubjectPicker = ({ levelCode, onStartSubjectQuiz, onBack }) => {
  const { lang } = useLanguage();
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [activeSubjectModal, setActiveSubjectModal] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/questions/subjects?level=${levelCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const updated = DEFAULT_SUBJECTS.map(s => {
            const match = data.data.find(d => d.name.toLowerCase() === s.name.toLowerCase());
            return {
              ...s,
              count: match ? match.count : s.count
            };
          });
          setSubjects(updated);
        }
      })
      .catch(() => {});
  }, [levelCode]);

  return (
    <div className="screen">
      <h1 className="hero">{lang === 'hi' ? 'अपना विषय एवं टॉपिक चुनें' : 'Choose subject & topic'}</h1>
      <p className="lede">
        {lang === 'hi'
          ? 'BPSC पाठ्यक्रम के अनुसार विषय एवं उनके विभिन्न टॉपिकवार प्रश्नों का अभ्यास करें।'
          : 'Practice subject-wise and topic-wise PYQs as per BPSC official exam syllabus.'}
      </p>

      {/* Subject List Grid */}
      <div>
        {subjects.map((s, idx) => (
          <div
            key={idx}
            className={`subject-row ${s.count === 0 ? 'empty' : ''}`}
            onClick={() => s.count > 0 && setActiveSubjectModal(s)}
          >
            <div>
              <span className="name">{lang === 'hi' ? s.nameHi : s.name}</span>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Layers size={13} />
                {(SUBJECT_TOPICS[s.name] || []).length} {lang === 'hi' ? 'टॉपिक्स उपलब्ध' : 'topics available'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="count">
                {s.count} {lang === 'hi' ? 'प्रश्न' : 'questions'}
              </span>
              <ChevronRight size={18} style={{ color: 'var(--ink-soft)' }} />
            </div>
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

      {/* Topic Selection Modal */}
      {activeSubjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(18, 20, 28, 0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div 
            className="structure-card" 
            style={{ 
              maxWidth: 540, 
              width: '100%', 
              margin: 0, 
              borderRadius: 12,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'var(--card)',
              border: '1px solid var(--paper-line)',
              color: 'var(--ink)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <span className="sc-title" style={{ display: 'inline-block', marginBottom: 4 }}>
                  {lang === 'hi' ? 'टॉपिक का चयन करें' : 'Select Topic'}
                </span>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces', fontSize: 19, color: 'var(--ink)' }}>
                  {lang === 'hi' ? activeSubjectModal.nameHi : activeSubjectModal.name}
                </h3>
              </div>
              <button 
                className="icon-btn" 
                style={{ width: 28, height: 28, color: 'var(--ink)' }} 
                onClick={() => setActiveSubjectModal(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>
              {lang === 'hi'
                ? 'अभ्यास शुरू करने के लिए संपूर्ण विषय चुनें या किसी विशेष टॉपिक पर क्लिक करें:'
                : 'Choose all topics or click a specific topic to start practice:'}
            </p>

            {/* Topic Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Option 1: Practice All Topics */}
              <div
                className="settings-row"
                style={{
                  padding: '14px 16px',
                  background: 'var(--brand)',
                  color: 'white',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => {
                  const subjectName = activeSubjectModal.name;
                  setActiveSubjectModal(null);
                  onStartSubjectQuiz(subjectName, 'all');
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    ⚡ {lang === 'hi' ? 'सम्पूर्ण विषय प्रश्नोत्तरी (सभी टॉपिक्स)' : 'Practice All Topics (Full Subject)'}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                    {lang === 'hi' ? `${activeSubjectModal.nameHi} के सभी प्रश्नों का अभ्यास` : `All questions for ${activeSubjectModal.name}`}
                  </div>
                </div>
                <ChevronRight size={18} />
              </div>

              {/* Specific Topics */}
              {(SUBJECT_TOPICS[activeSubjectModal.name] || []).map((topic, tIdx) => (
                <div
                  key={tIdx}
                  className="settings-row"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--paper)',
                    border: '1px solid var(--paper-line)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => {
                    const subjectName = activeSubjectModal.name;
                    const topicName = topic.en;
                    setActiveSubjectModal(null);
                    onStartSubjectQuiz(subjectName, topicName);
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                      {lang === 'hi' ? topic.hi : topic.en}
                    </span>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                      {lang === 'hi' ? topic.en : topic.hi}
                    </div>
                  </div>

                  <span className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}>
                    {lang === 'hi' ? 'अभ्यास करें' : 'Practice'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectPicker;
