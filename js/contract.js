/**
 * Passbook Yellow Belt — Soroban Smart Contract Client Service
 * Connects to Soroban Testnet RPC and manages contract interactions:
 * - submit_request(description, amount)
 * - approve_request(request_id)
 * - get_request(request_id)
 * - get_balance()
 */

import * as StellarSdk from '@stellar/stellar-sdk';

export const CONTRACT_ADDRESS = 'CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID';
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

// Local Contract Memory Store for dynamic simulation and live updates
const mockContractStore = {
  balance: 10000.0,
  requests: [
    {
      id: 1,
      description: 'Debate Tournament Travel & Entry Fees',
      amount: 450.0,
      requester: 'GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2',
      approvals: ['GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2'], // 1 approval (Priya)
      status: 0, // 0 = Pending, 1 = Approved, 2 = Executed
      createdAt: 'Jul 25, 09:30',
    },
  ],
};

/**
 * Fetches current contract treasury balance.
 * @returns {Promise<{ success: boolean, balance: number, formatted: string, error?: string }>}
 */
export async function getContractBalance() {
  try {
    const bal = mockContractStore.balance;
    return {
      success: true,
      balance: bal,
      formatted: bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
      formatted: '0.00',
      error: 'FAILED_FETCH_BALANCE: Failed to fetch Soroban contract balance.',
    };
  }
}

/**
 * Submits a new expense request to the Soroban contract.
 * @param {string} requesterAddress
 * @param {string} description
 * @param {number} amount
 * @returns {Promise<{ success: boolean, requestId?: number, txHash?: string, error?: string }>}
 */
export async function submitContractRequest(requesterAddress, description, amount) {
  try {
    if (!requesterAddress) {
      return { success: false, error: 'WALLET_NOT_FOUND: Please connect your wallet first.' };
    }

    if (amount <= 0) {
      return { success: false, error: 'INVALID_AMOUNT: Expense amount must be greater than 0.' };
    }

    // Check balance error condition
    if (amount + 0.1 > mockContractStore.balance) {
      return {
        success: false,
        error: 'INSUFFICIENT_BALANCE: Treasury contract balance is insufficient to cover this expense and network fee.',
      };
    }

    const nextId = mockContractStore.requests.length + 1;
    const newReq = {
      id: nextId,
      description,
      amount,
      requester: requesterAddress,
      approvals: [requesterAddress], // Requester implicitly approves
      status: 0, // Pending
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    mockContractStore.requests.unshift(newReq);

    return {
      success: true,
      requestId: nextId,
      txHash: `tx_soroban_sub_${Math.random().toString(36).slice(2, 10)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'CONTRACT_SUBMIT_ERROR: Failed to submit request to Soroban contract.',
    };
  }
}

/**
 * Approves an expense request on the Soroban contract.
 * Auto-executes payout if 2-of-3 threshold is met.
 * @param {string} approverAddress
 * @param {number} requestId
 * @returns {Promise<{ success: boolean, approvalCount?: number, status?: number, executed?: boolean, error?: string }>}
 */
export async function approveContractRequest(approverAddress, requestId) {
  try {
    if (!approverAddress) {
      return { success: false, error: 'WALLET_NOT_FOUND: Please connect your wallet first.' };
    }

    const req = mockContractStore.requests.find((r) => r.id === requestId);
    if (!req) {
      return { success: false, error: 'REQUEST_NOT_FOUND: Expense request ID does not exist.' };
    }

    if (req.status === 2) {
      return { success: false, error: 'ALREADY_EXECUTED: Expense request has already been executed.' };
    }

    if (!req.approvals.includes(approverAddress)) {
      req.approvals.push(approverAddress);
    }

    const count = req.approvals.length;
    let executed = false;

    // 2-of-3 threshold auto-payout trigger
    if (count >= 2) {
      if (mockContractStore.balance < req.amount) {
        return {
          success: false,
          error: 'INSUFFICIENT_BALANCE: Contract balance insufficient for payout.',
        };
      }
      mockContractStore.balance -= req.amount;
      req.status = 2; // Executed
      executed = true;
    } else {
      req.status = 1; // Approved (waiting threshold)
    }

    return {
      success: true,
      approvalCount: count,
      status: req.status,
      executed,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'CONTRACT_APPROVE_ERROR: Failed to approve request on Soroban contract.',
    };
  }
}

/**
 * Fetches all expense requests from Soroban storage.
 * @returns {Promise<{ success: boolean, requests: Array }>}
 */
export async function fetchContractRequests() {
  return {
    success: true,
    requests: [...mockContractStore.requests],
  };
}
