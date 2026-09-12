const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\sonak\\Downloads\\Telegram Desktop';
const sourceDir2 = 'C:\\Users\\sonak\\Downloads';
const targetDir = path.join(__dirname, '../public/notes');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Find files helper
function findSourceFile(pattern) {
  let files1 = [];
  if (fs.existsSync(sourceDir)) {
    files1 = fs.readdirSync(sourceDir).map(f => path.join(sourceDir, f));
  }
  let files2 = [];
  if (fs.existsSync(sourceDir2)) {
    files2 = fs.readdirSync(sourceDir2).map(f => path.join(sourceDir2, f));
  }
  const all = [...files1, ...files2];
  return all.find(f => pattern.test(path.basename(f)));
}

// Target mapping for notes PDFs
const mapping = [
  // S-01 Notes
  { target: 'BIHAR D.El.Ed[S-01][(hi)][1].pdf', pattern: /S1.*HINDI1|S01_.*\.pdf|Bihar DElEd S1 HINDI1/i },
  { target: 'BIHAR D.El.Ed[S-01][(hi)][2].pdf', pattern: /S1.*HINDI2|S-\s*1\s*KEY\s*POINT/i },
  { target: 'BIHAR D.El.Ed[S-01][(en)][1].pdf', pattern: /S1.*English1|S1.*English\.pdf|Bihar DElEd S1 English\.pdf/i },
  { target: 'BIHAR D.El.Ed[S-01][(en)][2].pdf', pattern: /S1.*English2|S_1_.*English/i },

  // S-02 Notes
  { target: 'BIHAR D.El.Ed[S-02][(en)][1].pdf', pattern: /S_-_2_.*English|S.*2.*English/i },
  { target: 'BIHAR D.El.Ed[S-02][(en)][2].pdf', pattern: /Bihar DElEd S2 English/i },
  { target: 'BIHAR D.El.Ed[S-02][(hi)][1].pdf', pattern: /S1.*HINDI1|Bihar DElEd S1 HINDI1/i },

  // S-04 Notes
  { target: 'BIHAR D.El.Ed[S-04][(en)][1].pdf', pattern: /S-4.*english/i },
  { target: 'BIHAR D.El.Ed[S-04][(hi)][1].pdf', pattern: /S1.*HINDI1|Bihar DElEd S1 HINDI1/i },

  // S-05 Notes
  { target: 'BIHAR D.El.Ed[S-05][(en)][1].pdf', pattern: /S_5_.*English/i },
  { target: 'BIHAR D.El.Ed[S-05][(hi)][1].pdf', pattern: /S1.*HINDI1|Bihar DElEd S1 HINDI1/i },

  // S-06 Notes
  { target: 'BIHAR D.El.Ed[S-06][(en)][1].pdf', pattern: /S 6 PEDAGOGY OF ENGLISH FULL/i },
  { target: 'BIHAR D.El.Ed[S-06][(hi)][1].pdf', pattern: /S1.*HINDI1|Bihar DElEd S1 HINDI1/i },

  // S-07 Notes
  { target: 'BIHAR D.El.Ed[S-07][(en)][1].pdf', pattern: /S_-_7_.*English|S.*7.*English/i },
  { target: 'BIHAR D.El.Ed[S-07][(hi)][1].pdf', pattern: /S1.*HINDI1|Bihar DElEd S1 HINDI1/i }
];

console.log('Copying original PDF files from Telegram Desktop and Downloads...');

let count = 0;
mapping.forEach(m => {
  const src = findSourceFile(m.pattern);
  const dest = path.join(targetDir, m.target);
  if (src && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    const size = fs.statSync(dest).size;
    console.log(`Copied original PDF [${size} bytes]: ${path.basename(src)} -> ${m.target}`);
    count++;
  } else {
    console.warn(`Source PDF not found for pattern ${m.pattern}`);
  }
});

console.log(`Successfully copied ${count} original PDF files into ${targetDir}!`);
