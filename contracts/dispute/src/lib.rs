#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct DisputeRecord {
    pub id: u32,
    pub expense_id: u32,
    pub filer: Address,
    pub reason: Symbol,
    pub timestamp: u64,
    pub resolved: bool,
}

#[contracttype]
pub enum DataKey {
    Dispute(u32),
    DisputeCount,
}

// Inter-contract client interface for Passbook Treasury Contract
pub mod treasury_contract {
    use soroban_sdk::contractclient;

    #[contractclient(name = "TreasuryClient")]
    pub trait PassbookTreasuryInterface {
        fn flag_transaction(env: soroban_sdk::Env, id: u32);
    }
}

#[contract]
pub struct PassbookDisputeContract;

#[contractimpl]
impl PassbookDisputeContract {
    pub fn file_dispute(env: Env, treasury_id: Address, filer: Address, expense_id: u32, reason: Symbol) -> u32 {
        filer.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::DisputeCount).unwrap_or(0);
        let dispute_id = count + 1;

        let record = DisputeRecord {
            id: dispute_id,
            expense_id,
            filer: filer.clone(),
            reason,
            timestamp: env.ledger().timestamp(),
            resolved: false,
        };

        env.storage().instance().set(&DataKey::Dispute(dispute_id), &record);
        env.storage().instance().set(&DataKey::DisputeCount, &dispute_id);

        // Emit DisputeFiled event
        env.events().publish(
            (symbol_short!("dispute"), symbol_short!("filed")),
            (dispute_id, expense_id, filer, reason),
        );

        // Inter-Contract Call to Treasury Contract to flag transaction
        let client = treasury_contract::TreasuryClient::new(&env, &treasury_id);
        client.flag_transaction(&expense_id);

        dispute_id
    }

    pub fn resolve_dispute(env: Env, admin: Address, dispute_id: u32) {
        admin.require_auth();

        let mut record: DisputeRecord = env.storage().instance().get(&DataKey::Dispute(dispute_id)).expect("Dispute not found");
        record.resolved = true;
        env.storage().instance().set(&DataKey::Dispute(dispute_id), &record);

        env.events().publish(
            (symbol_short!("dispute"), symbol_short!("resolved")),
            (dispute_id, admin),
        );
    }

    pub fn get_dispute(env: Env, dispute_id: u32) -> DisputeRecord {
        env.storage().instance().get(&DataKey::Dispute(dispute_id)).expect("Dispute not found")
    }
}

#[cfg(test)]
mod test;
