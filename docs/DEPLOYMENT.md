# Passbook Deployment Guide

## Testnet Deployment
- **Horizon URL:** `https://horizon-testnet.stellar.org`
- **Soroban RPC URL:** `https://soroban-testnet.stellar.org`
- **Network Passphrase:** `Test SDF Network ; September 2015`
- **Treasury Contract Address:** `CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID`

## Local Development
```bash
npm install
npm run dev
```

## Production Live Vercel Deployment
- **Live URL:** [https://passbook-ten.vercel.app/](https://passbook-ten.vercel.app/)

Passbook includes `vercel.json` for seamless Single Page Application routing on Vercel:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```
