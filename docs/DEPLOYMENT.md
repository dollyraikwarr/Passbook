# Passbook Deployment Guide

## Testnet Deployment
- **Horizon URL:** `https://horizon-testnet.stellar.org`
- **Soroban RPC URL:** `https://soroban-testnet.stellar.org`
- **Network Passphrase:** `Test SDF Network ; September 2015`
- **Contract Address:** `CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID`

## Local Development
```bash
npm install
npm run dev
```

## Vercel Deployment
Passbook includes `vercel.json` for seamless Single Page Application routing on Vercel:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
