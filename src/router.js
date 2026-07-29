import { renderHomePage } from './pages/home.js';
import { renderWalletPage, initWalletPageEvents } from './pages/wallet.js';
import { renderOnboardingPage, initOnboardingEvents } from './pages/onboarding.js';
import { renderDashboardPage, initDashboardEvents } from './pages/dashboard.js';
import { renderPublicPage, initPublicPageEvents } from './pages/publicLedger.js';

const routes = {
  '/': { render: renderHomePage, init: () => {} },
  '/wallet': { render: renderWalletPage, init: initWalletPageEvents },
  '/onboarding': { render: renderOnboardingPage, init: initOnboardingEvents },
  '/dashboard': { render: renderDashboardPage, init: initDashboardEvents },
  '/public': { render: renderPublicPage, init: initPublicPageEvents },
};

export async function navigateTo(pathname) {
  window.history.pushState({}, '', pathname);
  await handleRoute();
}

export async function handleRoute() {
  const path = window.location.pathname || '/';
  const route = routes[path] || routes['/'];

  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = await route.render();
    route.init();
  }

  // Intercept local link clicks for SPA routing
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

window.addEventListener('popstate', handleRoute);
