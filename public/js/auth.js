/**
 * auth.js — Client-side auth helpers
 * Talks to /api/auth/* Cloudflare Functions endpoints.
 */

const Auth = (() => {
  const TOKEN_KEY = 'portfolio_token';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    return data;
  }

  async function register(email, password, name) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setToken(data.token);
    return data;
  }

  function logout() {
    clearToken();
    updateNavAuth();
    showToast('Signed out.');
  }

  // Nav UI
  function updateNavAuth() {
    const btn = document.getElementById('auth-btn');
    if (!btn) return;
    if (isLoggedIn()) {
      const user = getUser();
      btn.textContent = 'sign out';
      btn.classList.add('signed-in');
      btn.onclick = () => { logout(); window.location.reload(); };
    } else {
      btn.textContent = 'sign in';
      btn.classList.remove('signed-in');
      btn.onclick = () => { window.location.href = '/login.html'; };
    }
  }

  // call on protected pages
  function requireAuth(redirectBack = true) {
    if (!isLoggedIn()) {
      const dest = redirectBack
        ? `/login.html?next=${encodeURIComponent(window.location.pathname)}`
        : '/login.html';
      window.location.href = dest;
      return false;
    }
    return true;
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    updateNavAuth();
    initTheme();
  });

  return { login, register, logout, isLoggedIn, getUser, getToken, requireAuth, updateNavAuth };
})();

// Theme toggle
function initTheme() {
  // Apply saved theme immediately
  const saved = localStorage.getItem('portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', isDark);
  updateThemeBtn(isDark);
}

function updateThemeBtn(isDark) {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  btn.textContent = isDark ? '☀' : '☾';
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
  updateThemeBtn(isDark);
}

// Toast helper
function showToast(msg, duration = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}
