/**
 * utils.js
 * Shared utility functions across all modules
 */

/**
 * Debounce: limits function call frequency
 * @param {Function} fn
 * @param {number} delay - ms
 */
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format current time as HH:MM
 */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str
 */
export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Wait for n milliseconds
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tokenize a message into text, link and newline tokens for safe typing/rendering.
 * Returns an array of { type: 'text'|'link'|'newline', content }
 * Links are detected by a simple URL regex (http(s)://... or www.).
 */
export function tokenizeMessage(str) {
  if (!str) return [];
  // Normalize CRLF to LF
  const normalized = String(str).replace(/\r\n/g, '\n');

  // Regex to match URLs (http(s) and www.)
  const urlRegex = /((?:https?:\/\/|www\.)[^\s<>]+)/gi;

  const tokens = [];
  // Split by newlines first to preserve explicit breaks
  const lines = normalized.split('\n');
  lines.forEach((line, li) => {
    if (!line) {
      // Empty line -> newline token (preserve as a paragraph break)
      tokens.push({ type: 'newline' });
    } else {
      let lastIndex = 0;
      let match;
      while ((match = urlRegex.exec(line)) !== null) {
        const idx = match.index;
        if (idx > lastIndex) {
          tokens.push({ type: 'text', content: line.slice(lastIndex, idx) });
        }
        let url = match[0];
        // Normalize URL starting with www. to include protocol
        if (url.startsWith('www.')) url = 'http://' + url;
        tokens.push({ type: 'link', content: url });
        lastIndex = idx + match[0].length;
      }
      if (lastIndex < line.length) {
        tokens.push({ type: 'text', content: line.slice(lastIndex) });
      }
    }
    // Between lines, preserve newline (except after last line)
    if (li !== lines.length - 1) tokens.push({ type: 'newline' });
  });

  return tokens;
}

/**
 * Trunca un texto largo añadiendo '…' si supera max longitud
 * @param {string} str
 * @param {number} max
 */
export function truncateText(str, max = 40) {
  const s = String(str || '');
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + '…';
}

/**
 * Add IntersectionObserver reveal animation to elements
 * @param {string} selector - CSS selector for elements to observe
 */
export function initReveal(selector = '.js-reveal') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll to element by id or selector
 * @param {string} target - selector or id (with #)
 */
export function scrollTo(target) {
  const el = document.querySelector(target);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const headerH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--header-height')) || 72;
  window.scrollTo({ top: top - headerH, behavior: 'smooth' });
}

/**
 * Trap focus inside a given container element
 * @param {HTMLElement} container
 */
export function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handleKey(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  container.addEventListener('keydown', handleKey);
  return () => container.removeEventListener('keydown', handleKey);
}
