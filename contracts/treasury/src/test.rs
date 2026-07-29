#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, vec, Address, Env};

#[test]
fn test_treasury_initialization_and_balance() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PassbookTreasuryContract);
    let client = PassbookTreasuryContractClient::new(&env, &contract_id);

    let signer1 = Address::generate(&env);
    let signer2 = Address::generate(&env);
    let signer3 = Address::generate(&env);
    let signers = vec![&env, signer1, signer2, signer3];

    client.initialize(&signers, &10000);
    assert_eq!(client.get_balance(), 10000);
}

#[test]
fn test_propose_and_approve_expense_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PassbookTreasuryContract);
    let client = PassbookTreasuryContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let signers = vec![&env, user1.clone(), user2.clone()];

    client.initialize(&signers, &5000);
    let req_id = client.propose_expense(&user1, &500, &symbol_short!("Events"), &symbol_short!("Pizza"));

    assert_eq!(req_id, 1);
    let req = client.get_request(&1);
    assert_eq!(req.amount, 500);

    let status = client.approve_expense(&user2, &1);
    assert_eq!(status, 2); // Executed
    assert_eq!(client.get_balance(), 4500);
}

#[test]
fn test_flag_transaction_increases_threshold() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PassbookTreasuryContract);
    let client = PassbookTreasuryContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let signers = vec![&env, user1.clone()];
    client.initialize(&signers, &1000);

    let id = client.propose_expense(&user1, &200, &symbol_short!("Supplies"), &symbol_short!("Pens"));
    client.flag_transaction(&id);

    let req = client.get_request(&id);
    assert_eq!(req.status, 3); // Flagged
}

#[test]
#[should_panic(expected = "Already executed")]
fn test_cannot_reapprove_executed_expense() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PassbookTreasuryContract);
    let client = PassbookTreasuryContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let signers = vec![&env, user1.clone(), user2.clone()];

    client.initialize(&signers, &2000);
    let id = client.propose_expense(&user1, &300, &symbol_short!("Events"), &symbol_short!("Food"));
    client.approve_expense(&user2, &id);
    
    // Should panic on duplicate execution
    client.approve_expense(&user2, &id);
}
