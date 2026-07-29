import fs from 'fs';
import path from 'path';

const screenshotsDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook\\screenshots';

const aliases = [
  { src: '01-wallet-connected.png', dst: 'wallet-connected.png' },
  { src: '02-balance-displayed.png', dst: 'balance-displayed.png' },
  { src: '03-transaction-success.png', dst: 'transaction-success.png' },
  { src: '04-ledger-view.png', dst: 'transaction-result.png' },
  { src: '04-ledger-view.png', dst: 'ledger-view.png' },
  { src: '01-wallet-options.png', dst: 'wallet-options.png' },
  { src: '02-connected-wallet.png', dst: 'connected-wallet.png' },
  { src: '03-expense-submitted.png', dst: 'expense-submitted.png' },
  { src: '04-auto-executed-payout.png', dst: 'auto-executed-payout.png' },
  { src: '05-error-state-toast.png', dst: 'error-state-toast.png' },
];

aliases.forEach(({ src, dst }) => {
  const srcPath = path.join(screenshotsDir, src);
  const dstPath = path.join(screenshotsDir, dst);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Created alias: ${dst} -> ${src}`);
  } else {
    console.warn(`Source file missing: ${src}`);
  }
});

console.log('✅ Screenshot file aliases synchronized!');
