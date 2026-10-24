import { initScrollSpy } from './nav-scrollspy.js';
import { initHamburgerMenu } from './hamburger-menu.js';
import { initScrollProgress } from './scroll-progress.js';
import { initRevealAnimations } from './reveal-animations.js';
import { initChatWidget } from './chat-widget.js';

// Only hide/animate content once JS is confirmed working (progressive
// enhancement, spec section 4).
document.documentElement.classList.add('js');

initScrollSpy();
initHamburgerMenu();
initScrollProgress();
initRevealAnimations();
initChatWidget();
