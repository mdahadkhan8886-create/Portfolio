/**
 * AHAD KHAN // STAGGERED MENU CONTROLLER
 * Sliding panel with numbered links, backdrop blur & social channels
 */

(function () {
  const wrapper = document.querySelector('.staggered-menu-wrapper');
  const toggleBtn = document.querySelector('.sm-toggle');
  const toggleText = document.querySelector('.sm-toggle-line');
  const backdrop = document.querySelector('.sm-backdrop');
  const navLinks = document.querySelectorAll('.sm-panel-item, .sm-socials-link');

  if (!wrapper || !toggleBtn) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    wrapper.setAttribute('data-open', '');
    if (toggleText) toggleText.textContent = 'Close ✕';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    wrapper.removeAttribute('data-open');
    if (toggleText) toggleText.textContent = 'Menu +';
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
})();

