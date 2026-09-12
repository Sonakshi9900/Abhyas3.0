const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/notes');

if (fs.existsSync(targetDir)) {
  const files = fs.readdirSync(targetDir);
  let deletedCount = 0;
  for (const f of files) {
    if (f.endsWith('.pdf')) {
      fs.unlinkSync(path.join(targetDir, f));
      console.log(`Deleted: ${f}`);
      deletedCount++;
    }
  }
  console.log(`Successfully deleted ${deletedCount} PDF files from ${targetDir}`);
} else {
  console.log('Notes directory does not exist.');
}
