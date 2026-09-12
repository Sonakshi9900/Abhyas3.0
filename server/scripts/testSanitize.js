const PDFDocument = require('pdfkit');
const fs = require('fs');

function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/…/g, '...')
    .replace(/[^\x00-\x7F]/g, '');
}

const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
const stream = fs.createWriteStream('test_sanitized.pdf');
doc.pipe(stream);

doc.fontSize(16).text(sanitizeText('BIHAR D.El.Ed NOTES — SESSION 2024-26'));
doc.fontSize(12).text(sanitizeText('S-7 Pedagogy of Mathematics – 2 ( Primary level)'));
doc.fontSize(10).text(sanitizeText('Unit 1: Techniques and Resources for Teaching Mathematics'));
doc.text(sanitizeText('According to constructivism, mistakes are necessary to learn anything...'));

const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(8).text('Page ' + (i + 1), 40, 800, { align: 'center', width: 515 });
}
doc.end();

stream.on('finish', () => console.log('Test PDF generated cleanly, size:', fs.statSync('test_sanitized.pdf').size));
