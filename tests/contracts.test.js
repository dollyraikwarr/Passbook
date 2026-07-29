import { describe, it, expect } from 'vitest';
import { submitSorobanRequest, approveSorobanRequest, getSorobanBalance } from '../src/lib/sorobanContract.js';

describe('Soroban Multi-Contract RPC Client', () => {
  it('should fetch Soroban contract balance', async () => {
    const res = await getSorobanBalance();
    expect(res.success).toBe(true);
    expect(res.balance).toBeGreaterThan(0);
  });

  it('should reject expense submission without wallet address', async () => {
    const res = await submitSorobanRequest(null, 'Test Request', 100);
    expect(res.success).toBe(false);
    expect(res.error).toBe('WALLET_NOT_FOUND');
  });

  it('should reject request exceeding treasury balance limit', async () => {
    const res = await submitSorobanRequest('GDKX123', 'Exceeding Request', 999999999);
    expect(res.success).toBe(false);
    expect(res.error).toBe('INSUFFICIENT_BALANCE');
  });

  it('should increment approval count and execute when threshold met', async () => {
    const requester = 'GDKX_REQUESTER';
    const subRes = await submitSorobanRequest(requester, 'Club Banners', 150);
    expect(subRes.success).toBe(true);

    const approver2 = 'GDKX_APPROVER_2';
    const appRes = await approveSorobanRequest(approver2, subRes.requestId);
    expect(appRes.success).toBe(true);
    expect(appRes.executed).toBe(true);
  });
});
