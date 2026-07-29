const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = import.meta.env.VITE_FRIENDBOT_URL || 'https://friendbot.stellar.org';

export async function fetchNativeBalance(publicKey) {
  if (!publicKey) return { success: false, balance: '0.00', rawXlm: 0 };
  try {
    const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    if (res.status === 404) return { success: true, balance: '0.00', rawXlm: 0 };
    const data = await res.json();
    const native = data.balances.find((b) => b.asset_type === 'native');
    const xlm = native ? parseFloat(native.balance) : 0;
    return {
      success: true,
      balance: xlm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      rawXlm: xlm,
    };
  } catch (err) {
    return { success: false, balance: '0.00', rawXlm: 0, error: err.message };
  }
}

export async function fundTestnetAccount(publicKey) {
  try {
    const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
    return { success: res.ok, message: res.ok ? 'Account funded with 10,000 Testnet XLM!' : 'Funding failed.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function fetchLedgerTransactions(publicKey) {
  try {
    const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}/transactions?order=desc&limit=10`);
    if (!res.ok) return { success: true, transactions: [] };
    const data = await res.json();
    const records = data._embedded ? data._embedded.records : [];
    return {
      success: true,
      transactions: records.map((tx) => ({
        id: tx.id,
        hash: tx.hash,
        createdAt: new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
      })),
    };
  } catch (err) {
    return { success: false, transactions: [] };
  }
}
