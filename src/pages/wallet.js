import { getStoredAddress, formatAddress, connectWallet, disconnectWallet, SUPPORTED_WALLETS } from '../lib/freighterWallet.js';
import { fetchNativeBalance, fundTestnetAccount } from '../lib/stellar.js';

export async function renderWalletPage() {
  const address = getStoredAddress();
  let balanceInfo = { balance: '0.00' };

  if (address) {
    balanceInfo = await fetchNativeBalance(address);
  }

  return `
    <header class="site-nav">
      <div class="nav-inner">
        <a href="/" class="brand"><span class="brand-mark">Pass</span>book</a>
        <a href="/dashboard" class="btn btn-small btn-outline">Dashboard</a>
      </div>
    </header>

    <main class="wrap" style="padding-top:40px; max-width:600px;">
      <h2 style="font-size:28px; margin-bottom:8px;">Stellar Wallet Manager</h2>
      <p style="color:var(--ink-soft); margin-bottom:24px;">Connect your Stellar browser wallet to manage club dues and approve expenses.</p>

      <div class="card" style="margin-bottom:24px;">
        ${
          address
            ? `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700;">✓ WALLET CONNECTED</span>
            <button id="btn-disconnect" class="btn btn-small btn-outline">Disconnect</button>
          </div>
          <div style="font-family:var(--font-mono); font-size:15px; font-weight:600; margin-bottom:12px; word-break:break-all;">
            ${address}
          </div>
          <div style="background:var(--paper-deep); padding:12px; border-radius:6px; margin-bottom:16px;">
            <span style="font-size:12px; color:var(--ink-soft); display:block;">TESTNET XLM BALANCE</span>
            <span style="font-family:var(--font-display); font-size:28px; font-weight:700;">$${balanceInfo.balance} XLM</span>
          </div>
          <button id="btn-fund" class="btn btn-full">⚡ Fund 10,000 Testnet XLM (Friendbot)</button>
        `
            : `
          <h3 style="margin-bottom:16px;">Select Your Wallet Provider</h3>
          <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
            ${SUPPORTED_WALLETS.map(
              (w) => `
              <button class="wallet-select-btn card" data-id="${w.id}" style="display:flex; align-items:center; gap:14px; text-align:left; cursor:pointer; background:var(--paper); border:1.5px solid var(--hairline-strong);">
                <span style="font-size:24px;">${w.icon}</span>
                <div>
                  <div style="font-weight:700;">${w.name}</div>
                  <div style="font-size:12px; color:var(--ink-soft);">${w.desc}</div>
                </div>
              </button>
            `
            ).join('')}
          </div>
        `
        }
      </div>

      <div id="wallet-toast" style="display:none;" class="state-card state-card--warning"></div>
    </main>
  `;
}

export function initWalletPageEvents() {
  document.querySelectorAll('.wallet-select-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const res = await connectWallet(id);
      if (res.success) {
        window.location.reload();
      } else {
        const toast = document.getElementById('wallet-toast');
        if (toast) {
          toast.style.display = 'flex';
          toast.textContent = res.error || 'Connection failed.';
        }
      }
    });
  });

  const disc = document.getElementById('btn-disconnect');
  if (disc) {
    disc.addEventListener('click', () => {
      disconnectWallet();
      window.location.reload();
    });
  }

  const fund = document.getElementById('btn-fund');
  if (fund) {
    fund.addEventListener('click', async () => {
      const address = getStoredAddress();
      fund.textContent = 'Funding in progress...';
      const res = await fundTestnetAccount(address);
      alert(res.message);
      window.location.reload();
    });
  }
}
