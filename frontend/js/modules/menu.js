/**
 * menu.js
 * Handles: hamburger toggle, mobile nav, header scroll state, active nav link
 */

export function initMenu() {
  const header      = document.querySelector('.c-header');
  const hamburger   = document.querySelector('.c-hamburger');
  const mobileNav   = document.querySelector('.c-nav-mobile');
  const mobileLinks = document.querySelectorAll('.c-nav-mobile__link');
  const navLinks    = document.querySelectorAll('.c-nav__link');

  if (!header || !hamburger || !mobileNav) return;

  // ── Header scroll state ──────────────────────────────────────────────────
  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // ── Hamburger toggle ─────────────────────────────────────────────────────
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('is-locked', isOpen);
  });

  // ── Close mobile nav on link click ───────────────────────────────────────
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    });
  });

  // ── Close mobile nav on Escape ───────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      hamburger.focus();
    }
  });

  // ── Active link highlight on scroll ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  const updateActiveLink = () => {
    const scrollY = window.scrollY;
    const headerH = header.offsetHeight;

    sections.forEach(section => {
      const sTop = section.offsetTop - headerH - 60;
      const sBot = sTop + section.offsetHeight;

      if (scrollY >= sTop && scrollY < sBot) {
        const id = section.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}
