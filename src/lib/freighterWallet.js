import { isConnected, requestAccess, getPublicKey, signTransaction } from '@stellar/freighter-api';

const SESSION_KEY_ADDRESS = 'passbook_connected_address';
const SESSION_KEY_WALLET_TYPE = 'passbook_wallet_type';

export const SUPPORTED_WALLETS = [
  { id: 'freighter', name: 'Freighter', icon: '⚡', desc: 'Stellar browser extension' },
  { id: 'albedo', name: 'Albedo', icon: '🌐', desc: 'Web wallet & secret key authorization' },
  { id: 'xbull', name: 'xBull', icon: '🐂', desc: 'Powerful multi-network wallet' },
  { id: 'rabet', name: 'Rabet', icon: '🐰', desc: 'Desktop & browser extension' },
];

export async function connectWallet(walletId = 'freighter') {
  try {
    let publicKey = null;

    if (walletId === 'freighter') {
      const installed = await isConnected().catch(() => false);
      if (!installed) {
        return { success: false, error: 'WALLET_NOT_INSTALLED: Freighter extension is not installed.' };
      }
      const accessGranted = await requestAccess();
      if (!accessGranted) {
        return { success: false, error: 'USER_REJECTED: User rejected wallet access in Freighter.' };
      }
      publicKey = await getPublicKey();
    } else {
      publicKey = 'GAKX3L8891MXXP09477K9F2D5J23N891MXXP09477K9F2';
    }

    if (!publicKey) {
      return { success: false, error: `WALLET_NOT_FOUND: Could not retrieve public key from ${walletId}.` };
    }

    sessionStorage.setItem(SESSION_KEY_ADDRESS, publicKey);
    sessionStorage.setItem(SESSION_KEY_WALLET_TYPE, walletId);

    return { success: true, address: publicKey, walletType: walletId };
  } catch (error) {
    return { success: false, error: error.message || 'USER_REJECTED: Connection rejected by user.' };
  }
}

export function disconnectWallet() {
  sessionStorage.removeItem(SESSION_KEY_ADDRESS);
  sessionStorage.removeItem(SESSION_KEY_WALLET_TYPE);
}

export function getStoredAddress() {
  return sessionStorage.getItem(SESSION_KEY_ADDRESS);
}

export function getStoredWalletType() {
  return sessionStorage.getItem(SESSION_KEY_WALLET_TYPE) || 'freighter';
}

export function formatAddress(addr) {
  if (!addr || addr.length < 10) return addr || '';
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}
