import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\rohit\\.gemini\\antigravity-ide\\brain\\93ab56a4-3df9-4ce7-ba0c-2e9e32e6150b';
const passbookDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook';

const mappings = [
  // Level 2 Screenshots
  {
    src: path.join(brainDir, '01_wallet_options_1784955743287.png'),
    targets: [
      path.join(passbookDir, 'Level 2', 'screenshots', '01-wallet-options.png'),
      path.join(passbookDir, 'screenshots', '01-wallet-options.png'),
    ],
  },
  {
    src: path.join(brainDir, '02_connected_wallet_1784955781008.png'),
    targets: [
      path.join(passbookDir, 'Level 2', 'screenshots', '02-connected-wallet.png'),
      path.join(passbookDir, 'Level 1', 'screenshots', '01-wallet-connected.png'),
      path.join(passbookDir, 'Level 1', 'screenshots', '02-balance-displayed.png'),
      path.join(passbookDir, 'screenshots', '02-connected-wallet.png'),
      path.join(passbookDir, 'screenshots', '01-wallet-connected.png'),
      path.join(passbookDir, 'screenshots', '02-balance-displayed.png'),
    ],
  },
  {
    src: path.join(brainDir, '03_expense_submitted_1784955822315.png'),
    targets: [
      path.join(passbookDir, 'Level 2', 'screenshots', '03-expense-submitted.png'),
      path.join(passbookDir, 'screenshots', '03-expense-submitted.png'),
    ],
  },
  {
    src: path.join(brainDir, '04_auto_executed_payout_1784955846637.png'),
    targets: [
      path.join(passbookDir, 'Level 2', 'screenshots', '04-auto-executed-payout.png'),
      path.join(passbookDir, 'Level 1', 'screenshots', '03-transaction-success.png'),
      path.join(passbookDir, 'screenshots', '04-auto-executed-payout.png'),
      path.join(passbookDir, 'screenshots', '03-transaction-success.png'),
    ],
  },
  {
    src: path.join(brainDir, '05_error_state_toast_1784956157210.png'),
    targets: [
      path.join(passbookDir, 'Level 2', 'screenshots', '05-error-state-toast.png'),
      path.join(passbookDir, 'screenshots', '05-error-state-toast.png'),
    ],
  },
  {
    src: path.join(brainDir, '04_ledger_view_1784955942776.png'),
    targets: [
      path.join(passbookDir, 'Level 1', 'screenshots', '04-ledger-view.png'),
      path.join(passbookDir, 'screenshots', '04-ledger-view.png'),
    ],
  },
];

mappings.forEach(({ src, targets }) => {
  if (fs.existsSync(src)) {
    targets.forEach((dst) => {
      const dir = path.dirname(dst);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(src, dst);
      console.log(`Copied genuine screenshot to: ${dst}`);
    });
  } else {
    console.warn(`Source screenshot file not found: ${src}`);
  }
});

console.log('✅ Genuine browser screenshots copied to all Level 1 and Level 2 folders!');
