/**
 * modal.js
 * Generic modal controller with focus trap and keyboard support
 */

import { trapFocus } from './utils.js';

export function initModal() {
  const overlay = document.querySelector('.c-modal-overlay');
  if (!overlay) return;

  const modal        = overlay.querySelector('.c-modal');
  const closeTrigger = overlay.querySelector('.c-modal__close');
  const openTriggers = document.querySelectorAll('[data-modal-open]');

  let removeTrap = null;
  let previousFocus = null;

  // ── Open ─────────────────────────────────────────────────────────────────
  function open() {
    previousFocus = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('is-locked');
    overlay.setAttribute('aria-hidden', 'false');

    // Trap focus inside modal
    if (modal) removeTrap = trapFocus(modal);

    // Focus first focusable element
    setTimeout(() => {
      const firstFocusable = modal?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 50);
  }

  // ── Close ────────────────────────────────────────────────────────────────
  function close() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    overlay.setAttribute('aria-hidden', 'true');
    removeTrap?.();
    previousFocus?.focus();
  }

  // ── Event binding ────────────────────────────────────────────────────────
  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', open);
  });

  closeTrigger?.addEventListener('click', close);

  // Close on overlay backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  // Expose API for programmatic use
  return { open, close };
}
