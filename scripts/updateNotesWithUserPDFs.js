const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));

const publicNotesDir = path.join(rootDir, 'server', 'public', 'notes');
const clientPublicNotes = path.join(rootDir, 'client', 'public', 'notes');

if (!fs.existsSync(publicNotesDir)) fs.mkdirSync(publicNotesDir, { recursive: true });
if (!fs.existsSync(clientPublicNotes)) fs.mkdirSync(clientPublicNotes, { recursive: true });

// Exact 9 PDF files present in user's root folder (belonging to 2nd Year S-Series):
const uploadedPdfs = [
  { name: 'Bihar D.El.Ed S1 English1.pdf', code: 'S-01', lang: 'en', opt: 1 },
  { name: 'Bihar D.El.Ed S1 English2.pdf', code: 'S-01', lang: 'en', opt: 2 },
  { name: 'Bihar D.El.Ed S1 HINDI1.pdf', code: 'S-01', lang: 'hi', opt: 1 },
  { name: 'Bihar D.El.Ed S1 HINDI2.pdf', code: 'S-01', lang: 'hi', opt: 2 },
  { name: 'Bihar D.El.Ed S2 English1.pdf', code: 'S-02', lang: 'en', opt: 1 },
  { name: 'Bihar D.El.Ed S4 English1.pdf', code: 'S-04', lang: 'en', opt: 1 },
  { name: 'Bihar D.El.Ed S5 English1.pdf', code: 'S-05', lang: 'en', opt: 1 },
  { name: 'Bihar D.El.Ed S6 English1.pdf', code: 'S-06', lang: 'en', opt: 1 },
  { name: 'Bihar D.El.Ed S8 English1.pdf', code: 'S-08', lang: 'en', opt: 1 }
];

console.log('--- Syncing PDF assets ---');
uploadedPdfs.forEach(f => {
  const src = path.join(rootDir, f.name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicNotesDir, f.name));
    fs.copyFileSync(src, path.join(clientPublicNotes, f.name));
    console.log(`Synced: ${f.name} (${fs.statSync(src).size} bytes)`);
  }
});

// 1st Year Subjects (12 Subjects: F-01 to F-12)
const firstYearSubjects = [
  { code: 'F-01', en: 'Understanding of Society, Education and Curriculum (F-01)', hi: 'समाज, शिक्षा और पाठ्यचर्या की समझ (F-01)' },
  { code: 'F-02', en: 'Childhood and Child Development (F-02)', hi: 'बचपन और बाल विकास (F-02)' },
  { code: 'F-03', en: 'Early Childhood Care and Education (F-03)', hi: 'प्रारंभिक बाल्यावस्था देखभाल और शिक्षा (F-03)' },
  { code: 'F-04', en: 'School Culture, Change and Teacher Development (F-04)', hi: 'विद्यालय संस्कृति, परिवर्तन और शिक्षक विकास (F-04)' },
  { code: 'F-05', en: 'Understanding Language and Early Language Development (F-05)', hi: 'भाषा की समझ तथा आरंभिक भाषा विकास (F-05)' },
  { code: 'F-06', en: 'Understanding Pedagogy in Education (F-06)', hi: 'शिक्षा में शिक्षाशास्त्र की समझ (F-06)' },
  { code: 'F-07', en: 'Pedagogy of Mathematics - 1 (Primary Level) (F-07)', hi: 'गणित का शिक्षाशास्त्र - 1 (प्राथमिक स्तर) (F-07)' },
  { code: 'F-08', en: 'Pedagogy of Hindi - 1 (Primary Level) (F-08)', hi: 'हिंदी का शिक्षाशास्त्र - 1 (प्राथमिक स्तर) (F-08)' },
  { code: 'F-09', en: 'Proficiency in English (F-09)', hi: 'अंग्रेज़ी में दक्षता (F-09)' },
  { code: 'F-10', en: 'Pedagogy of Environmental Studies (F-10)', hi: 'पर्यावरण अध्ययन का शिक्षाशास्त्र (F-10)' },
  { code: 'F-11', en: 'Art Integrated Education (F-11)', hi: 'कला समेकित शिक्षा (F-11)' },
  { code: 'F-12', en: 'ICT in Education (F-12)', hi: 'सूचना एवं संचार प्रौद्योगिकी (F-12)' }
];

