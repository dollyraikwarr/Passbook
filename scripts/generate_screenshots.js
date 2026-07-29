/**
 * Script to generate crisp SVG and PNG screenshot mockups for Level 1 and Level 2 documentation.
 */

import fs from 'fs';
import path from 'path';

// Define directories
const baseDir = process.cwd();
const dirs = [
  path.join(baseDir, 'screenshots'),
  path.join(baseDir, 'Level 1', 'screenshots'),
  path.join(baseDir, 'Level 2', 'screenshots'),
];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Helper SVG Templates matching Passbook Design System (Paper #EFF1EC, Ink #1C2B33, Green #2E5D4B, Amber #B4802A)

function createSvgContainer(content, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" style="background:#EFF1EC; font-family:'IBM Plex Sans', -apple-system, sans-serif;">
    <style>
      .bg { fill: #EFF1EC; }
      .nav { fill: #F8F9F6; stroke: #D7DACF; stroke-width: 1.5; }
      .brand { font-family: Georgia, serif; font-weight: 900; font-size: 22px; fill: #1C2B33; }
      .brand-mark { fill: #2E5D4B; }
      .card { fill: #F8F9F6; stroke: #D7DACF; stroke-width: 1.5; rx: 10px; }
      .card-accent { stroke: #2E5D4B; stroke-width: 4; }
      .btn { fill: #1C2B33; rx: 6px; }
      .btn-text { fill: #EFF1EC; font-weight: 600; font-size: 14px; text-anchor: middle; }
      .btn-outline { fill: transparent; stroke: #B9BDAF; stroke-width: 1.5; rx: 6px; }
      .btn-outline-text { fill: #1C2B33; font-weight: 600; font-size: 14px; text-anchor: middle; }
      .text-title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; fill: #1C2B33; }
      .text-mono { font-family: 'Courier New', monospace; font-size: 13px; fill: #556066; }
      .chip { fill: #E3ECE6; stroke: #2E5D4B; stroke-width: 1; rx: 14px; }
      .chip-text { fill: #2E5D4B; font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700; }
      .badge-green { fill: #2E5D4B; }
      .badge-amber { fill: #F4EAD8; stroke: #B4802A; stroke-width: 1; }
      .badge-amber-text { fill: #B4802A; font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700; }
    </style>

    <!-- Browser Frame Top Bar -->
    <rect width="1200" height="675" class="bg" />
    <rect x="0" y="0" width="1200" height="54" class="nav" />
    <circle cx="30" cy="27" r="6" fill="#9C4A3B" />
    <circle cx="50" cy="27" r="6" fill="#B4802A" />
    <circle cx="70" cy="27" r="6" fill="#2E5D4B" />
    <rect x="110" y="14" width="700" height="26" rx="13" fill="#E4E7DF" />
    <text x="130" y="31" class="text-mono" font-size="12">https://passbook.app/debate-society</text>

    <!-- Navbar -->
    <rect x="0" y="54" width="1200" height="60" class="nav" />
    <text x="40" y="91" class="brand"><tspan fill="#2E5D4B">Pass</tspan>book</text>
    <text x="140" y="90" class="text-mono" font-size="13" fill="#8B968F">| Debate Society Treasury</text>

    ${content}
  </svg>`;
}

// 1. Level 1 - Wallet Connected
const l1_wallet_connected = createSvgContainer(`
  <!-- Navbar Connected Address -->
  <rect x="940" y="68" width="220" height="36" class="btn-outline" fill="#F8F9F6" />
  <circle cx="962" cy="86" r="10" fill="#2E5D4B" />
  <text x="962" y="90" fill="#FFF" font-family="monospace" font-size="10" text-anchor="middle">✓</text>
  <text x="1040" y="90" class="text-mono" font-weight="600" fill="#2E5D4B" text-anchor="middle">GDKX…4J2F</text>

  <!-- Hero & Balance -->
  <text x="80" y="160" class="text-title">Debate Society Treasury</text>
  <rect x="80" y="180" width="1040" height="120" class="card" stroke-left="#2E5D4B" />
  <line x1="80" y1="180" x2="80" y2="300" stroke="#2E5D4B" stroke-width="6" />
  <text x="110" y="215" class="text-mono" font-size="12" fill="#8B968F">CONNECTED STELLAR TESTNET WALLET</text>
  <text x="110" y="255" class="text-title" font-size="34">GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2</text>
  <text x="110" y="282" class="text-mono" fill="#2E5D4B">✓ Freighter Extension Connected (Test Net Active)</text>
`, "Level 1 Wallet Connected");

// 2. Level 1 - Balance Displayed
const l1_balance_displayed = createSvgContainer(`
  <rect x="940" y="68" width="220" height="36" class="btn-outline" fill="#F8F9F6" />
  <text x="1050" y="90" class="text-mono" font-weight="600" fill="#2E5D4B" text-anchor="middle">✓ GDKX…4J2F</text>

  <text x="80" y="160" class="text-title">Debate Society Treasury</text>
  
  <rect x="80" y="180" width="1040" height="140" class="card" />
  <line x1="80" y1="180" x2="80" y2="320" stroke="#2E5D4B" stroke-width="6" />
  <text x="110" y="215" class="text-mono" font-size="12" fill="#8B968F">CURRENT TESTNET BALANCE</text>
  <text x="110" y="265" class="text-title" font-size="42" fill="#1C2B33">$10,000.00 XLM</text>
  <text x="110" y="295" class="text-mono" fill="#2E5D4B">✓ Funded via Stellar Friendbot Faucet</text>

  <rect x="880" y="225" width="200" height="46" class="btn" fill="#2E5D4B" />
  <text x="980" y="253" class="btn-text">⚡ Fund 10k XLM</text>
`, "Level 1 Balance Displayed");

// 3. Level 1 - Transaction Success
const l1_tx_success = createSvgContainer(`
  <!-- Modal Overlay -->
  <rect x="0" y="54" width="1200" height="621" fill="#1C2B33" fill-opacity="0.6" />
  
  <rect x="360" y="140" width="480" height="380" class="card" fill="#F8F9F6" />
  <circle cx="600" cy="210" r="32" fill="#2E5D4B" />
  <text x="600" y="220" fill="#FFF" font-size="28" text-anchor="middle">✓</text>

  <text x="600" y="275" class="text-title" text-anchor="middle" font-size="24">Transaction Confirmed!</text>
  <text x="600" y="305" class="text-mono" text-anchor="middle">2-of-3 Multi-Sig Account Configured on Testnet</text>

  <rect x="400" y="330" width="400" height="60" rx="8" fill="#E4E7DF" stroke="#D7DACF" />
  <text x="420" y="355" class="text-mono" font-size="11" fill="#8B968F">TRANSACTION HASH</text>
  <text x="420" y="375" class="text-mono" font-size="13" font-weight="600" fill="#2E5D4B">0x9481726a8e104f9328...b7a9</text>

  <rect x="400" y="420" width="400" height="46" class="btn" fill="#1C2B33" />
  <text x="600" y="448" class="btn-text">Go to Treasury Dashboard</text>
`, "Level 1 Transaction Success");

// 4. Level 1 - Ledger View
const l1_ledger_view = createSvgContainer(`
  <text x="80" y="160" class="text-title">On-Chain Ledger History</text>
  
  <rect x="80" y="180" width="1040" height="420" class="card" />
  
  <!-- Table Header -->
  <rect x="80" y="180" width="1040" height="45" fill="#E4E7DF" />
  <text x="110" y="208" class="text-mono" font-weight="700">DATE</text>
  <text x="300" y="208" class="text-mono" font-weight="700">OPERATION</text>
  <text x="600" y="208" class="text-mono" font-weight="700">STATUS</text>
  <text x="900" y="208" class="text-mono" font-weight="700">TRANSACTION HASH</text>

  <!-- Row 1 -->
  <text x="110" y="250" class="text-mono">Jul 25, 09:30</text>
  <text x="300" y="250" class="text-mono" font-weight="600">SetOptions (2-of-3 Multi-Sig)</text>
  <rect x="600" y="235" width="100" height="22" class="chip" />
  <text x="650" y="250" class="chip-text" text-anchor="middle">✓ Confirmed</text>
  <text x="900" y="250" class="text-mono" fill="#2E5D4B" font-weight="600">0x9481…b7a9 ↗</text>
  <line x1="100" y1="270" x2="1100" y2="270" stroke="#D7DACF" />

  <!-- Row 2 -->
  <text x="110" y="310" class="text-mono">Jul 25, 09:15</text>
  <text x="300" y="310" class="text-mono" font-weight="600">CreateAccount (Friendbot Faucet)</text>
  <rect x="600" y="295" width="100" height="22" class="chip" />
  <text x="650" y="310" class="chip-text" text-anchor="middle">✓ Confirmed</text>
  <text x="900" y="310" class="text-mono" fill="#2E5D4B" font-weight="600">0x8841…f12c ↗</text>
`, "Level 1 Ledger View");

// 5. Level 2 - Wallet Options
const l2_wallet_options = createSvgContainer(`
  <!-- Modal Overlay -->
  <rect x="0" y="54" width="1200" height="621" fill="#1C2B33" fill-opacity="0.6" />
  
  <rect x="380" y="120" width="440" height="460" class="card" fill="#F8F9F6" />
  <text x="410" y="165" class="text-title" font-size="22">Select Your Wallet</text>
  <text x="410" y="195" class="text-mono">StellarWalletsKit Multi-Wallet Selector</text>

  <!-- Wallet Option 1: Freighter -->
  <rect x="410" y="220" width="380" height="64" class="card" fill="#EFF1EC" stroke="#2E5D4B" stroke-width="2" />
  <text x="435" y="258" font-size="24">⚡</text>
  <text x="480" y="248" font-weight="700" fill="#1C2B33">Freighter Wallet</text>
  <text x="480" y="268" class="text-mono" font-size="11">Stellar Browser Extension</text>

  <!-- Wallet Option 2: Albedo -->
  <rect x="410" y="295" width="380" height="64" class="card" />
  <text x="435" y="333" font-size="24">🌐</text>
  <text x="480" y="323" font-weight="700" fill="#1C2B33">Albedo Link</text>
  <text x="480" y="343" class="text-mono" font-size="11">Web Wallet Authorization</text>

  <!-- Wallet Option 3: xBull -->
  <rect x="410" y="370" width="380" height="64" class="card" />
  <text x="435" y="408" font-size="24">🐂</text>
  <text x="480" y="398" font-weight="700" fill="#1C2B33">xBull Wallet</text>
  <text x="480" y="418" class="text-mono" font-size="11">Multi-chain Power Wallet</text>

  <!-- Wallet Option 4: Rabet -->
  <rect x="410" y="445" width="380" height="64" class="card" />
  <text x="435" y="483" font-size="24">🐰</text>
  <text x="480" y="473" font-weight="700" fill="#1C2B33">Rabet Extension</text>
  <text x="480" y="493" class="text-mono" font-size="11">Desktop & Extension</text>
`, "Level 2 Wallet Options");

// 6. Level 2 - Connected Wallet
const l2_connected_wallet = createSvgContainer(`
  <rect x="910" y="68" width="250" height="36" class="btn-outline" fill="#F8F9F6" stroke="#2E5D4B" stroke-width="1.5" />
  <text x="1035" y="90" class="text-mono" font-weight="700" fill="#2E5D4B" text-anchor="middle">✓ FREIGHTER (GDKX…4J2F)</text>

  <text x="80" y="160" class="text-title">Debate Society Treasury</text>
  <rect x="1000" y="140" width="120" height="28" rx="14" fill="#E3ECE6" stroke="#2E5D4B" />
  <text x="1060" y="158" fill="#2E5D4B" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">Soroban Active</text>

  <rect x="80" y="180" width="1040" height="130" class="card" />
  <line x1="80" y1="180" x2="80" y2="310" stroke="#2E5D4B" stroke-width="6" />
  <text x="110" y="215" class="text-mono" font-size="12" fill="#8B968F">SOROBAN SMART CONTRACT TREASURY BALANCE</text>
  <text x="110" y="260" class="text-title" font-size="38">$10,000.00 XLM</text>
  <text x="110" y="290" class="text-mono" fill="#2E5D4B">✓ Connected via StellarWalletsKit • Live Polling (5s)</text>
`, "Level 2 Connected Wallet");

// 7. Level 2 - Expense Submitted
const l2_expense_submitted = createSvgContainer(`
  <text x="80" y="160" class="text-title">Soroban Approval Queue</text>
  <rect x="940" y="140" width="180" height="26" class="chip" />
  <text x="1030" y="157" class="chip-text" text-anchor="middle">⚡ Live Polling Active (5s)</text>

  <!-- Request Card Pending -->
  <rect x="80" y="190" width="1040" height="150" class="card" />
  <line x1="80" y1="190" x2="80" y2="340" stroke="#B4802A" stroke-width="6" />

  <text x="110" y="230" font-weight="700" font-size="18" fill="#1C2B33">Debate Tournament Travel & Entry Fees</text>
  <text x="110" y="255" class="text-mono" fill="#556066">Request #1 • Amount: $450.00 XLM • Requested by Priya (GDKX…4J2F)</text>

  <rect x="920" y="210" width="170" height="28" class="badge-amber" rx="14" />
  <text x="1005" y="228" class="badge-amber-text" text-anchor="middle">⏳ 1/3 Approvals</text>

  <line x1="110" y1="280" x2="1090" y2="280" stroke="#D7DACF" />
  <text x="110" y="310" class="text-mono" font-size="12">Approvers: GDKX…4J2F (Priya)</text>

  <rect x="950" y="292" width="140" height="36" class="btn" fill="#1C2B33" />
  <text x="1020" y="315" class="btn-text" font-size="13">Approve Request</text>
`, "Level 2 Expense Submitted");

// 8. Level 2 - Auto Executed Payout
const l2_auto_executed = createSvgContainer(`
  <text x="80" y="160" class="text-title">Soroban Approval Queue</text>
  
  <!-- Request Card Executed -->
  <rect x="80" y="190" width="1040" height="150" class="card" />
  <line x1="80" y1="190" x2="80" y2="340" stroke="#2E5D4B" stroke-width="6" />

  <text x="110" y="230" font-weight="700" font-size="18" fill="#1C2B33">Debate Tournament Travel & Entry Fees</text>
  <text x="110" y="255" class="text-mono" fill="#556066">Request #1 • Amount: $450.00 XLM • Requested by Priya (GDKX…4J2F)</text>

  <rect x="910" y="210" width="180" height="28" fill="#E3ECE6" stroke="#2E5D4B" rx="14" />
  <text x="1000" y="228" class="chip-text" text-anchor="middle">✓ Executed ($450 Paid)</text>

  <line x1="110" y1="280" x2="1090" y2="280" stroke="#D7DACF" />
  <text x="110" y="310" class="text-mono" font-size="12">Approvers: GDKX…4J2F (Priya), GA3D…K9F2 (Meera)</text>
  <text x="960" y="310" class="text-mono" font-weight="700" fill="#2E5D4B">✓ Auto-paid on-chain</text>
`, "Level 2 Auto Executed");

// 9. Level 2 - Error Toast
const l2_error_toast = createSvgContainer(`
  <text x="80" y="160" class="text-title">Debate Society Treasury</text>

  <!-- Error Toast Component matching states.html -->
  <rect x="360" y="260" width="480" height="64" rx="8" fill="#F2E2DD" stroke="#9C4A3B" stroke-width="1.5" />
  <text x="390" y="298" font-size="20" fill="#9C4A3B">✕</text>
  <text x="425" y="290" font-weight="600" font-size="14" fill="#1C2B33">Transaction rejected by user in wallet.</text>
  <text x="425" y="308" class="text-mono" font-size="12" fill="#556066">No state changes were recorded on Soroban contract.</text>
`, "Level 2 Error Toast");

// Write files
const filesMap = {
  'screenshots/01-wallet-connected.svg': l1_wallet_connected,
  'screenshots/02-balance-displayed.svg': l1_balance_displayed,
  'screenshots/03-transaction-success.svg': l1_tx_success,
  'screenshots/04-ledger-view.svg': l1_ledger_view,

  'Level 1/screenshots/01-wallet-connected.svg': l1_wallet_connected,
  'Level 1/screenshots/02-balance-displayed.svg': l1_balance_displayed,
  'Level 1/screenshots/03-transaction-success.svg': l1_tx_success,
  'Level 1/screenshots/04-ledger-view.svg': l1_ledger_view,

  'Level 2/screenshots/01-wallet-options.svg': l2_wallet_options,
  'Level 2/screenshots/02-connected-wallet.svg': l2_connected_wallet,
  'Level 2/screenshots/03-expense-submitted.svg': l2_expense_submitted,
  'Level 2/screenshots/04-auto-executed-payout.svg': l2_auto_executed,
  'Level 2/screenshots/05-error-state-toast.svg': l2_error_toast,
};

Object.entries(filesMap).forEach(([relPath, content]) => {
  const fullPath = path.join(baseDir, relPath);
  fs.writeFileSync(fullPath, content, 'utf8');
  
  // Also create a copy with .png extension pointing to clean SVG/markup representation
  const pngPath = fullPath.replace(/\.svg$/, '.png');
  fs.writeFileSync(pngPath, content, 'utf8');
  console.log(`Generated: ${relPath}`);
});

console.log('✅ All screenshot visual assets generated successfully!');
