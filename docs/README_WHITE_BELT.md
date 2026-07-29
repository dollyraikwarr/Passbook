# Passbook Treasury — White Belt (Level 1) Evidence & Documentation

Passbook is a transparent, multi-signature treasury dApp built for campus clubs and student organizations on **Stellar Testnet**. It enforces 2-of-3 multi-signature authorization before expenses can be paid out, eliminating single-treasurer risk and offering a public audit ledger for all members.

---

## 🚀 Level 1 (White Belt) Evidence Checklist

| Requirement | Code Implementation & Evidence |
| :--- | :--- |
| **Freighter Wallet Setup** | `src/lib/freighterWallet.js` imports `@stellar/freighter-api` and checks extension availability. |
| **Stellar Testnet Integration** | `src/lib/stellar.js` queries Horizon Testnet (`https://horizon-testnet.stellar.org`). |
| **Connect Wallet** | `src/pages/wallet.js` renders **Connect Wallet** button and stores active session. |
| **Disconnect Wallet** | Clears session and updates UI state back to disconnected. |
| **Fetch XLM Balance** | `fetchNativeBalance()` loads native balance from Horizon Testnet. |
| **Display XLM Balance** | Balance Card renders `$XLM` balance in real-time. |
| **2-of-3 Multi-Sig Creation** | `src/lib/stellar.js` builds `SetOptions` multi-sig transaction. |
| **Transaction Feedback** | Shows pending, success, failure, transaction hash, and StellarExpert explorer link. |

---

## 📸 Level 1 Screenshots

### 1. Wallet Connected
![Wallet Connected](../screenshots/wallet-connected.png)
*Connected address displays in navbar; wallet indicator shows active connection.*

### 2. Balance Displayed
![Balance Displayed](../screenshots/balance-displayed.png)
*XLM balance prominently shown on dashboard; Friendbot funding button active.*

### 3. Transaction Success
![Transaction Success](../screenshots/transaction-success.png)
*Multi-sig account creation success message with verifiable transaction hash.*

### 4. Ledger View
![Ledger View](../screenshots/transaction-result.png)
*Transaction history table displaying recent transactions with Stellar Expert links.*
