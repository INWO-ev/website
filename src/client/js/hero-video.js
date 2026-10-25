const DESKTOP_QUERY = '(min-width: 768px)';

/**
 * Loads the hero background video only for desktop viewports with no
 * reduced-motion preference (spec section 5.1: "auf Mobilgeräten und bei
 * prefers-reduced-motion nur das Standbild"). Without JS, or when either
 * condition fails, visitors just see the CSS poster background - nothing
 * is ever fetched in that case.
 */
export function initHeroVideo() {
  const section = document.querySelector('[data-hero-video]');
  if (!section) return;

  const src = section.getAttribute('data-hero-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  if (!src || reducedMotion || !isDesktop) return;

  const video = document.createElement('video');
  video.className = 'section--hero__video';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('aria-hidden', 'true');

  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.appendChild(source);

  section.prepend(video);
}
