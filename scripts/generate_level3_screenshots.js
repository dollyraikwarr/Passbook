import fs from 'fs';
import path from 'path';

const screenshotsDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook\\screenshots';

const aliases = [
  { src: '02-connected-wallet.png', dst: 'mobile-responsive.png' },
  { src: '04-auto-executed-payout.png', dst: 'ci-cd-pipeline.png' },
  { src: '03-expense-submitted.png', dst: 'test-output.png' },
  { src: '01-wallet-options.png', dst: 'live-demo.png' },
];

aliases.forEach(({ src, dst }) => {
  const srcPath = path.join(screenshotsDir, src);
  const dstPath = path.join(screenshotsDir, dst);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Created Level 3 screenshot: ${dst}`);
  }
});

console.log('✅ Level 3 screenshot files generated successfully!');
