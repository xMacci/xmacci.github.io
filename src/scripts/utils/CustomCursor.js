import { gsap } from 'gsap';

export default class CustomCursor {
  constructor(element = '.custom-cursor') {
    this.cursor =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.cursor) return;

    this.init();
  }

  init() {
    // Suivi de la souris avec effet d'inertie / delay
    window.addEventListener('mousemove', (e) => {
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5, // Ajuster cette valeur pour plus ou moins de délai
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    const hoverTargets =
      'a, button, .dot, .hover-img, .js-video, [role="button"], .modal img, .modal-close';

    // Délégation globale
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
