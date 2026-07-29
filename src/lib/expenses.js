export const CATEGORY_SPENDING_CAPS = {
  Infrastructure: 2000.0,
  Supplies: 800.0,
  Events: 500.0,
  Marketing: 400.0,
};

export function validateCategorySpendingCap(amount, category) {
  const cap = CATEGORY_SPENDING_CAPS[category] || 500.0;
  if (amount > cap) {
    return {
      valid: false,
      error: `Expense of $${amount} XLM exceeds the $${cap} XLM category cap for ${category}!`,
    };
  }
  return { valid: true };
}
