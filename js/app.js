/**
 * Passbook Yellow Belt — Main Application Controller
 * Features:
 * - Multi-wallet modal support (Freighter, Albedo, xBull, Rabet)
 * - Soroban smart contract expense requests & approvals
 * - Live 5-second polling loop for contract state
 * - 3 Structured Error Categories wired to states.html toasts
 */

import { connectWallet, disconnectWallet, getStoredAddress, getStoredWalletType, formatAddress, SUPPORTED_WALLETS } from './wallet.js';
import { getContractBalance, submitContractRequest, approveContractRequest, fetchContractRequests } from './contract.js';

export const state = {
  address: getStoredAddress() || null,
  walletType: getStoredWalletType() || 'freighter',
  contractBalance: 10000.0,
  requests: [],
  pollingTimer: null,
};

/**
 * Initializes app, sets up multi-wallet modal, and starts 5-second contract polling.
 */
export async function initApp() {
  console.log('⚡ Passbook Yellow Belt (Level 2) Soroban App Initializing...');

  injectWalletModal();
  bindEvents();

  if (state.address) {
    updateUIWithWallet(state.address, state.walletType);
  }

  // Initial contract fetch
  await refreshContractData();

  // 5-second Live Polling Loop
  startPollingLoop();
}

/**
 * Starts 5-second polling loop to update contract request approvals live.
 */
function startPollingLoop() {
  if (state.pollingTimer) clearInterval(state.pollingTimer);
  state.pollingTimer = setInterval(async () => {
    await refreshContractData();
  }, 5000);
}

/**
 * Refreshes balance and pending expense requests from Soroban contract.
 */
export async function refreshContractData() {
  const balRes = await getContractBalance();
  if (balRes.success) {
    state.contractBalance = balRes.balance;
    document.querySelectorAll('.balance-amount').forEach((el) => {
      el.textContent = `$${balRes.formatted} XLM`;
    });
  }

  const reqRes = await fetchContractRequests();
  if (reqRes.success) {
    state.requests = reqRes.requests;
    renderApprovalQueue(reqRes.requests);
  }
}

/**
 * Renders the live Soroban Contract Approval Queue on dashboard.
 * @param {Array} requests
 */
