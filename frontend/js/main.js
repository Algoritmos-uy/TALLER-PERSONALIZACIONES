/**
 * main.js — Entry point
 * Inicializa todos los módulos y carga datos dinámicos
 */

import { initMenu }          from './modules/menu.js';
import { initModal }         from './modules/modal.js';
import { initChatbot }       from './modules/chatbot.js';
import { initReveal, scrollTo } from './modules/utils.js';
import { loadLocal }         from './modules/api.js';
import { renderProductGrid } from './components/productCard.js';
import { renderCourseGrid }  from './components/courseCard.js';

// ---------------------------------------------------------------------------
// Theme helpers: persisten la preferencia en localStorage y actualizan
// el atributo `data-theme` en <html>. Mantienen también la meta tag
// `theme-color` para que el color del tema se refleje en dispositivos móviles.
// ---------------------------------------------------------------------------
function setThemePreference(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (meta) meta.setAttribute('content', '#faf7f0');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    if (meta) meta.setAttribute('content', '#111009');
  }
}

function updateThemeToggleUI() {
  const btn = document.querySelector('.c-theme-toggle');
  if (!btn) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  const icon = btn.querySelector('.c-theme-toggle__icon');
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
}

function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (stored === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    // Si no hay preferencia guardada, respetar la preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  updateThemeToggleUI();
}

function initThemeToggle() {
  const btn = document.querySelector('.c-theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    setThemePreference(isLight ? 'dark' : 'light');
    updateThemeToggleUI();
  });
}

async function init() {
  // ── Core UI ───────────────────────────────────────────────────────────────
  initMenu();
  initModal();
  initChatbot();
  initReveal();

  // ── Tema (toggle) ───────────────────────────────────────────────────────
  initTheme();
  initThemeToggle();

  // ── Smooth scroll para todos los links de anclaje ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      scrollTo(href);
    });
  });

  // ── Footer año dinámico ───────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Cargar y renderizar productos ─────────────────────────────────────────
  try {
    const products = await loadLocal('./data/products.json');
    renderProductGrid(products, 'all');
    initReveal(); // observar nuevas cards

    // Category filter tabs
    const tabs = document.querySelectorAll('.c-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderProductGrid(products, btn.dataset.filter || 'all');
        // Re-iniciar reveal en las nuevas cards
        setTimeout(initReveal, 50);
      });
    });

  } catch (err) {
    console.warn('[MusaCreativa] No se pudieron cargar productos:', err.message);
  }

  // ── Cargar y renderizar cursos ────────────────────────────────────────────
  try {
    const courses = await loadLocal('./data/courses.json');
    renderCourseGrid(courses);
    setTimeout(initReveal, 50);
  } catch (err) {
    console.warn('[MusaCreativa] No se pudieron cargar cursos:', err.message);
    // El placeholder HTML ya está en el DOM como fallback
  }
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
