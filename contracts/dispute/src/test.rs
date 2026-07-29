#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, Address, Env};

#[test]
fn test_dispute_creation_and_retrieval() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PassbookDisputeContract);
    let client = PassbookDisputeContractClient::new(&env, &contract_id);

    let dummy_treasury = Address::generate(&env);
    let filer = Address::generate(&env);

    // Register a dummy contract or mock for inter-contract call
    let treasury_id = env.register_contract(Some(&dummy_treasury), crate::PassbookDisputeContract);

    let dispute_id = client.file_dispute(&treasury_id, &filer, &1, &symbol_short!("Unsure"));
    assert_eq!(dispute_id, 1);

    let rec = client.get_dispute(&1);
    assert_eq!(rec.expense_id, 1);
    assert_eq!(rec.resolved, false);
}

#[test]
fn test_dispute_resolution() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PassbookDisputeContract);
    let client = PassbookDisputeContractClient::new(&env, &contract_id);

    let dummy_treasury = Address::generate(&env);
    let filer = Address::generate(&env);
    let admin = Address::generate(&env);

    let treasury_id = env.register_contract(Some(&dummy_treasury), crate::PassbookDisputeContract);
    let id = client.file_dispute(&treasury_id, &filer, &2, &symbol_short!("Price"));

    client.resolve_dispute(&admin, &id);
    let rec = client.get_dispute(&id);
    assert_eq!(rec.resolved, true);
}
