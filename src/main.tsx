import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

declare global {
  interface Window {
    __BIOSFERA_MOUNTED__?: boolean;
    gm_authFailure?: () => void;
  }
}

window.__BIOSFERA_MOUNTED__ = true;

// Auto-recover once if a cached HTML requests an outdated hashed JS/CSS chunk after a Hostinger redeploy
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  try {
    const key = 'biosfera_chunk_reload';
    if (!window.sessionStorage.getItem(key)) {
      window.sessionStorage.setItem(key, '1');
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
});

// Google Maps Platform Demo Key runtime quota & auth failure listener
window.gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  origConsoleError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

const rootEl = document.getElementById('root');
if (rootEl) {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
    try {
      window.sessionStorage.removeItem('biosfera_chunk_reload');
    } catch {
      // Ignore storage access errors
    }
  } catch (err) {
    console.error('Erro ao inicializar a aplicação BIOSFERA:', err);
    rootEl.textContent = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;text-align:center';
    const card = document.createElement('div');
    const heading = document.createElement('h1');
    heading.style.cssText = 'color:#1B6B4A;font-size:20px;margin-bottom:8px';
    heading.textContent = 'BIOSFERA – Consultoria Ambiental';
    const message = document.createElement('p');
    message.style.cssText = 'font-size:14px;margin-bottom:16px';
    message.textContent = 'Não foi possível iniciar a página. Por favor recarregue.';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText =
      'background:#1B6B4A;color:#fff;border:none;border-radius:8px;padding:10px 18px;cursor:pointer';
    btn.textContent = 'Recarregar';
    btn.addEventListener('click', () => window.location.reload());
    card.append(heading, message, btn);
    wrapper.appendChild(card);
    rootEl.appendChild(wrapper);
  }
}
