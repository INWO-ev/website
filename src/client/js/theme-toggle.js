const STORAGE_KEY = 'inwo-color-mode';

/**
 * Site-wide dark/light toggle. Dark is the default (set directly on
 * <html> in the template, with no-JS readers getting it too); this
 * module lets a visitor switch to light mode and remembers the choice.
 */
export function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const label = toggle.querySelector('.theme-toggle__label');

  function apply(mode) {
    document.documentElement.setAttribute('data-color-mode', mode);
    const isLight = mode === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Dunklen Modus aktivieren' : 'Hellen Modus aktivieren');
    if (label) label.textContent = isLight ? 'Dunkel-Modus' : 'Hell-Modus';
  }

  apply(document.documentElement.getAttribute('data-color-mode') === 'light' ? 'light' : 'dark');

  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-color-mode') === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable - the choice just won't persist across visits */
    }
  });
}
