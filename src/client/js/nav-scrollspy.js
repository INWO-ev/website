/**
 * Highlights the current section's anchor in the nav (aria-current) and
 * flips the nav/hamburger color scheme based on the visible section's
 * data-theme, per spec sections 3.1 and 3.2.
 */
export function initScrollSpy() {
  const nav = document.getElementById('site-nav');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!nav || sections.length === 0) return;

  const anchorLinks = Array.from(nav.querySelectorAll('[data-anchor]'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const id = entry.target.id;
        const theme = entry.target.getAttribute('data-theme') ?? 'dark';
        nav.setAttribute('data-nav-theme', theme);
        nav.classList.toggle('is-scrolled', window.scrollY > 10);

        for (const link of anchorLinks) {
          const isCurrent = link.getAttribute('data-anchor') === id;
          link.toggleAttribute('aria-current', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'true');
        }
      }
    },
    { rootMargin: '-40% 0px -40% 0px' },
  );

  for (const section of sections) observer.observe(section);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  });
}
