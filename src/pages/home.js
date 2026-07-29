export function renderHomePage() {
  return `
    <header class="site-nav">
      <div class="nav-inner">
        <a href="/" class="brand"><span class="brand-mark">Pass</span>book</a>
        <div style="display:flex; gap:12px;">
          <a href="/wallet" class="btn btn-small btn-outline">Wallet</a>
          <a href="/dashboard" class="btn btn-small">Dashboard</a>
        </div>
      </div>
    </header>

    <main class="wrap" style="padding-top:48px; padding-bottom:64px;">
      <section style="text-align:center; max-width:680px; margin:0 auto 48px;">
        <span style="font-family:var(--font-mono); font-size:12px; font-weight:700; color:var(--green); letter-spacing:1px;">STELLAR TESTNET TREASURY</span>
        <h1 style="font-size:42px; margin:16px 0 16px; color:var(--ink);">Transparent Multi-Sig Treasury for Campus Clubs</h1>
        <p style="font-size:18px; color:var(--ink-soft); margin-bottom:28px;">
          Club dues and expense payouts enforced 2-of-3 on-chain by a Soroban smart contract — eliminate single-treasurer risk forever.
        </p>
        <div style="display:flex; gap:16px; justify-content:center;">
          <a href="/onboarding" class="btn" style="padding:14px 28px; font-size:16px;">Create Club Treasury</a>
          <a href="/public" class="btn btn-outline" style="padding:14px 28px; font-size:16px;">View Public Audit Ledger</a>
        </div>
      </section>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div class="card">
          <h3 style="margin-bottom:8px;">🔑 2-of-3 On-Chain Multi-Sig</h3>
          <p style="color:var(--ink-soft); font-size:14px;">Every payment request requires explicit co-signer signatures before funds execute.</p>
        </div>
        <div class="card">
          <h3 style="margin-bottom:8px;">⚡ Soroban Smart Contract</h3>
          <p style="color:var(--ink-soft); font-size:14px;">Deployed on Stellar Testnet for automated threshold enforcement & instant payouts.</p>
        </div>
        <div class="card">
          <h3 style="margin-bottom:8px;">📖 Public Audit Ledger</h3>
          <p style="color:var(--ink-soft); font-size:14px;">Complete transparency for members with verifiable links on Stellar Expert Explorer.</p>
        </div>
      </div>
    </main>
  `;
}
