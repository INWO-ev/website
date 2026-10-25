const STORAGE_KEY = 'inwo-color-mode';

/**
 * Site-wide dark/light toggle. Dark is the default (set directly on
 * <html> in the template, with no-JS readers getting it too); this
 * module lets a visitor switch to light mode and remembers the choice.
 */
export function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function apply(mode) {
    document.documentElement.setAttribute('data-color-mode', mode);
    const isLight = mode === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    const nextActionLabel = isLight ? 'Dunklen Modus aktivieren' : 'Hellen Modus aktivieren';
    toggle.setAttribute('aria-label', nextActionLabel);
    toggle.setAttribute('title', nextActionLabel);
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
