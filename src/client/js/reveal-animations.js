/**
 * IntersectionObserver-driven reveal animations (spec section 4). Disabled
 * entirely under prefers-reduced-motion, where content simply stays
 * visible (the .reveal base styles already show content without JS).
 */
export function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = Array.from(document.querySelectorAll('.reveal'));

  if (prefersReducedMotion || elements.length === 0) {
    for (const el of elements) el.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.2 },
  );

  for (const el of elements) observer.observe(el);
}
