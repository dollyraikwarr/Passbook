import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\rohit\\.gemini\\antigravity-ide\\brain\\93ab56a4-3df9-4ce7-ba0c-2e9e32e6150b';
const passbookDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook';

const mappings = [
  {
    src: path.join(brainDir, 'mobile_responsive_1785302677993.png'),
    dst: path.join(passbookDir, 'screenshots', 'mobile-responsive.png'),
  },
  {
    src: path.join(brainDir, 'live_demo_1785302664932.png'),
    dst: path.join(passbookDir, 'screenshots', 'live-demo.png'),
  },
];

mappings.forEach(({ src, dst }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied genuine level 3 screenshot to: ${dst}`);
  } else {
    console.warn(`Source screenshot file missing: ${src}`);
  }
});

console.log('✅ Genuine Level 3 PNG screenshots updated!');
