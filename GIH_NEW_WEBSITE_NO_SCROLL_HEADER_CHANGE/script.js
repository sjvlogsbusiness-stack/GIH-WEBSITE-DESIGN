(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $('.menu-toggle');
  const nav = $('.nav-links');

  if (menuToggle && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('nav-open', open);
    };

    menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    $$('.nav-links a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  // Keep the header visually stable while scrolling.
  // The fixed navigation should not change state or slide when the page moves.
  const header = $('.header');
  if (header) header.classList.remove('scrolled');

  // Fixed-header anchor scrolling (same-page and cross-page links).
  const scrollToHash = (hash, updateUrl = false) => {
    if (!hash || hash === '#') return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    const headerEl = document.querySelector('.header');
    const offset = (headerEl ? headerEl.getBoundingClientRect().height : 0) + 18;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    if (updateUrl) history.pushState(null, '', hash);
    return true;
  };

  $$('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;
      if (url.pathname === window.location.pathname || url.pathname.endsWith('/index.html') && window.location.pathname.endsWith('/index.html')) {
        if (scrollToHash(url.hash, true)) event.preventDefault();
      }
    });
  });

  // If arriving from projects.html with #about/#services/etc., wait for layout then align below the fixed header.
  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToHash(window.location.hash, false), 60);
    });
  }

  // Scroll reveal with a single observer instead of one observer per card.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Scroll progress.
  const progress = $('.page-progress');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Current year.
  $$('#year').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Prevent accidental submission when Netlify Forms is unavailable locally.
  // On Netlify, the form uses native POST submission so input is handled server-side.
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', () => {
      const message = $('#formMessage');
      if (message) message.textContent = 'Sending your enquiry…';
    });
  }
})();
