#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol, Vec};

pub mod events;

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct ExpenseRequest {
    pub id: u32,
    pub description: Symbol,
    pub amount: i128,
    pub category: Symbol,
    pub requester: Address,
    pub approvals: Vec<Address>,
    pub status: u32, // 0: Pending, 1: Approved, 2: Executed, 3: Flagged/Disputed
}

#[contracttype]
pub enum DataKey {
    ClubBalance,
    Request(u32),
    RequestCount,
    Signers,
}

#[contract]
pub struct PassbookTreasuryContract;

#[contractimpl]
impl PassbookTreasuryContract {
    pub fn initialize(env: Env, signers: Vec<Address>, initial_balance: i128) {
        env.storage().instance().set(&DataKey::ClubBalance, &initial_balance);
        env.storage().instance().set(&DataKey::Signers, &signers);
        env.storage().instance().set(&DataKey::RequestCount, &0u32);
    }

    pub fn propose_expense(env: Env, requester: Address, amount: i128, category: Symbol, description: Symbol) -> u32 {
        requester.require_auth();
        let count: u32 = env.storage().instance().get(&DataKey::RequestCount).unwrap_or(0);
        let id = count + 1;

        let mut approvals = Vec::new(&env);
        approvals.push_back(requester.clone());

        let req = ExpenseRequest {
            id,
            description,
            amount,
            category,
            requester: requester.clone(),
            approvals,
            status: 0,
        };

        env.storage().instance().set(&DataKey::Request(id), &req);
        env.storage().instance().set(&DataKey::RequestCount, &id);

        events::emit_expense_proposed(&env, id, amount, category, requester);
        id
    }

    pub fn approve_expense(env: Env, approver: Address, id: u32) -> u32 {
        approver.require_auth();
        let mut req: ExpenseRequest = env.storage().instance().get(&DataKey::Request(id)).expect("Request not found");
        
        if req.status == 2 {
            panic!("Already executed");
        }

        if !req.approvals.contains(&approver) {
            req.approvals.push_back(approver.clone());
        }

        let approval_count = req.approvals.len();
        events::emit_expense_approved(&env, id, approver, approval_count);

        let required_threshold = if req.status == 3 { 3u32 } else { 2u32 };

        if approval_count >= required_threshold {
            let mut balance: i128 = env.storage().instance().get(&DataKey::ClubBalance).unwrap_or(0);
            if balance < req.amount {
                panic!("Insufficient treasury balance");
            }
            balance -= req.amount;
            req.status = 2;
            env.storage().instance().set(&DataKey::ClubBalance, &balance);
            events::emit_expense_executed(&env, id, req.amount);
        } else {
            req.status = 1;
        }

        env.storage().instance().set(&DataKey::Request(id), &req);
        req.status
    }

    pub fn flag_transaction(env: Env, id: u32) {
        let mut req: ExpenseRequest = env.storage().instance().get(&DataKey::Request(id)).expect("Request not found");
        if req.status != 2 {
            req.status = 3; // Set to Flagged/Disputed
            env.storage().instance().set(&DataKey::Request(id), &req);
        }
    }

    pub fn get_balance(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::ClubBalance).unwrap_or(0)
    }

    pub fn get_request(env: Env, id: u32) -> ExpenseRequest {
        env.storage().instance().get(&DataKey::Request(id)).expect("Request not found")
    }
}

#[cfg(test)]
mod test;
