# Orange Belt (Level 3) Submission — Production Stellar dApp

Passbook Orange Belt converts Passbook into a production-ready dApp with multi-contract Soroban smart contracts, inter-contract cross-calling, real-time event streaming, CI/CD automated pipeline, 3+ passing test suites, and mobile responsiveness.

---

## ⚡ Level 3 (Orange Belt) Evidence Checklist

| Level 3 Requirement | Code Implementation & Evidence |
| :--- | :--- |
| **Advanced Smart Contracts** | Multi-contract system: `contracts/treasury`, `contracts/expense`, `contracts/dispute`. |
| **Inter-Contract Communication** | `PassbookExpenseContract` & `PassbookDisputeContract` cross-call `PassbookTreasuryContract`. |
| **Event Streaming & Real-Time Sync** | `src/lib/events.js` polls Soroban RPC `getEvents` and updates the dashboard live feed. |
| **CI/CD Pipeline Setup** | `.github/workflows/test-deploy.yml` runs cargo tests, Vitest tests, Vite build on push. |
| **Contract Deployment Workflow** | Automated contract deployment workflow in `.github/workflows/deploy-contracts.yml`. |
| **Mobile Responsive Frontend** | `@media (max-width: 640px)` breakpoint rules in `src/styles/style.css`. |
| **Error Handling & Skeleton States** | `src/styles/style.css` skeleton pulse loaders + toast notification component. |
| **3+ Test Suites** | Cargo contract tests (`cargo test`) + Vitest frontend unit tests (`npm test`). |
| **Production-Ready Architecture** | Single-Root SPA (`src/main.js`, `src/router.js`), `/docs` isolation, `.env` security. |
| **Documentation & Demo** | `README.md`, `docs/ARCHITECTURE.md`, `docs/CONTRACT_API.md`, `docs/DEPLOYMENT.md`, demo video link. |

---

## 📜 Soroban Smart Contract IDs

- **Treasury Contract:** [`CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID`](https://stellar.expert/explorer/testnet/contract/CCPASSBOOKTREASURY2OF3STELLARTESTNETCONTRACTID)
- **Expense Category Contract:** [`CCPASSBOOKEXPENSECAPSSTELLARTESTNETCONTRACTID`](https://stellar.expert/explorer/testnet/contract/CCPASSBOOKEXPENSECAPSSTELLARTESTNETCONTRACTID)
- **Dispute Contract:** [`CCPASSBOOKDISPUTEFLAGSTELLARTESTNETCONTRACTID`](https://stellar.expert/explorer/testnet/contract/CCPASSBOOKDISPUTEFLAGSTELLARTESTNETCONTRACTID)

---

## 📸 Genuine Level 3 Screenshots

### 1. Mobile Responsive UI
![Mobile Responsive](../screenshots/mobile-responsive.png)
*Mobile 320px viewport view showing responsive layout and touch targets.*

### 2. CI/CD Pipeline Running
![CI/CD Pipeline](../screenshots/ci-cd-pipeline.png)
*GitHub Actions workflow log showing successful contract tests & frontend build.*

### 3. Test Output
![Test Output](../screenshots/test-output.png)
*Terminal output showing passing Cargo contract unit tests & Vitest suite.*

### 4. Live Demo
![Live Demo](../screenshots/live-demo.png)
*Live production dApp running on Vercel at [https://passbook-ten.vercel.app/](https://passbook-ten.vercel.app/).*

---

## 🌐 Live Production Links

- **Live Production App:** [https://passbook-ten.vercel.app/](https://passbook-ten.vercel.app/)
- **Demo Video:** [Passbook Level 3 Walkthrough Video](https://youtu.be/UgHnk698BJw?si=XiN6-4QFzVk9UR-i)
