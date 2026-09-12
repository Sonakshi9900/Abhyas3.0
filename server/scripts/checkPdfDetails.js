const fs = require('fs');

const files = [
  'C:\\Users\\sonak\\Downloads\\Bihar D.El.Ed S4 (English).....pdf',
  'C:\\Users\\sonak\\Downloads\\Bihar D.El.Ed S6 ....Uttam.pdf',
  'C:\\Users\\sonak\\Downloads\\Bihar D.El.Ed S7 (English).....pdf',
  'C:\\Users\\sonak\\Downloads\\Bihar D.El.Ed S8.....pdf',
  'C:\\Users\\sonak\\Downloads\\Bihar DElEd S1 English...pdf',
  'C:\\Users\\sonak\\Downloads\\Bihar DElEd S2 English....pdf'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f, 'utf8');
    const pageCount = (buf.match(/\/Type\s*\/Page\b/g) || []).length;
    console.log(`File: ${f}`);
    console.log(`  Size: ${fs.statSync(f).size} bytes | Page count: ${pageCount}`);
  }
});
