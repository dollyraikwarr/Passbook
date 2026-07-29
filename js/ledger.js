/**
 * Passbook — Ledger History Service
 * Fetches recent on-chain transactions and operations from Horizon Testnet for public auditability.
 */

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

/**
 * Fetches formatted transaction history for a Stellar account.
 * @param {string} publicKey
 * @param {number} limit Maximum transactions to return (default 10)
 * @returns {Promise<{ success: boolean, transactions: Array, error?: string }>}
 */
export async function fetchAccountTransactions(publicKey, limit = 10) {
  if (!publicKey) {
    return { success: false, transactions: [], error: 'No public key provided.' };
  }

  try {
    const url = `${HORIZON_URL}/accounts/${publicKey}/transactions?order=desc&limit=${limit}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return { success: true, transactions: [] };
    }

    if (!response.ok) {
      throw new Error(`Horizon API error HTTP ${response.status}`);
    }

    const data = await response.json();
    const records = data._embedded ? data._embedded.records : [];

    const formattedTxList = records.map((tx) => {
      const dateObj = new Date(tx.created_at);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: tx.id,
        hash: tx.hash,
        shortHash: `${tx.hash.slice(0, 6)}…${tx.hash.slice(-6)}`,
        createdAt: formattedDate,
        operationCount: tx.operation_count,
        feeCharged: (parseInt(tx.fee_charged || '100', 10) / 10000000).toFixed(5) + ' XLM',
        memo: tx.memo || 'Multi-sig Account Setup',
        successful: tx.successful,
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
      };
    });

    return {
      success: true,
      transactions: formattedTxList,
    };
  } catch (error) {
    console.error('Ledger fetch error:', error);
    return {
      success: false,
      transactions: [],
      error: error.message || 'Failed to fetch transaction history from Horizon.',
    };
  }
}

/**
 * Generates an HTML table markup representing the public transaction ledger.
 * @param {Array} transactions
 * @returns {string}
 */
export function renderLedgerTable(transactions) {
  if (!transactions || transactions.length === 0) {
    return `
      <div style="text-align:center; padding:24px; color:var(--ink-faint); font-family:var(--font-mono); font-size:13px;">
        No on-chain transactions recorded yet for this treasury.
      </div>
    `;
  }

  const rows = transactions.map((tx) => `
    <tr style="border-bottom:1px solid var(--hairline); font-size:13px;">
      <td style="padding:10px 12px; font-family:var(--font-mono); color:var(--ink-soft);">${tx.createdAt}</td>
      <td style="padding:10px 12px; font-weight:600;">${tx.memo}</td>
      <td style="padding:10px 12px;">
        <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-size:11px; font-family:var(--font-mono); background:var(--green-soft); color:var(--green); font-weight:600;">
          ✓ On-Chain
        </span>
      </td>
      <td style="padding:10px 12px; font-family:var(--font-mono); text-align:right;">
        <a href="${tx.explorerUrl}" target="_blank" rel="noopener" style="color:var(--green); text-decoration:none; font-weight:600;">
          ${tx.shortHash} ↗
        </a>
      </td>
    </tr>
  `).join('');

  return `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:1.5px solid var(--hairline-strong); font-family:var(--font-mono); font-size:11.5px; color:var(--ink-faint); text-transform:uppercase; letter-spacing:.05em;">
            <th style="padding:8px 12px;">Date</th>
            <th style="padding:8px 12px;">Description</th>
            <th style="padding:8px 12px;">Status</th>
            <th style="padding:8px 12px; text-align:right;">Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
