/**
 * Passbook — Balance Service (Horizon API & Friendbot Faucet)
 * Fetches native XLM account balances and handles testnet account funding.
 */

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = import.meta.env.VITE_FRIENDBOT_URL || 'https://friendbot.stellar.org';

/**
 * Fetches the native XLM balance for a public key from Horizon Testnet.
 * @param {string} publicKey
 * @returns {Promise<{ success: boolean, balance: string, rawXlm: number, isFunded: boolean, error?: string }>}
 */
export async function fetchBalance(publicKey) {
  if (!publicKey) {
    return { success: false, balance: '0.00', rawXlm: 0, isFunded: false, error: 'No public key provided.' };
  }

  try {
    const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    
    if (response.status === 404) {
      // Account does not exist on testnet yet
      return {
        success: true,
        balance: '0.00',
        rawXlm: 0,
        isFunded: false,
        error: 'Account not funded on Stellar Testnet yet.',
      };
    }

    if (!response.ok) {
      throw new Error(`Horizon error HTTP ${response.status}`);
    }

    const data = await response.json();
    const nativeAsset = data.balances.find((b) => b.asset_type === 'native');
    const xlmAmount = nativeAsset ? parseFloat(nativeAsset.balance) : 0;
    const formattedBalance = xlmAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      success: true,
      balance: formattedBalance,
      rawXlm: xlmAmount,
      isFunded: true,
    };
  } catch (error) {
    console.error('Balance fetch error:', error);
    return {
      success: false,
      balance: '0.00',
      rawXlm: 0,
      isFunded: false,
      error: error.message || 'Failed to fetch balance from Horizon API.',
    };
  }
}

/**
 * Funds a Stellar Testnet account using Friendbot faucet.
 * @param {string} publicKey
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function fundWithFriendbot(publicKey) {
  if (!publicKey) {
    return { success: false, message: 'Invalid address for funding.' };
  }

  try {
    const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Account successfully funded with 10,000 Testnet XLM via Friendbot!',
      };
    } else {
      return {
        success: false,
        message: data.detail || 'Friendbot funding request failed.',
      };
    }
  } catch (error) {
    console.error('Friendbot error:', error);
    return {
      success: false,
      message: 'Failed to reach Stellar Friendbot. Please check internet connection.',
    };
  }
}
