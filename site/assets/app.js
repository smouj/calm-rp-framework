'use strict';
(() => {
  const root = document.documentElement;
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

  // The clone command copy helper is the only interactive extra; the page is informational.
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
})();
