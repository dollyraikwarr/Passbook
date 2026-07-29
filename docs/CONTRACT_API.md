# Passbook Soroban Smart Contracts API & Event Definitions

## 1. Treasury Contract (`contracts/treasury`)

### Functions
- **`initialize(env, signers: Vec<Address>, initial_balance: i128)`**
  Initializes treasury signers and initial testnet balance.
- **`propose_expense(env, requester: Address, amount: i128, category: Symbol, description: Symbol) -> u32`**
  Submits an expense request for 2-of-3 signers approval.
- **`approve_expense(env, approver: Address, id: u32) -> u32`**
  Co-signer approves request. Triggers automated payout when threshold is met.
- **`flag_transaction(env, id: u32)`**
  Increases approval threshold requirement to 3-of-3 signers when member dispute is filed.

### Events
- **`ExpenseProposed(id, amount, category, proposer)`**
- **`ExpenseApproved(id, approver, count)`**
- **`ExpenseExecuted(id, amount)`**

---

## 2. Expense Category Contract (`contracts/expense`)

### Functions & Spending Caps
- **`set_category_cap(env, category: Symbol, cap: i128)`**
- **`validate_and_propose(env, treasury_id, requester, amount, category, description) -> u32`**
  - **Inter-Contract Call:** Validates `amount <= category_cap`, then invokes `PassbookTreasuryContract::propose_expense(...)`.

---

## 3. Dispute Contract (`contracts/dispute`)

### Functions
- **`file_dispute(env, treasury_id, filer, expense_id, reason) -> u32`**
  - **Inter-Contract Call:** Files on-chain dispute and calls `PassbookTreasuryContract::flag_transaction(...)`.
- **`resolve_dispute(env, admin, dispute_id)`**

### Events
- **`DisputeFiled(dispute_id, expense_id, filer, reason)`**
- **`DisputeResolved(dispute_id, admin)`**
