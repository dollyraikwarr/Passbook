# Passbook Architecture Overview

Passbook is a Single Page Application (SPA) built with Vite, vanilla JavaScript, Stellar SDK, and Soroban smart contracts.

## System Architecture

```text
+-------------------------------------------------------+
|                 Browser Frontend (Vite)              |
|   src/pages (home, onboarding, dashboard, public)     |
+--------------------------+----------------------------+
                           |
            +--------------+--------------+
            |                             |
+-----------v-----------+     +-----------v-----------+
|   Freighter & Wallet   |     |   Soroban RPC & SDK   |
|   (StellarWalletsKit)  |     |  (@stellar/stellar-sdk)|
+-----------+-----------+     +-----------+-----------+
            |                             |
+-----------v-----------------------------v-----------+
|               Stellar Testnet Horizon / RPC         |
|   Contract ID: CCPASSBOOKTREASURY2OF3STELLARTESTNET |
+-----------------------------------------------------+
```

## Security Model
- No secret keys are stored or handled in frontend code.
- All signing is delegated to user browser wallets (Freighter, Albedo, xBull, Rabet).
- 2-of-3 threshold is strictly enforced on-chain by Soroban smart contract logic.
