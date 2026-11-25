'use strict';
(() => {
  const root = document.documentElement;
  // Marks JS availability: reveal animations are gated on this class so the
  // page stays fully visible and readable when JavaScript is disabled.
  root.classList.add('js');

  const toggle = document.getElementById('theme-toggle');
  try {
    if (localStorage.getItem('gta6rp-theme') === 'light') root.dataset.theme = 'light';
  } catch {
    /* local preferences are optional */
  }
  function syncTheme() {
    const light = root.dataset.theme === 'light';
    toggle.setAttribute('aria-label', light ? 'Activar tema oscuro' : 'Activar tema claro');
    toggle.setAttribute('aria-pressed', String(light));
  }
  syncTheme();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('gta6rp-theme', root.dataset.theme);
    } catch {}
    syncTheme();
  });

  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('open', expanded);
  });
  for (const anchor of nav.querySelectorAll('a'))
    anchor.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });

  const filterButtons = document.querySelectorAll('[data-module-filter]');
  const cards = document.querySelectorAll('[data-module-status]');
  for (const button of filterButtons)
    button.addEventListener('click', () => {
      const filter = button.dataset.moduleFilter;
      for (const item of filterButtons) {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      }
      for (const card of cards)
        card.hidden = filter !== 'all' && card.dataset.moduleStatus !== filter;
    });

  // The clone command copy helper is one of the small interactive extras; the
  // page remains informational and fully readable without any JavaScript.
  const copyButton = document.getElementById('copy-clone');
  copyButton.addEventListener('click', async () => {
    const command = document.getElementById('clone-command').textContent;
    try {
      await navigator.clipboard.writeText(command);
      copyButton.textContent = 'Copiado';
    } catch {
      copyButton.textContent = 'Selecciona el texto para copiarlo';
    }
  });

  // --- Header state: glass density once the page scrolls -------------------
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Scroll reveal with stagger --------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );
    for (const el of revealEls) revealObserver.observe(el);
  } else {
    for (const el of revealEls) el.classList.add('revealed');
  }
  for (const group of document.querySelectorAll('[data-stagger]'))
    Array.from(group.children).forEach((child, index) =>
      child.style.setProperty('--d', String(Math.min(index, 8))),
    );

  // --- Scrollspy: highlight the section in view ------------------------------
  const spyLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const spyTargets = spyLinks.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window && spyTargets.length > 0) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            for (const a of spyLinks)
              a.classList.toggle('active', a.hash === '#' + entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const target of spyTargets) spy.observe(target);
  }
})();
