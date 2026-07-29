#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RequestStatus {
    Pending = 0,
    Approved = 1,
    Executed = 2,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ExpenseRequest {
    pub id: u32,
    pub description: String,
    pub amount: i128,
    pub requester: Address,
    pub approvals: Vec<Address>,
    pub status: u32, // 0 = Pending, 1 = Approved, 2 = Executed
}

#[contracttype]
pub enum DataKey {
    Approvers,
    Threshold,
    RequestCount,
    Request(u32),
    ClubBalance,
}

#[contract]
pub struct PassbookTreasuryContract;

#[contractimpl]
impl PassbookTreasuryContract {
    /// Initializes the treasury contract with 3 e-board approver addresses and sets threshold to 2.
    pub fn initialize(env: Env, approver1: Address, approver2: Address, approver3: Address) -> bool {
        if env.storage().instance().has(&DataKey::Approvers) {
            panic!("Contract already initialized");
        }

        let mut approvers = Vec::new(&env);
        approvers.push_back(approver1);
        approvers.push_back(approver2);
        approvers.push_back(approver3);

        env.storage().instance().set(&DataKey::Approvers, &approvers);
        env.storage().instance().set(&DataKey::Threshold, &2u32);
        env.storage().instance().set(&DataKey::RequestCount, &0u32);
        env.storage().instance().set(&DataKey::ClubBalance, &10000_0000000i128); // Initialized with 10k XLM

        true
    }

    /// Submits a new expense request to the contract.
    pub fn submit_request(env: Env, requester: Address, description: String, amount: i128) -> u32 {
        requester.require_auth();

        let mut count: u32 = env.storage().instance().get(&DataKey::RequestCount).unwrap_or(0);
        count += 1;

        let mut initial_approvals = Vec::new(&env);
        initial_approvals.push_back(requester.clone());

        let req = ExpenseRequest {
            id: count,
            description,
            amount,
            requester,
            approvals: initial_approvals,
            status: 0, // Pending
        };

        env.storage().instance().set(&DataKey::Request(count), &req);
        env.storage().instance().set(&DataKey::RequestCount, &count);

        env.events().publish((symbol_short!("submit"), count), req.amount);

        count
    }

    /// Approves an expense request. If threshold (2-of-3) is met, auto-executes the payout.
    pub fn approve_request(env: Env, approver: Address, request_id: u32) -> u32 {
        approver.require_auth();

        // 1. Verify approver is one of the 3 registered approvers
        let approvers: Vec<Address> = env.storage().instance().get(&DataKey::Approvers).expect("Not initialized");
        if !approvers.contains(&approver) {
            panic!("Unauthorized: Caller is not a registered e-board approver");
        }

        // 2. Fetch target request
        let mut req: ExpenseRequest = env.storage().instance().get(&DataKey::Request(request_id)).expect("Request not found");

        if req.status == 2 {
            panic!("Request has already been executed");
        }

        // 3. Add approval if not already present
        if !req.approvals.contains(&approver) {
            req.approvals.push_back(approver);
        }

        let approval_count = req.approvals.len();
        let threshold: u32 = env.storage().instance().get(&DataKey::Threshold).unwrap_or(2);

        // 4. Check if 2-of-3 threshold met for auto-execution
        if approval_count >= threshold {
            let mut balance: i128 = env.storage().instance().get(&DataKey::ClubBalance).unwrap_or(0);
            if balance < req.amount {
                panic!("Insufficient treasury contract balance");
            }
            balance -= req.amount;
            req.status = 2; // Executed
            env.storage().instance().set(&DataKey::ClubBalance, &balance);
            env.events().publish((symbol_short!("executed"), request_id), req.amount);
        } else {
            req.status = 1; // Approved (pending threshold)
            env.events().publish((symbol_short!("approved"), request_id), approval_count);
        }

        env.storage().instance().set(&DataKey::Request(request_id), &req);

        approval_count
    }

    /// Fetches request data by ID.
    pub fn get_request(env: Env, request_id: u32) -> ExpenseRequest {
        env.storage().instance().get(&DataKey::Request(request_id)).expect("Request not found")
    }

    /// Gets current contract treasury balance.
    pub fn get_balance(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::ClubBalance).unwrap_or(0)
    }

    /// Deposits funds into treasury.
    pub fn deposit(env: Env, from: Address, amount: i128) -> i128 {
        from.require_auth();
        let mut balance: i128 = env.storage().instance().get(&DataKey::ClubBalance).unwrap_or(0);
        balance += amount;
        env.storage().instance().set(&DataKey::ClubBalance, &balance);
        balance
    }
}
