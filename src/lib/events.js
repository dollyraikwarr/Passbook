const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

let eventListeners = [];

export function subscribeToContractEvents(callback) {
  eventListeners.push(callback);
  return () => {
    eventListeners = eventListeners.filter((cb) => cb !== callback);
  };
}

export function notifyEventListeners(eventData) {
  eventListeners.forEach((cb) => cb(eventData));
}

export async function pollContractEvents(contractId) {
  try {
    const res = await fetch(SOROBAN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getEvents',
        params: {
          startLedger: 100,
          filters: [{ type: 'contract', contractIds: [contractId || 'CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID'] }],
        },
      }),
    });
    if (!res.ok) return { success: false, events: [] };
    const data = await res.json();
    return { success: true, events: data.result ? data.result.events : [] };
  } catch (err) {
    return { success: false, events: [] };
  }
}
