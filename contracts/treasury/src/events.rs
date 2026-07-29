use soroban_sdk::{symbol_short, Address, Env, Symbol};

pub fn emit_expense_proposed(env: &Env, id: u32, amount: i128, category: Symbol, proposer: Address) {
    env.events().publish(
        (symbol_short!("treasury"), symbol_short!("propose")),
        (id, amount, category, proposer),
    );
}

pub fn emit_expense_approved(env: &Env, id: u32, approver: Address, count: u32) {
    env.events().publish(
        (symbol_short!("treasury"), symbol_short!("approve")),
        (id, approver, count),
    );
}

pub fn emit_expense_executed(env: &Env, id: u32, amount: i128) {
    env.events().publish(
        (symbol_short!("treasury"), symbol_short!("execute")),
        (id, amount),
    );
}