function renderApprovalQueue(requests) {
  const container = document.getElementById('approvalQueueContainer');
  if (!container) return;

  if (!requests || requests.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:24px; color:var(--ink-faint); font-family:var(--font-mono); font-size:13px;">
        No pending expense requests in contract queue.
      </div>
    `;
    return;
  }

  const html = requests.map((req) => {
    const isExecuted = req.status === 2;
    const isApproved = req.status === 1;
    const count = req.approvals.length;
    const userHasApproved = state.address && req.approvals.includes(state.address);

    let statusBadge = `<span style="font-family:var(--font-mono); font-size:11px; padding:3px 8px; border-radius:10px; background:var(--amber-soft); color:var(--amber); font-weight:600;">⏳ ${count}/3 Approvals</span>`;
    if (isExecuted) {
      statusBadge = `<span style="font-family:var(--font-mono); font-size:11px; padding:3px 8px; border-radius:10px; background:var(--green-soft); color:var(--green); font-weight:600;">✓ Executed ($${req.amount} Paid)</span>`;
    }

    return `
      <div class="card" style="margin-bottom:12px; border-left:4px solid ${isExecuted ? 'var(--green)' : 'var(--amber)'};">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="margin:0; font-size:16px;">${req.description}</h4>
            <p style="font-size:12.5px; color:var(--ink-soft); font-family:var(--font-mono); margin-top:2px;">
              Request #${req.id} • Amount: $${req.amount} XLM • By ${formatAddress(req.requester)}
            </p>
          </div>
          ${statusBadge}
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; pt-8; border-top:1px solid var(--hairline); flex-wrap:wrap; gap:8px;">
          <div style="font-size:12px; color:var(--ink-faint); font-family:var(--font-mono);">
            Approvers: ${req.approvals.map((a) => formatAddress(a)).join(', ')}
          </div>
          ${
            isExecuted
              ? `<span style="font-size:12.5px; color:var(--green); font-weight:600;">✓ Auto-paid on-chain</span>`
              : `<button class="btn btn-small ${userHasApproved ? 'btn-outline' : ''}" type="button" 
                  onclick="handleApproveExpense(${req.id})" ${userHasApproved ? 'disabled' : ''}>
                  ${userHasApproved ? '✓ Approved by you' : 'Approve Request'}
                </button>`
          }
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * User submits an expense request to Soroban contract.
 */
export async function handleExpenseSubmission(description, amount) {
  if (!state.address) {
    showStructuredError('WALLET_NOT_FOUND', 'Wallet not connected. Please select your wallet first.');
    return;
  }

  showAppToast('Submitting request to Soroban smart contract…');

  const res = await submitContractRequest(state.address, description, parseFloat(amount));
  if (res.success) {
    showAppToast(`🎉 Expense request #${res.requestId} submitted on Soroban contract!`);
    await refreshContractData();
  } else {
    handleContractError(res.error);
  }
}

/**
 * User approves an expense request on Soroban contract.
 * @param {number} requestId
 */
export async function handleApproveExpense(requestId) {
  if (!state.address) {
    showStructuredError('WALLET_NOT_FOUND', 'Please connect your wallet to approve this expense.');
    return;
  }

  showAppToast('Signing & approving expense on Soroban contract…');

  const res = await approveContractRequest(state.address, requestId);
  if (res.success) {
    if (res.executed) {
      showAppToast('🎉 2-of-3 threshold reached! Expense auto-executed & paid out on-chain!');
    } else {
      showAppToast(`✓ Approval recorded (${res.approvalCount}/3 approvers).`);
    }
    await refreshContractData();
  } else {
    handleContractError(res.error);
  }
}

/**
 * Handles the 3 required Yellow Belt error categories and renders matching states.html toasts.
 * @param {string} errorString
 */
export function handleContractError(errorString = '') {
  if (errorString.includes('WALLET_NOT') || errorString.includes('NOT_INSTALLED')) {
    showStructuredError('WALLET_NOT_FOUND', 'Wallet extension not found. Please install Freighter, Albedo, or xBull.');
  } else if (errorString.includes('USER_REJECTED') || errorString.includes('declined')) {
    showStructuredError('USER_REJECTED', 'Transaction rejected by user in wallet. No changes recorded.');
  } else if (errorString.includes('INSUFFICIENT_BALANCE')) {
    showStructuredError('INSUFFICIENT_BALANCE', 'Insufficient treasury balance to cover expense + network fee.');
  } else {
    showStructuredError('GENERIC', errorString || 'That request couldn’t be recorded — check wallet connection.');
  }
}

/**
 * Displays styled toast matching states.html design system.
 */
export function showStructuredError(type, message) {
  let badge = '⚠';
  let className = 'state-card--warning';

  if (type === 'USER_REJECTED' || type === 'GENERIC') {
    badge = '✕';
    className = 'state-card--red';
  } else if (type === 'INSUFFICIENT_BALANCE') {
    badge = '⚠';
    className = 'state-card--warning';
  }

  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = `state-card ${className} toast-card`;
  toast.style.cssText = 'box-shadow:0 4px 12px rgba(0,0,0,0.15); pointer-events:auto; margin-top:8px; opacity:0; transform:translateY(10px); transition:all 0.25s ease;';
  toast.innerHTML = `<span>${badge}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

export function showAppToast(msg) {
  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = 'state-card state-card--pending toast-card';
  toast.style.cssText = 'box-shadow:0 4px 12px rgba(0,0,0,0.15); margin-top:8px; opacity:0; transform:translateY(10px); transition:all 0.25s ease;';
  toast.innerHTML = `<span class="spinner"></span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}

function getOrCreateToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:1000; pointer-events:none; display:flex; flex-direction:column; gap:8px; align-items:center; max-width:90vw; width:440px;';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Multi-Wallet Modal Selector Component.
 */
function injectWalletModal() {
  if (document.getElementById('walletModalOverlay')) return;

  const modalHtml = `
    <div id="walletModalOverlay" style="display:none; position:fixed; inset:0; background:rgba(28,43,51,0.6); z-index:999; backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;">
      <div style="background:var(--paper-raised); border:1px solid var(--hairline-strong); border-radius:12px; max-width:400px; width:100%; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0; font-size:18px;">Select Your Wallet</h3>
          <button type="button" id="closeWalletModalBtn" style="background:none; border:none; font-size:20px; cursor:pointer;">✕</button>
        </div>
        <p style="font-size:13.5px; color:var(--ink-soft); margin-bottom:16px;">Choose your preferred Stellar wallet to connect to Passbook Treasury.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${SUPPORTED_WALLETS.map((w) => `
            <button type="button" class="wallet-select-option" data-wallet="${w.id}" style="display:flex; align-items:center; gap:12px; padding:12px; border:1.5px solid var(--hairline-strong); border-radius:8px; background:var(--paper); cursor:pointer; text-align:left; transition:all 0.15s ease;">
              <span style="font-size:24px;">${w.icon}</span>
              <div>
                <div style="font-weight:600; font-size:14.5px; color:var(--ink);">${w.name}</div>
                <div style="font-size:12px; color:var(--ink-faint);">${w.desc}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('closeWalletModalBtn')?.addEventListener('click', hideWalletModal);
  document.querySelectorAll('.wallet-select-option').forEach((opt) => {
    opt.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-wallet');
      hideWalletModal();
      showAppToast(`Connecting to ${id.toUpperCase()} wallet…`);
      const res = await connectWallet(id);
      if (res.success && res.address) {
        updateUIWithWallet(res.address, res.walletType);
        showAppToast(`Connected with ${id.toUpperCase()}!`);
        await refreshContractData();
      } else {
        handleContractError(res.error);
      }
    });
  });
}

export function showWalletModal() {
  const overlay = document.getElementById('walletModalOverlay');
  if (overlay) overlay.style.display = 'flex';
}

export function hideWalletModal() {
  const overlay = document.getElementById('walletModalOverlay');
  if (overlay) overlay.style.display = 'none';
}

export function updateUIWithWallet(addr, walletType) {
  state.address = addr;
  state.walletType = walletType;
  const truncated = formatAddress(addr);

  document.querySelectorAll('.btn-connect-wallet').forEach((btn) => {
    btn.textContent = `✓ ${walletType.toUpperCase()} (${truncated})`;
    btn.classList.add('btn-outline');
  });

  document.querySelectorAll('.avatar').forEach((el) => {
    el.textContent = 'RS';
    el.title = `Connected: ${addr} via ${walletType}`;
  });
}

function bindEvents() {
  document.querySelectorAll('.btn-connect-wallet').forEach((btn) => {
    btn.addEventListener('click', showWalletModal);
  });
}

window.handleApproveExpense = handleApproveExpense;

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initApp);
}
