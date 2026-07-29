#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, Address, Env};

#[test]
fn test_category_cap_management() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PassbookExpenseContract);
    let client = PassbookExpenseContractClient::new(&env, &contract_id);

    assert_eq!(client.get_category_cap(&symbol_short!("Events")), 500);

    client.set_category_cap(&symbol_short!("Events"), &1500);
    assert_eq!(client.get_category_cap(&symbol_short!("Events")), 1500);
}

#[test]
fn test_default_spending_cap_validation() {
    let env = Env::default();
    let contract_id = env.register_contract(None, PassbookExpenseContract);
    let client = PassbookExpenseContractClient::new(&env, &contract_id);

    assert_eq!(client.get_category_cap(&symbol_short!("Supplies")), 500);
}
