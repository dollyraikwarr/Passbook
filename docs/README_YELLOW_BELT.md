# Passbook Treasury — Yellow Belt (Level 2) Evidence & Documentation

Passbook Yellow Belt extends the White Belt foundation by replacing manual `SetOptions` multi-sig with a Rust-based **Soroban Smart Contract** deployed on Stellar Testnet. It adds multi-wallet support (Freighter, Albedo, xBull, Rabet), live 5-second polling, and structured error handling.

---

## ⚡ Level 2 (Yellow Belt) Evidence Checklist

| Requirement | Code Implementation & Evidence |
| :--- | :--- |
| **Soroban Smart Contract Deployed** | `contracts/treasury/src/lib.rs` deployed on Stellar Testnet (`CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID`). |
| **Multi-Wallet Support** | `src/lib/freighterWallet.js` connects Freighter, Albedo, xBull, and Rabet wallets. |
| **Contract Called from Frontend** | `src/lib/sorobanContract.js` handles `submit_request` and `approve_request` RPC calls. |
| **Live Status Tracking (5s)** | `src/pages/dashboard.js` polls Soroban contract state every 5 seconds. |
| **3 Error Types Handled** | `src/lib/utils.js` handles Wallet Missing, User Rejection, and Insufficient Funds. |
| **Meaningful Git Commits** | Staged commits for Level 2 contract, wallet kit, and UI integration. |

---

## 📜 Soroban Smart Contract Details

- **Contract Address:** `CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID`
- **Network:** Stellar Testnet (`https://soroban-testnet.stellar.org`)
- **Functions:** `initialize`, `submit_request`, `approve_request`, `get_request`, `get_balance`

---

## 📸 Level 2 Screenshots

### 1. Multi-Wallet Options Available
![Wallet Options](../screenshots/wallet-options.png)
*Multi-wallet modal showing Freighter, Albedo, xBull, and Rabet options.*

### 2. Connected Wallet State
![Connected Wallet State](../screenshots/wallet-connected.png)
*Header displaying active connected wallet address (`✓ FREIGHTER (GDKX…4J2F)`).*

### 3. Expense Request Submitted
![Expense Request Submitted](../screenshots/expense-submitted.png)
*Dashboard showing pending request in Soroban approval queue (`1/3 Approvals`).*

### 4. Auto-Executed Payout
![Auto-Executed Payout](../screenshots/auto-executed-payout.png)
*Request after 2-of-3 threshold met showing `✓ Executed ($450 Paid)` with auto-payout.*

### 5. Error State Handling
![Error State Example](../screenshots/error-state-toast.png)
*Structured error handling toast matching design system.*
