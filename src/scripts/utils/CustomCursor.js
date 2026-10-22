import { gsap } from 'gsap';

export default class CustomCursor {
  constructor(element = '.custom-cursor') {
    this.cursor =
      typeof element === 'string' ? document.querySelector(element) : element;

    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window;
    if (!this.cursor || isTouch) return;

    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    const hoverTargets =
      'a, button, .dot, .image-hover, [role="button"], .modal img, .modal-close';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        this.cursor.classList.add('is-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        this.cursor.classList.remove('is-hover');
      }
    });
  }
}
