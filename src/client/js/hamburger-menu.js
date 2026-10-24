/**
 * Full-screen overlay menu, spec section 3.2. Keyboard accessible: Esc
 * closes, focus moves into the overlay on open and back to the toggle on
 * close.
 */
export function initHamburgerMenu() {
  const toggle = document.getElementById('hamburger-toggle');
  const overlay = document.getElementById('overlay-menu');
  const closeBtn = document.getElementById('overlay-menu-close');
  if (!toggle || !overlay || !closeBtn) return;

  const open = () => {
    overlay.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    const firstLink = overlay.querySelector('a');
    if (firstLink instanceof HTMLElement) firstLink.focus();
  };

  const close = () => {
    overlay.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) close();
    else open();
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
