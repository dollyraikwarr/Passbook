import { getStoredAddress, formatAddress } from '../lib/freighterWallet.js';
import { getSorobanBalance, fetchSorobanRequests, submitSorobanRequest, approveSorobanRequest } from '../lib/sorobanContract.js';

let pollingInterval = null;

export async function renderDashboardPage() {
  const address = getStoredAddress();
  const balanceData = await getSorobanBalance();
  const requestsData = await fetchSorobanRequests();

  return `
    <header class="site-nav">
      <div class="nav-inner">
        <a href="/" class="brand"><span class="brand-mark">Pass</span>book</a>
        <div style="display:flex; gap:12px; align-items:center;">
          <a href="/public" class="btn btn-small btn-outline">Public Audit</a>
          <a href="/wallet" class="btn btn-small btn-outline">${address ? formatAddress(address) : 'Connect Wallet'}</a>
        </div>
      </div>
    </header>

    <main class="wrap" style="padding-top:32px; padding-bottom:60px;">
      <!-- Hero Balance Banner -->
      <div class="card" style="margin-bottom:28px; border-left:6px solid var(--green);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span style="font-family:var(--font-mono); font-size:11px; font-weight:700; color:var(--ink-faint); letter-spacing:1px;">SOROBAN TREASURY BALANCE (2-OF-3 ENFORCED)</span>
            <h1 style="font-size:38px; margin:8px 0 4px; color:var(--ink);">$${balanceData.formatted} XLM</h1>
            <span style="font-family:var(--font-mono); font-size:12.5px; color:var(--green); font-weight:600;">✓ Connected via Soroban Testnet RPC • Polling live (5s)</span>
          </div>
          <a href="/onboarding" class="btn btn-small btn-outline">Settings</a>
        </div>
      </div>

      <!-- New Expense Form -->
      <div class="card" style="margin-bottom:36px;">
        <h3 style="font-size:20px; margin-bottom:16px;">Submit Expense Request</h3>
        <form id="expense-form" style="display:grid; grid-template-columns:2fr 1fr auto; gap:12px; align-items:end;">
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Expense Description</label>
            <input type="text" id="expense-desc" placeholder="e.g. Pizza for E-Board Meeting" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);" required>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Amount (XLM)</label>
            <input type="number" step="0.01" id="expense-amount" placeholder="75.00" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);" required>
          </div>
          <button type="submit" class="btn" style="min-height:42px;">Submit Request</button>
        </form>
      </div>

      <!-- Approval Queue Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="font-size:22px;">Soroban Approval Queue</h2>
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700; background:var(--green-soft); padding:4px 10px; border-radius:12px;">⚡ Live Updates Active</span>
      </div>

      <!-- Queue Cards -->
      <div id="queue-container" style="display:flex; flex-direction:column; gap:16px;">
        ${renderRequestsList(requestsData.requests, address)}
      </div>

      <!-- Toast Container -->
      <div id="toast-slot" class="toast-container"></div>
    </main>
  `;
}

function renderRequestsList(requests, activeAddress) {
  if (!requests || requests.length === 0) {
    return `<div class="card" style="text-align:center; color:var(--ink-soft); padding:32px;">No pending expense requests in queue.</div>`;
  }

  return requests
    .map((r) => {
      const isExecuted = r.status === 2;
      const count = r.approvals ? r.approvals.length : 1;
      const borderColor = isExecuted ? 'var(--green)' : 'var(--amber)';

      return `
      <div class="card" style="border-left:6px solid ${borderColor};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <h4 style="font-size:18px; margin-bottom:4px;">${r.description}</h4>
            <span style="font-family:var(--font-mono); font-size:13px; color:var(--ink-soft);">Request #${r.id} • Amount: $${parseFloat(r.amount).toFixed(2)} XLM</span>
          </div>
          <span class="badge" style="background:${isExecuted ? 'var(--green-soft)' : 'var(--amber-soft)'}; color:${isExecuted ? 'var(--green)' : 'var(--amber)'}; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:4px 12px; border-radius:14px; border:1px solid ${isExecuted ? 'var(--green)' : 'var(--amber)'};">
            ${isExecuted ? `✓ Executed ($${r.amount} Paid)` : `⏳ ${count}/3 Approvals`}
          </span>
        </div>
        <div style="border-top:1px solid var(--hairline); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-family:var(--font-mono); font-size:12px; color:var(--ink-faint);">Requested by ${formatAddress(r.requester)}</span>
          ${
            !isExecuted
              ? `<button class="btn btn-small btn-approve" data-id="${r.id}">Approve Request</button>`
              : `<span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700;">✓ Auto-paid on-chain</span>`
          }
        </div>
      </div>
    `;
    })
    .join('');
}

export function initDashboardEvents() {
  const form = document.getElementById('expense-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = getStoredAddress();
      const desc = document.getElementById('expense-desc').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);

      const res = await submitSorobanRequest(address, desc, amount);
      if (!res.success) {
        showToast(res.error);
      } else {
        window.location.reload();
      }
    });
  }

  document.querySelectorAll('.btn-approve').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const address = getStoredAddress();
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const res = await approveSorobanRequest(address, id);
      if (!res.success) {
        showToast(res.error);
      } else {
        window.location.reload();
      }
    });
  });

  // Start 5s live polling loop
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    const requestsData = await fetchSorobanRequests();
    const container = document.getElementById('queue-container');
    if (container) {
      container.innerHTML = renderRequestsList(requestsData.requests, getStoredAddress());
    }
  }, 5000);
}

function showToast(errCode) {
  const slot = document.getElementById('toast-slot');
  if (!slot) return;

  let msg = 'Transaction rejected by user in wallet.';
  if (errCode === 'INSUFFICIENT_BALANCE') msg = 'Insufficient balance in treasury contract.';
  if (errCode === 'WALLET_NOT_FOUND') msg = 'No wallet extension connected.';

  const toast = document.createElement('div');
  toast.className = 'state-card state-card--red';
  toast.innerHTML = `<span style="font-weight:700;">✕</span> <span>${msg}</span>`;
  slot.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
