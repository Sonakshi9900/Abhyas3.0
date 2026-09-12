const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/notes');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const searchDirs = [
  'C:\\Users\\sonak\\Downloads',
  'C:\\Users\\sonak\\Downloads\\Telegram Desktop',
  'C:\\Users\\sonak\\Desktop'
];

function findFileByName(possibleNames) {
  for (const sDir of searchDirs) {
    if (!fs.existsSync(sDir)) continue;
    const files = fs.readdirSync(sDir);
    for (const name of possibleNames) {
      const found = files.find(f => f.toLowerCase().includes(name.toLowerCase()));
      if (found) {
        return path.join(sDir, found);
      }
    }
  }
  return null;
}

const subjectPDFMap = [
  // S-01
  {
    target: 'BIHAR D.El.Ed[S-01][(hi)][1].pdf',
    sources: ['Bihar DElEd S1 HINDI1', 'S01_समकालीन']
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(hi)][2].pdf',
    sources: ['Bihar DElEd S1 HINDI2', 'S- 1 KEY POINT']
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(en)][1].pdf',
    sources: ['Bihar DElEd S1 English1', 'Bihar DElEd S1 English.pdf']
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(en)][2].pdf',
    sources: ['Bihar DElEd S1 English2', 'S_1_समकालीन']
  },

  // S-02
  {
    target: 'BIHAR D.El.Ed[S-02][(en)][1].pdf',
    sources: ['Bihar D.El.Ed S2 English1', 'S_-_2_संज्ञान']
  },
  {
    target: 'BIHAR D.El.Ed[S-02][(en)][2].pdf',
    sources: ['Bihar DElEd S2 English....pdf', 'Bihar DElEd S2 English']
  },

  // S-04
  {
    target: 'BIHAR D.El.Ed[S-04][(en)][1].pdf',
    sources: ['Bihar D.El.Ed S4 English1', 'Bihar D.El.Ed S4 (English)', 'S-4   स्वयं की समझ']
  },

  // S-05
  {
    target: 'BIHAR D.El.Ed[S-05][(en)][1].pdf',
    sources: ['Bihar D.El.Ed S5 English1', 'S_5_स्वास्थ्य']
  },

  // S-06
  {
    target: 'BIHAR D.El.Ed[S-06][(en)][1].pdf',
    sources: ['Bihar D.El.Ed S6 English1', 'Bihar D.El.Ed S6 ....Uttam', 'S 6 PEDAGOGY OF ENGLISH FULL']
  },

  // S-07
  {
    target: 'BIHAR D.El.Ed[S-07][(en)][1].pdf',
    sources: ['Bihar D.El.Ed S7 (English)', 'S_–_7_गणित']
  },

  // S-08
  {
    target: 'BIHAR D.El.Ed[S-08][(hi)][1].pdf',
    sources: ['Bihar D.El.Ed S8 English1', 'S_8_हिंदी_का_शिक्षणशास्त्र', 'Bihar D.El.Ed S8']
  }
];

console.log('Mapping exact original PDF files for each subject...');

let successCount = 0;
subjectPDFMap.forEach(item => {
  const srcPath = findFileByName(item.sources);
  const destPath = path.join(targetDir, item.target);

  if (srcPath && fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    const size = fs.statSync(destPath).size;
    console.log(`✓ Mapped Subject PDF (${(size/1024).toFixed(1)} KB): ${path.basename(srcPath)} -> ${item.target}`);
    successCount++;
  } else {
    console.warn(`✗ Source not found for target: ${item.target}`);
  }
});

console.log(`\nSuccessfully mapped ${successCount} original PDF files strictly according to subjects!`);
