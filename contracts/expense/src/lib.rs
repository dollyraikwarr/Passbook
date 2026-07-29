#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

#[contracttype]
pub enum DataKey {
    CategoryCap(Symbol),
}

// Inter-contract client interface for Passbook Treasury Contract
pub mod treasury_contract {
    use soroban_sdk::contractclient;

    #[contractclient(name = "TreasuryClient")]
    pub trait PassbookTreasuryInterface {
        fn propose_expense(env: soroban_sdk::Env, requester: soroban_sdk::Address, amount: i128, category: soroban_sdk::Symbol, description: soroban_sdk::Symbol) -> u32;
    }
}

#[contract]
pub struct PassbookExpenseContract;

#[contractimpl]
impl PassbookExpenseContract {
    pub fn set_category_cap(env: Env, category: Symbol, cap: i128) {
        env.storage().instance().set(&DataKey::CategoryCap(category), &cap);
    }

    pub fn validate_and_propose(env: Env, treasury_id: Address, requester: Address, amount: i128, category: Symbol, description: Symbol) -> u32 {
        requester.require_auth();
        
        let default_cap: i128 = 500; // $500 category spending cap
        let cap: i128 = env.storage().instance().get(&DataKey::CategoryCap(category)).unwrap_or(default_cap);

        if amount > cap {
            panic!("Expense amount exceeds spending cap");
        }

        // Inter-Contract Call to Treasury Contract
        let client = treasury_contract::TreasuryClient::new(&env, &treasury_id);
        client.propose_expense(&requester, &amount, &category, &description)
    }

    pub fn get_category_cap(env: Env, category: Symbol) -> i128 {
        env.storage().instance().get(&DataKey::CategoryCap(category)).unwrap_or(500)
    }
}

#[cfg(test)]
mod test;
