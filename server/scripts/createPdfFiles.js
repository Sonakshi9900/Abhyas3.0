const fs = require('fs');
const path = require('path');

function createMinimalPdfBuffer(title, subjectCode, lang, optNum) {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 180 >>
stream
BT
/F1 18 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
50 690 Td
(Subject Code: ${subjectCode} | Language: ${lang} | Note Option: #${optNum}) Tj
50 660 Td
(Bihar D.El.Ed Diploma Course Official Notes) Tj
50 630 Td
(Future Online Classes Sonpur & Future Deled Wallah) Tj
50 600 Td
(Downloaded via AbhyasTRE Preparation Platform) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000000467 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
544
%%EOF`;

  return Buffer.from(content, 'utf-8');
}

const pdfFilesToCreate = [
  // S-01
  { file: 'BIHAR D.El.Ed[S-01][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-01 (Hindi) Note 1 - AEPS Official', code: 'S-01', lang: 'Hindi', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-01][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-01 (English) Note 1 - AEPS Official', code: 'S-01', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-01][(en)][2].pdf', title: 'Bihar D.El.Ed 2nd Year - S-01 (English) Note 2 - Future Deled Wallah', code: 'S-01', lang: 'English', opt: 2 },
  { file: 'BIHAR D.El.Ed[S-01][(hi)][2].pdf', title: 'Bihar D.El.Ed 2nd Year - S-01 (Hindi) Note 2 - Future Online Classes', code: 'S-01', lang: 'Hindi', opt: 2 },

  // S-02
  { file: 'BIHAR D.El.Ed[S-02][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-02 (Hindi) Note 1 - AEPS Official', code: 'S-02', lang: 'Hindi', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-02][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-02 (English) Note 1 - AEPS Official', code: 'S-02', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-02][(en)][2].pdf', title: 'Bihar D.El.Ed 2nd Year - S-02 (English) Note 2 - Future Deled Wallah', code: 'S-02', lang: 'English', opt: 2 },
  { file: 'BIHAR D.El.Ed[S-02][(hi)][2].pdf', title: 'Bihar D.El.Ed 2nd Year - S-02 (Hindi) Note 2 - Future Online Classes', code: 'S-02', lang: 'Hindi', opt: 2 },

  // S-04: Understanding of the Self
  { file: 'BIHAR D.El.Ed[S-04][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-04 Understanding of the Self (English Note 1)', code: 'S-04', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-04][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-04 स्व की समझ (Hindi Note 1)', code: 'S-04', lang: 'Hindi', opt: 1 },

  // S-05: Health, Yoga, Physical Education in School
  { file: 'BIHAR D.El.Ed[S-05][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-05 Health, Yoga & Physical Education (English Note 1)', code: 'S-05', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-05][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-05 स्वास्थ्य, योग एवं शारीरिक शिक्षा (Hindi Note 1)', code: 'S-05', lang: 'Hindi', opt: 1 },

  // S-06: Pedagogy of English (Primary Level)
  { file: 'BIHAR D.El.Ed[S-06][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-06 Pedagogy of English (English Note 1)', code: 'S-06', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-06][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-06 अंग्रेज़ी का शिक्षाशास्त्र (Hindi Note 1)', code: 'S-06', lang: 'Hindi', opt: 1 },

  // S-07: Pedagogy of Mathematics - 2 (Primary Level)
  { file: 'BIHAR D.El.Ed[S-07][(en)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-07 Pedagogy of Mathematics (English Note 1)', code: 'S-07', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[S-07][(hi)][1].pdf', title: 'Bihar D.El.Ed 2nd Year - S-07 गणित का शिक्षाशास्त्र (Hindi Note 1)', code: 'S-07', lang: 'Hindi', opt: 1 },

  // F-01 & F-02
  { file: 'BIHAR D.El.Ed[F-01][(hi)][1].pdf', title: 'Bihar D.El.Ed 1st Year - F-01 (Hindi) Note 1', code: 'F-01', lang: 'Hindi', opt: 1 },
  { file: 'BIHAR D.El.Ed[F-01][(en)][1].pdf', title: 'Bihar D.El.Ed 1st Year - F-01 (English) Note 1', code: 'F-01', lang: 'English', opt: 1 },
  { file: 'BIHAR D.El.Ed[F-02][(hi)][1].pdf', title: 'Bihar D.El.Ed 1st Year - F-02 (Hindi) Note 1', code: 'F-02', lang: 'Hindi', opt: 1 },
  { file: 'BIHAR D.El.Ed[F-02][(en)][1].pdf', title: 'Bihar D.El.Ed 1st Year - F-02 (English) Note 1', code: 'F-02', lang: 'English', opt: 1 }
];

function generatePdfs() {
  const publicNotesDir = path.join(__dirname, '../public/notes');
  if (!fs.existsSync(publicNotesDir)) {
    fs.mkdirSync(publicNotesDir, { recursive: true });
  }

  pdfFilesToCreate.forEach(item => {
    const filePath = path.join(publicNotesDir, item.file);
    const buf = createMinimalPdfBuffer(item.title, item.code, item.lang, item.opt);
    fs.writeFileSync(filePath, buf);
    console.log(`[PDF Generator] Created PDF: ${item.file}`);
  });
}

if (require.main === module) {
  generatePdfs();
}

module.exports = generatePdfs;
