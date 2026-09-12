const fs = require('fs');
const path = require('path');

const telegramDir = 'C:\\Users\\sonak\\Downloads\\Telegram Desktop';
const downloadsDir = 'C:\\Users\\sonak\\Downloads';
const targetDir = path.join(__dirname, '../public/notes');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function scanFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map(f => ({
    filename: f,
    path: path.join(dir, f),
    size: fs.statSync(path.join(dir, f)).size
  }));
}

const allFiles = [...scanFiles(telegramDir), ...scanFiles(downloadsDir)];

console.log(`Found ${allFiles.length} total files across Downloads & Telegram Desktop.`);

// Map target PDF names by size & key identifiers
const targets = [
  {
    target: 'BIHAR D.El.Ed[S-01][(hi)][1].pdf',
    match: f => f.filename.includes('Bihar DElEd S1 HINDI1') || (f.size > 2000000 && f.filename.toLowerCase().includes('s01'))
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(hi)][2].pdf',
    match: f => f.filename.includes('Bihar DElEd S1 HINDI2') || (f.size > 350000 && f.size < 400000 && f.filename.includes('S- 1'))
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(en)][1].pdf',
    match: f => f.filename.includes('Bihar DElEd S1 English1') || f.filename.includes('Bihar DElEd S1 English.pdf')
  },
  {
    target: 'BIHAR D.El.Ed[S-01][(en)][2].pdf',
    match: f => f.filename.includes('Bihar DElEd S1 English2') || (f.size > 1200000 && f.size < 1300000 && f.filename.toLowerCase().includes('s_1'))
  },
  {
    target: 'BIHAR D.El.Ed[S-02][(en)][1].pdf',
    match: f => f.size > 1500000 && f.size < 1700000 && (f.filename.includes('S_-_2') || f.filename.toLowerCase().includes('s2'))
  },
  {
    target: 'BIHAR D.El.Ed[S-04][(en)][1].pdf',
    match: f => f.size > 650000 && f.size < 750000 && f.filename.toLowerCase().includes('s-4')
  },
  {
    target: 'BIHAR D.El.Ed[S-05][(en)][1].pdf',
    match: f => f.size > 700000 && f.size < 800000 && f.filename.toLowerCase().includes('s_5')
  },
  {
    target: 'BIHAR D.El.Ed[S-06][(en)][1].pdf',
    match: f => f.size > 1000000 && f.size < 1100000 && (f.filename.includes('S 6') || f.filename.toLowerCase().includes('s6'))
  },
  {
    target: 'BIHAR D.El.Ed[S-07][(en)][1].pdf',
    match: f => f.size > 800000 && f.size < 950000 && (f.filename.includes('S_-_7') || f.filename.toLowerCase().includes('s7'))
  },
  {
    target: 'BIHAR D.El.Ed[S-08][(hi)][1].pdf',
    match: f => f.size > 1000000 && f.size < 1200000 && f.filename.includes('S_8')
  }
];

let copied = 0;
targets.forEach(t => {
  const found = allFiles.find(t.match);
  if (found) {
    const dest = path.join(targetDir, t.target);
    fs.copyFileSync(found.path, dest);
    console.log(`✓ Copied [${(found.size/1024).toFixed(1)} KB]: ${found.filename} -> ${t.target}`);
    copied++;
  } else {
    console.warn(`✗ Could not find file matching target: ${t.target}`);
  }
});

console.log(`\nSuccessfully copied ${copied} full original D.El.Ed PDF files into ${targetDir}`);
