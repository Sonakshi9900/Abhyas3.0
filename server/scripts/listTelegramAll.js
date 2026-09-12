const fs = require('fs');
const path = require('path');

const telegramDir = 'C:\\Users\\sonak\\Downloads\\Telegram Desktop';

if (fs.existsSync(telegramDir)) {
  const files = fs.readdirSync(telegramDir);
  console.log(`Found ${files.length} total entries in Telegram Desktop:`);
  files.forEach((f, idx) => {
    try {
      const fullPath = path.join(telegramDir, f);
      const stat = fs.statSync(fullPath);
      if (f.toLowerCase().includes('pdf') || f.toLowerCase().includes('deled') || f.toLowerCase().includes('s_') || f.toLowerCase().includes('s-') || f.toLowerCase().includes('s0') || f.toLowerCase().includes('s 6') || f.toLowerCase().includes('s 1') || f.toLowerCase().includes('s 2')) {
        console.log(`${idx + 1}. [${(stat.size / 1024).toFixed(1)} KB] -> ${JSON.stringify(f)}`);
      }
    } catch(e) {}
  });
} else {
  console.log('Telegram Desktop directory does not exist.');
}
