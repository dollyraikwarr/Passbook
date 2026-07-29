/**
 * Passbook — Multi-Sig Transaction Service (Stellar SDK)
 * Builds, signs, and submits 2-of-3 multi-signature account setup & expense transactions on Testnet.
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { signWithFreighter } from './wallet.js';

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Validates a Stellar Public Key format (starts with G, 56 uppercase chars).
 * @param {string} key
 * @returns {boolean}
 */
export function isValidPublicKey(key) {
  if (!key) return false;
  return StellarSdk.StrKey.isValidEd25519PublicKey(key.trim());
}

/**
 * Builds and submits a 2-of-3 multi-signature account configuration transaction on Stellar Testnet.
 * Configures the source account with two additional signers and sets thresholds (low=1, med=2, high=2).
 * 
 * @param {Object} params
 * @param {string} params.treasurerPublicKey Main wallet public key (master signer)
 * @param {string} [params.coSigner1PublicKey] Optional public key for co-signer 1
 * @param {string} [params.coSigner2PublicKey] Optional public key for co-signer 2
 * @returns {Promise<{ success: boolean, hash?: string, ledger?: number, error?: string }>}
 */
export async function createMultiSigAccount({ treasurerPublicKey, coSigner1PublicKey, coSigner2PublicKey }) {
  try {
    if (!treasurerPublicKey) {
      return { success: false, error: 'Treasurer wallet key is required.' };
    }

    // 1. Fetch current account state from Horizon
    const account = await server.loadAccount(treasurerPublicKey);

    // 2. Generate deterministic or provided fallback testnet keys if not specified
    let signer1 = coSigner1PublicKey?.trim();
    let signer2 = coSigner2PublicKey?.trim();

    // Fallback valid keys for demo simulation if user entered names without full keys
    if (!signer1 || !isValidPublicKey(signer1)) {
      const keypair1 = StellarSdk.Keypair.random();
      signer1 = keypair1.publicKey();
    }
    if (!signer2 || !isValidPublicKey(signer2)) {
      const keypair2 = StellarSdk.Keypair.random();
      signer2 = keypair2.publicKey();
    }

    // 3. Build Transaction with SetOptions operations
    const builder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Operation 1: Add Co-signer 1 (weight 1)
    builder.addOperation(
      StellarSdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: signer1,
          weight: 1,
        },
      })
    );

    // Operation 2: Add Co-signer 2 (weight 1)
    builder.addOperation(
      StellarSdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: signer2,
          weight: 1,
        },
      })
    );

    // Operation 3: Set Thresholds (low=1, med=2, high=2, masterWeight=1)
    builder.addOperation(
      StellarSdk.Operation.setOptions({
        masterWeight: 1,
        lowThreshold: 1,
        medThreshold: 2,
        highThreshold: 2,
      })
    );

    // Build unsigned transaction
    const transaction = builder.setTimeout(180).build();
    const unsignedXdr = transaction.toXDR();

    // 4. Request Freighter signature
    const signResult = await signWithFreighter(unsignedXdr, NETWORK_PASSPHRASE);
    if (!signResult.success || !signResult.signedXdr) {
      return { success: false, error: signResult.error || 'Transaction signing failed.' };
    }

    // 5. Re-construct signed transaction & submit to Horizon
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signResult.signedXdr, NETWORK_PASSPHRASE);
    const submitResult = await server.submitTransaction(signedTx);

    return {
      success: true,
      hash: submitResult.hash,
      ledger: submitResult.ledger,
      signer1,
      signer2,
    };
  } catch (error) {
    console.error('Multi-sig account creation error:', error);
    
    // Extract detailed Horizon operation error if present
    let detail = error.message;
    if (error.response?.data?.extras?.result_codes) {
      detail = `Stellar Error: ${JSON.stringify(error.response.data.extras.result_codes)}`;
    }

    return {
      success: false,
      error: detail || 'Failed to submit multi-sig transaction to Stellar Testnet.',
    };
  }
}
