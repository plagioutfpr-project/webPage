(function initInstitutionalPage() {
  'use strict';

  const body = document.body;
  const header = document.getElementById('landing-header');
  const toggle = document.getElementById('landing-nav-toggle');
  const navigation = document.getElementById('landing-navigation');
  const mobileQuery = window.matchMedia('(max-width: 900px)');

  if (!body || !toggle || !navigation) return;

  body.classList.add('landing-js');
  const toggleLabel = toggle.querySelector('.landing-sr-only');
  let menuOpen = false;

  function syncMenu({ restoreFocus = false } = {}) {
    const mobile = mobileQuery.matches;
    toggle.setAttribute('aria-expanded', String(menuOpen));
    navigation.classList.toggle('landing-is-open', menuOpen && mobile);
    navigation.hidden = mobile && !menuOpen;
    body.classList.toggle('landing-menu-open', menuOpen && mobile);

    if (toggleLabel) {
      toggleLabel.textContent = menuOpen ? 'Fechar menu' : 'Abrir menu';
    }

    if (restoreFocus) toggle.focus();
  }

  function setOpen(open, options = {}) {
    menuOpen = Boolean(open) && mobileQuery.matches;
    syncMenu(options);
  }

  toggle.addEventListener('click', () => setOpen(!menuOpen));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault();
      setOpen(false, { restoreFocus: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (!menuOpen) return;
    if (navigation.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false, { restoreFocus: true });
  });

  const handleViewportChange = () => setOpen(false);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleViewportChange);
  } else {
    mobileQuery.addListener(handleViewportChange);
  }

  function updateHeader() {
    if (header) header.classList.toggle('landing-is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  syncMenu();
  updateHeader();
})();
