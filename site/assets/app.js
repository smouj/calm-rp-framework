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

  // Browser-only illustration. This is NOT the TypeScript server package or a networked system.
  let balanceAlex;
  let balanceMorgan;
  let ledger;
  let latestCommand;
  let nextRequest;
  const transferForm = document.getElementById('transfer-form');
  const amountInput = document.getElementById('transfer-amount');
  const msg = document.getElementById('demo-message');
  const btnReplay = document.getElementById('demo-replay');
  const ledgerList = document.getElementById('ledger-list');
  const money = (minor) =>
    (minor / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function makeEntry(title, amount, description) {
    const li = document.createElement('li');
    li.className = 'entry';
    const left = document.createElement('div');
    const label = document.createElement('strong');
    label.textContent = title;
    const small = document.createElement('small');
    small.textContent = description;
    left.append(label, document.createElement('br'), small);
    const value = document.createElement('b');
    value.textContent = money(amount);
    li.append(left, value);
    return li;
  }
  function render() {
    document.getElementById('balance-alex').textContent = money(balanceAlex);
    document.getElementById('balance-morgan').textContent = money(balanceMorgan);
    document.getElementById('ledger-count').textContent =
      ledger.length + (ledger.length === 1 ? ' movimiento' : ' movimientos');
    ledgerList.replaceChildren(
      ...ledger.map((row) => makeEntry(row.title, row.amount, row.description)),
    );
    btnReplay.disabled = !latestCommand;
    amountInput.max = String(balanceAlex / 100);
  }
  function reset() {
    balanceAlex = 5000;
    balanceMorgan = 0;
    ledger = [
      {
        title: 'Saldo de ejemplo',
        amount: 5000,
        description: 'seed-001 · inicialización ficticia',
      },
    ];
    latestCommand = null;
    nextRequest = 1;
    amountInput.value = '12.50';
    msg.textContent =
      'Prueba una transferencia y repítela para comprobar la protección frente a solicitudes duplicadas.';
    render();
  }
  reset();
  transferForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const raw = amountInput.value.trim();
    // Decimal string parsing avoids floating-point rounding errors.
    if (!/^(?:\d{1,8})(?:[.,]\d{1,2})?$/.test(raw)) {
      msg.textContent = 'Introduce un importe positivo, con un máximo de dos decimales.';
      return;
    }
    const parts = raw.replace(',', '.').split('.');
    const amount = Number(parts[0]) * 100 + Number((parts[1] || '').padEnd(2, '0'));
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > balanceAlex) {
      msg.textContent =
        'Importe no válido o fondos insuficientes. No se ha modificado ningún saldo.';
      return;
    }
    const requestId = 'demo-transfer-' + String(nextRequest++).padStart(3, '0');
    balanceAlex -= amount;
    balanceMorgan += amount;
    latestCommand = { requestId, amount };
    ledger.push({
      title: 'Alex → Morgan',
      amount,
      description: requestId + ' · transferencia validada',
    });
    msg.textContent =
      'Transferencia de ' +
      money(amount) +
      ' aplicada. Reintenta la misma solicitud: no se volverá a descontar.';
    render();
  });
  btnReplay.addEventListener('click', () => {
    if (!latestCommand) return;
    msg.textContent =
      'Solicitud ' +
      latestCommand.requestId +
      ' reconocida como repetida: no se aplican nuevos cambios.';
  });
  document.getElementById('demo-reset').addEventListener('click', reset);

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
