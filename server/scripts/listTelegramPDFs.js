const fs = require('fs');
const path = require('path');

const checkDirs = [
  'C:\\Users\\sonak\\Downloads',
  'C:\\Users\\sonak\\OneDrive\\Downloads',
  'C:\\Users\\sonak\\OneDrive\\Desktop',
  'C:\\Users\\sonak\\Desktop'
];

checkDirs.forEach(d => {
  if (fs.existsSync(d)) {
    console.log(`\n=== Checking: ${d} ===`);
    try {
      const entries = fs.readdirSync(d);
      entries.forEach(e => {
        if (e.toLowerCase().includes('deled') || e.toLowerCase().includes('s_') || e.toLowerCase().includes('s-') || e.toLowerCase().includes('s 6') || e.toLowerCase().includes('telegram')) {
          const fullPath = path.join(d, e);
          const stat = fs.statSync(fullPath);
          console.log(`- [${stat.isDirectory() ? 'DIR' : 'FILE'}] ${(stat.size/1024).toFixed(1)} KB | ${e}`);
        }
      });
    } catch(err) {
      console.error('Error reading dir:', d, err.message);
    }
  }
});
