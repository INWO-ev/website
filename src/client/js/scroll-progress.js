/**
 * requestAnimationFrame fallback for browsers without CSS
 * animation-timeline: scroll() support (spec section 3.3). The CSS already
 * handles the supported case via @supports; this only runs the manual
 * update when that feature is missing.
 */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: scroll()');
  if (supportsScrollTimeline) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  });

  update();
}
