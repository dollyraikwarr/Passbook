import { describe, it, expect, beforeEach } from 'vitest';
import { formatAddress, getStoredAddress, disconnectWallet } from '../src/lib/freighterWallet.js';

describe('Freighter Wallet Integration Service', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should format valid public key address correctly', () => {
    const address = 'GDKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2';
    expect(formatAddress(address)).toBe('GDKX…K9F2');
  });

  it('should return empty string for null address', () => {
    expect(formatAddress(null)).toBe('');
  });

  it('should clear stored session on disconnect', () => {
    sessionStorage.setItem('passbook_connected_address', 'GDKX123456');
    disconnectWallet();
    expect(getStoredAddress()).toBeNull();
  });
});
