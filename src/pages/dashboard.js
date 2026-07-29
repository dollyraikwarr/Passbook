import { getStoredAddress, formatAddress } from '../lib/freighterWallet.js';
import { getSorobanBalance, fetchSorobanRequests, submitSorobanRequest, approveSorobanRequest } from '../lib/sorobanContract.js';
import { validateCategorySpendingCap, CATEGORY_SPENDING_CAPS } from '../lib/expenses.js';
import { fileMemberDispute, getDisputes } from '../lib/disputes.js';
import { pollContractEvents } from '../lib/events.js';

let pollingInterval = null;

export async function renderDashboardPage() {
  const address = getStoredAddress();
  const balanceData = await getSorobanBalance();
  const requestsData = await fetchSorobanRequests();
  const disputes = getDisputes();

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
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div>
            <span style="font-family:var(--font-mono); font-size:11px; font-weight:700; color:var(--ink-faint); letter-spacing:1px;">SOROBAN TREASURY BALANCE (2-OF-3 ENFORCED)</span>
            <h1 style="font-size:38px; margin:8px 0 4px; color:var(--ink);">$${balanceData.formatted} XLM</h1>
            <span style="font-family:var(--font-mono); font-size:12.5px; color:var(--green); font-weight:600;">✓ Connected via Soroban Testnet RPC • Polling live (5s)</span>
          </div>
          <a href="/onboarding" class="btn btn-small btn-outline">Settings</a>
        </div>
      </div>

      <!-- New Expense Form with Category Caps -->
      <div class="card" style="margin-bottom:36px;">
        <h3 style="font-size:20px; margin-bottom:16px;">Submit Categorized Expense Request</h3>
        <form id="expense-form" class="grid-form" style="display:grid; grid-template-columns:2fr 1.5fr 1fr auto; gap:12px; align-items:end;">
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Expense Description</label>
            <input type="text" id="expense-desc" placeholder="e.g. Venue Booking for Debate Tournament" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);" required>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Category Cap Rules</label>
            <select id="expense-category" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);">
              <option value="Events">Events (Max $500 cap)</option>
              <option value="Supplies">Supplies (Max $800 cap)</option>
              <option value="Marketing">Marketing (Max $400 cap)</option>
              <option value="Infrastructure">Infrastructure (Max $2000 cap)</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Amount (XLM)</label>
            <input type="number" step="0.01" id="expense-amount" placeholder="450.00" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--hairline-strong);" required>
          </div>
          <button type="submit" class="btn" style="min-height:42px;">Submit Request</button>
        </form>
      </div>

      <!-- Member Dispute Section -->
      ${
        disputes.length > 0
          ? `
        <div class="card" style="margin-bottom:36px; border-left:6px solid var(--red); background:var(--red-soft);">
          <h3 style="font-size:18px; color:var(--red); margin-bottom:8px;">⚠️ Active Member Disputes (${disputes.length})</h3>
          ${disputes
            .map(
              (d) => `
            <div style="font-size:13.5px; margin-bottom:6px;">
              <strong>Expense #${d.expenseId}:</strong> ${d.reason} — <span style="font-family:var(--font-mono); font-size:12px;">Filed by ${formatAddress(d.filer)} at ${d.timestamp}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- Approval Queue Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <h2 style="font-size:22px;">Soroban Approval Queue</h2>
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700; background:var(--green-soft); padding:4px 10px; border-radius:12px;">⚡ Real-Time Event Sync Active</span>
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
      const isFlagged = r.status === 3;
      const count = r.approvals ? r.approvals.length : 1;
      const borderColor = isExecuted ? 'var(--green)' : isFlagged ? 'var(--red)' : 'var(--amber)';

      return `
      <div class="card" style="border-left:6px solid ${borderColor};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:12px;">
          <div>
            <h4 style="font-size:18px; margin-bottom:4px;">${r.description}</h4>
            <span style="font-family:var(--font-mono); font-size:13px; color:var(--ink-soft);">Request #${r.id} • Category: ${r.category || 'Events'} • Amount: $${parseFloat(r.amount).toFixed(2)} XLM</span>
          </div>
          <span class="badge" style="background:${isExecuted ? 'var(--green-soft)' : isFlagged ? 'var(--red-soft)' : 'var(--amber-soft)'}; color:${isExecuted ? 'var(--green)' : isFlagged ? 'var(--red)' : 'var(--amber)'}; font-family:var(--font-mono); font-weight:700; font-size:12px; padding:4px 12px; border-radius:14px; border:1px solid ${isExecuted ? 'var(--green)' : isFlagged ? 'var(--red)' : 'var(--amber)'};">
            ${isExecuted ? `✓ Executed ($${r.amount} Paid)` : isFlagged ? `⚠️ Disputed (Requires 3-of-3)` : `⏳ ${count}/3 Approvals`}
          </span>
        </div>
        <div style="border-top:1px solid var(--hairline); padding-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <span style="font-family:var(--font-mono); font-size:12px; color:var(--ink-faint);">Requested by ${formatAddress(r.requester)}</span>
          <div style="display:flex; gap:8px;">
            ${
              !isExecuted
                ? `
              <button class="btn btn-small btn-approve" data-id="${r.id}">Approve Request</button>
              <button class="btn btn-small btn-outline btn-dispute" data-id="${r.id}" style="color:var(--red); border-color:var(--red);">Flag Dispute</button>
            `
                : `<span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700;">✓ Auto-paid on-chain</span>`
            }
          </div>
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
      const category = document.getElementById('expense-category').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);

      // Validate category spending cap
      const capCheck = validateCategorySpendingCap(amount, category);
      if (!capCheck.valid) {
        showToast(capCheck.error);
        return;
      }

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

  document.querySelectorAll('.btn-dispute').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const address = getStoredAddress();
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const reason = prompt('Enter reason for flagging this expense dispute:');
      if (reason) {
        const res = fileMemberDispute(id, address, reason);
        if (res.success) {
          alert('Dispute recorded! Transaction now requires 3-of-3 signatures.');
          window.location.reload();
        }
      }
    });
  });

  // 5s Polling Loop
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    const requestsData = await fetchSorobanRequests();
    const container = document.getElementById('queue-container');
    if (container) {
      container.innerHTML = renderRequestsList(requestsData.requests, getStoredAddress());
    }
  }, 5000);
}

function showToast(msg) {
  const slot = document.getElementById('toast-slot');
  if (!slot) return;

  const toast = document.createElement('div');
  toast.className = 'state-card state-card--red';
  toast.innerHTML = `<span style="font-weight:700;">✕</span> <span>${msg}</span>`;
  slot.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
