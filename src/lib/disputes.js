const disputesStore = [];

export function fileMemberDispute(expenseId, filerAddress, reason) {
  if (!filerAddress) return { success: false, error: 'WALLET_NOT_FOUND' };
  if (!reason || reason.trim().length === 0) return { success: false, error: 'Reason is required for filing a dispute.' };

  const record = {
    id: disputesStore.length + 1,
    expenseId,
    filer: filerAddress,
    reason,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Flagged (Requires 3-of-3 Approval)',
  };
  disputesStore.push(record);
  return { success: true, dispute: record };
}

export function getDisputes() {
  return [...disputesStore];
}
