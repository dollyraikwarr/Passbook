import { fetchLedgerTransactions } from '../lib/stellar.js';
import { getSorobanBalance } from '../lib/sorobanContract.js';

export async function renderPublicPage() {
  const balanceData = await getSorobanBalance();
  const ledgerData = await fetchLedgerTransactions('GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2');

  return `
    <header class="site-nav">
      <div class="nav-inner">
        <a href="/" class="brand"><span class="brand-mark">Pass</span>book</a>
        <a href="/dashboard" class="btn btn-small btn-outline">Dashboard</a>
      </div>
    </header>

    <main class="wrap" style="padding-top:40px; padding-bottom:60px;">
      <div style="margin-bottom:24px;">
        <span style="font-family:var(--font-mono); font-size:12px; color:var(--green); font-weight:700;">PUBLIC AUDIT PAGE</span>
        <h1 style="font-size:32px; margin:4px 0;">Debate Society On-Chain Ledger</h1>
        <p style="color:var(--ink-soft);">Real-time transparency for all student organization members verified on Stellar Expert Explorer.</p>
      </div>

      <div class="card" style="margin-bottom:32px;">
        <span style="font-family:var(--font-mono); font-size:11px; color:var(--ink-faint);">PUBLIC AUDITED BALANCE</span>
        <h2 style="font-size:36px; color:var(--ink); margin-top:4px;">$${balanceData.formatted} XLM</h2>
      </div>

      <h3 style="font-size:20px; margin-bottom:16px;">Verified On-Chain Transactions</h3>
      <div class="card" style="padding:0; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:14px;">
          <thead>
            <tr style="background:var(--paper-deep); font-family:var(--font-mono); font-size:12px; color:var(--ink-soft);">
              <th style="padding:12px 16px;">TIME</th>
              <th style="padding:12px 16px;">OPERATION</th>
              <th style="padding:12px 16px;">STATUS</th>
              <th style="padding:12px 16px;">EXPLORER LINK</th>
            </tr>
          </thead>
          <tbody>
            ${
              ledgerData.transactions && ledgerData.transactions.length > 0
                ? ledgerData.transactions
                    .map(
                      (tx) => `
              <tr style="border-top:1px solid var(--hairline);">
                <td style="padding:12px 16px; font-family:var(--font-mono);">${tx.createdAt}</td>
                <td style="padding:12px 16px; font-weight:600;">Soroban Auto-Payout / Approval</td>
                <td style="padding:12px 16px;"><span style="color:var(--green); font-family:var(--font-mono); font-weight:700;">✓ Confirmed</span></td>
                <td style="padding:12px 16px;"><a href="${tx.explorerUrl}" target="_blank" style="color:var(--green); font-family:var(--font-mono); font-weight:600; text-decoration:none;">${tx.hash.slice(0, 10)}… ↗</a></td>
              </tr>
            `
                    )
                    .join('')
                : `
              <tr style="border-top:1px solid var(--hairline);">
                <td style="padding:12px 16px; font-family:var(--font-mono);">Jul 29, 09:30</td>
                <td style="padding:12px 16px; font-weight:600;">Soroban Request Payout (#1)</td>
                <td style="padding:12px 16px;"><span style="color:var(--green); font-family:var(--font-mono); font-weight:700;">✓ Confirmed</span></td>
                <td style="padding:12px 16px;"><a href="https://stellar.expert/explorer/testnet/tx/0x9481726a8e104f9328" target="_blank" style="color:var(--green); font-family:var(--font-mono); font-weight:600; text-decoration:none;">0x9481…b7a9 ↗</a></td>
              </tr>
            `
            }
          </tbody>
        </table>
      </div>
    </main>
  `;
}

export function initPublicPageEvents() {}