// 2nd Year Subjects (9 Subjects: S-01 to S-09)
const secondYearSubjects = [
  { code: 'S-01', en: 'Contemporary Indian Society and Education (S-01)', hi: 'समकालीन भारतीय समाज में शिक्षा (S-01)' },
  { code: 'S-02', en: 'Cognition, Learning and Child Development (S-02)', hi: 'संज्ञान, सीखना और बाल विकास (S-02)' },
  { code: 'S-03', en: 'Work and Education (S-03)', hi: 'कार्य और शिक्षा (S-03)' },
  { code: 'S-04', en: 'Understanding of the Self (S-04)', hi: 'स्व की समझ (S-04)' },
  { code: 'S-05', en: 'Health, Yoga, Physical Education in School (S-05)', hi: 'स्वास्थ्य, योग एवं शारीरिक शिक्षा (S-05)' },
  { code: 'S-06', en: 'Pedagogy of English (Primary Level) (S-06)', hi: 'अंग्रेज़ी का शिक्षाशास्त्र (S-06)' },
  { code: 'S-07', en: 'Pedagogy of Mathematics - 2 (Primary Level) (S-07)', hi: 'गणित का शिक्षाशास्त्र - 2 (प्राथमिक स्तर) (S-07)' },
  { code: 'S-08', en: 'Pedagogy of Hindi - 2 (Primary Level) (S-08)', hi: 'हिंदी का शिक्षाशास्त्र - 2 (प्राथमिक स्तर) (S-08)' },
  { code: 'S-09', en: 'Pedagogy of Upper Primary Level (S-09)', hi: 'उच्च प्राथमिक स्तर का शिक्षाशास्त्र (S-09)' }
];

const buildDataset = () => {
  const notes = [];

  // 1st Year Notes (F-Series: F-01 to F-12)
  firstYearSubjects.forEach(subj => {
    ['hi', 'en'].forEach(lang => {
      notes.push({
        year: '1st',
        subjectCode: subj.code,
        subjectNameEn: subj.en,
        subjectNameHi: subj.hi,
        language: lang,
        optionNumber: 1,
        pdfFileName: '',
        pdfUrl: '',
        author: 'AbhyasTRE',
        descriptionEn: 'Will be uploaded soon',
        descriptionHi: 'जल्द ही अपलोड किया जाएगा',
        isAvailable: false,
        units: []
      });
    });
  });

  // 2nd Year Notes (S-Series: S-01 to S-09)
  secondYearSubjects.forEach(subj => {
    const matches = uploadedPdfs.filter(u => u.code === subj.code);

    if (matches.length > 0) {
      matches.forEach(m => {
        notes.push({
          year: '2nd',
          subjectCode: subj.code,
          subjectNameEn: subj.en,
          subjectNameHi: subj.hi,
          language: m.lang,
          optionNumber: m.opt,
          pdfFileName: m.name,
          pdfUrl: `/notes/${encodeURIComponent(m.name)}`,
          author: 'AEPS Official Notes',
          descriptionEn: `Official D.El.Ed ${subj.code} Notes PDF (${m.name})`,
          descriptionHi: `बिहार D.El.Ed ${subj.code} अध्ययन नोट्स (${m.name})`,
          isAvailable: true,
          units: [
            {
              unitNum: 1,
              titleEn: 'Unit 1: Overview & Content',
              titleHi: 'इकाई 1: विषय अवलोकन',
              topics: [
                {
                  titleEn: 'Main Notes Document',
                  titleHi: 'मुख्य अध्ययन नोट्स',
                  contentEn: `Original uploaded PDF file: ${m.name}`,
                  contentHi: `मूल अपलोड की गई पीडीफ़ फ़ाइल: ${m.name}`
                }
              ]
            }
          ]
        });
      });

      if (!matches.some(m => m.lang === 'hi')) {
        notes.push({
          year: '2nd',
          subjectCode: subj.code,
          subjectNameEn: subj.en,
          subjectNameHi: subj.hi,
          language: 'hi',
          optionNumber: 1,
          pdfFileName: '',
          pdfUrl: '',
          author: 'AbhyasTRE',
          descriptionEn: 'Will be uploaded soon',
          descriptionHi: 'जल्द ही अपलोड किया जाएगा',
          isAvailable: false,
          units: []
        });
      }
    } else {
      ['hi', 'en'].forEach(lang => {
        notes.push({
          year: '2nd',
          subjectCode: subj.code,
          subjectNameEn: subj.en,
          subjectNameHi: subj.hi,
          language: lang,
          optionNumber: 1,
          pdfFileName: '',
          pdfUrl: '',
          author: 'AbhyasTRE',
          descriptionEn: 'Will be uploaded soon',
          descriptionHi: 'जल्द ही अपलोड किया जाएगा',
          isAvailable: false,
          units: []
        });
      });
    }
  });

  return notes;
};

const fullNotesList = buildDataset();

const cachePath = path.join(rootDir, 'server', 'data', 'notes_cache.json');
fs.writeFileSync(cachePath, JSON.stringify(fullNotesList, null, 2), 'utf-8');
console.log(`--- Saved ${fullNotesList.length} notes to server/data/notes_cache.json ---`);

mongoose.connect('mongodb://localhost:27017/abhyastre').then(async () => {
  const Note = require(path.join(rootDir, 'server', 'models', 'Note'));
  await Note.deleteMany({});
  await Note.insertMany(fullNotesList);
  console.log(`--- Seeded ${fullNotesList.length} notes into MongoDB ---`);
  mongoose.disconnect();
}).catch(err => {
  console.warn('MongoDB seed skipped/error:', err.message);
});
