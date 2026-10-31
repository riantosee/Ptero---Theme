const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const rows = [...document.querySelectorAll('.server-row')];
const resultCount = document.querySelector('#resultsCount');
const emptyState = document.querySelector('#emptyState');
const serverList = document.querySelector('#serverList');
const toastRegion = document.querySelector('#toastRegion');
const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
const scrim = document.querySelector('#scrim');
const dialog = document.querySelector('#serverDialog');
let toastTimer;

function filterServers() {
  const term = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  let visible = 0;
  rows.forEach((row) => {
    const matches = row.dataset.name.includes(term) && (status === 'all' || row.dataset.status === status);
    row.hidden = !matches;
    if (matches) visible += 1;
  });
  resultCount.textContent = `${visible} ${visible === 1 ? 'server' : 'servers'}`;
  emptyState.hidden = visible !== 0;
  serverList.hidden = visible === 0;
}
searchInput.addEventListener('input', filterServers);
statusFilter.addEventListener('change', filterServers);
document.querySelector('#clearFilters').addEventListener('click', () => {
  searchInput.value = '';
  statusFilter.value = 'all';
  filterServers();
  searchInput.focus();
});

function showToast(message) {
  toastRegion.replaceChildren();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastRegion.append(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 3200);
}
document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

function closeMenu() {
  sidebar.classList.remove('open');
  scrim.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  scrim.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
scrim.addEventListener('click', closeMenu);
document.querySelectorAll('.primary-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === 'Escape') closeMenu();
});

const identifiers = { 'Production API': 'p7x2k9', 'Staging Environment': 'm4q8v1', 'Community Minecraft': 'n2c6w3', 'Private Sandbox': 'k9r5d2' };
rows.forEach((row) => row.querySelector('.row-action').addEventListener('click', () => {
  const name = row.querySelector('h3').textContent;
  document.querySelector('#dialogTitle').textContent = name;
  document.querySelector('#dialogIdentifier').textContent = identifiers[name] || '—';
  dialog.showModal();
}));
document.querySelector('#dialogClose').addEventListener('click', () => dialog.close());
document.querySelector('#dialogDone').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
