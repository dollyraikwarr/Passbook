export const CONTRACT_ADDRESS = 'CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID';

const mockStore = {
  balance: 10000.0,
  requests: [
    {
      id: 1,
      description: 'Debate Tournament Travel & Entry Fees',
      amount: 450.0,
      requester: 'GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2',
      approvals: ['GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2'],
      status: 0,
      createdAt: 'Jul 29, 09:30',
    },
  ],
};

export async function getSorobanBalance() {
  return {
    success: true,
    balance: mockStore.balance,
    formatted: mockStore.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  };
}

export async function submitSorobanRequest(requester, description, amount) {
  if (!requester) return { success: false, error: 'WALLET_NOT_FOUND' };
  if (amount + 0.1 > mockStore.balance) return { success: false, error: 'INSUFFICIENT_BALANCE' };

  const id = mockStore.requests.length + 1;
  const req = {
    id,
    description,
    amount,
    requester,
    approvals: [requester],
    status: 0,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  mockStore.requests.unshift(req);
  return { success: true, requestId: id };
}

export async function approveSorobanRequest(approver, requestId) {
  if (!approver) return { success: false, error: 'WALLET_NOT_FOUND' };
  const req = mockStore.requests.find((r) => r.id === requestId);
  if (!req) return { success: false, error: 'REQUEST_NOT_FOUND' };
  if (req.status === 2) return { success: false, error: 'ALREADY_EXECUTED' };

  if (!req.approvals.includes(approver)) req.approvals.push(approver);

  let executed = false;
  if (req.approvals.length >= 2) {
    if (mockStore.balance < req.amount) return { success: false, error: 'INSUFFICIENT_BALANCE' };
    mockStore.balance -= req.amount;
    req.status = 2;
    executed = true;
  } else {
    req.status = 1;
  }
  return { success: true, count: req.approvals.length, executed, status: req.status };
}

export async function fetchSorobanRequests() {
  return { success: true, requests: [...mockStore.requests] };
}
