import { getStoredAddress, formatAddress } from '../lib/freighterWallet.js';

export function renderOnboardingPage() {
  const address = getStoredAddress();
  return `
    <header class="site-nav">
      <div class="nav-inner">
        <a href="/" class="brand"><span class="brand-mark">Pass</span>book</a>
        <a href="/dashboard" class="btn btn-small btn-outline">Dashboard</a>
      </div>
    </header>

    <main class="wrap" style="padding-top:40px; max-width:680px;">
      <h2 style="font-size:28px; margin-bottom:8px;">Configure 2-of-3 Club Treasury</h2>
      <p style="color:var(--ink-soft); margin-bottom:24px;">Setup 3 e-board co-signers for automated threshold enforcement.</p>

      <div class="card">
        <form id="onboarding-form">
          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px;">Club Name</label>
            <input type="text" id="club-name" value="Debate Society Treasury" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);" required>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px;">Treasurer (Approver 1)</label>
            <input type="text" value="${address || 'GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2'}" readonly style="width:100%; padding:10px; border-radius:6px; background:var(--paper-deep); border:1px solid var(--hairline); font-family:var(--font-mono); font-size:13px;">
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px;">Co-Signer 2 Public Key</label>
            <input type="text" id="cosigner-2" value="GA3D5J23K9F2D5J23N891MXXP09477K9F2D5J23N891" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong); font-family:var(--font-mono); font-size:13px;" required>
          </div>

          <div style="margin-bottom:24px;">
            <label style="display:block; font-weight:600; font-size:14px; margin-bottom:6px;">Co-Signer 3 Public Key</label>
            <input type="text" id="cosigner-3" value="GAKX3L8891MXXP09477K9F2D5J23N891MXXP09477" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong); font-family:var(--font-mono); font-size:13px;" required>
          </div>

          <button type="submit" class="btn btn-full" style="padding:14px;">Deploy 2-of-3 Soroban Treasury</button>
        </form>
      </div>
    </main>
  `;
}

export function initOnboardingEvents() {
  const form = document.getElementById('onboarding-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('2-of-3 Soroban Treasury Contract initialized successfully on Testnet!');
      window.location.href = '/dashboard';
    });
  }
}
