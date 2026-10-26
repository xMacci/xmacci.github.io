import { gsap } from 'gsap';

export default class CustomCursor {
  constructor(element = '.custom-cursor') {
    this.cursor =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.cursor) return;

    // Détection des écrans tactiles et mobiles
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      window.innerWidth <= 768;

    if (isTouch) {
      // Forcer la disparition du DOM pour ne pas laisser de point vert en (0,0)
      this.cursor.style.display = 'none';
      return;
    }

    this.init();
  }

  init() {
    // Crée des setters rapides pour x et y (plus performant que gsap.to répété)
    const xSetter = gsap.quickSetter(this.cursor, 'x', 'px');
    const ySetter = gsap.quickSetter(this.cursor, 'y', 'px');

    window.addEventListener('mousemove', (e) => {
      // On utilise quickTo pour garder le lissage (duration/ease)
      // Il faut initialiser quickTo en dehors si on veut lissage,
      // sinon quickSetter est instantané.

      // Version avec lissage (similaire à votre code mais plus optimisé)
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2, // Légèrement réduit pour être plus réactif
        ease: 'power2.out',
        overwrite: true, // Overwrite total pour curseur
      });
    });

    // ... le reste de votre code (mouseover/out) reste inchangé
    const hoverTargets =
      'a, button, .dot, .hover-img, .js-video, [role="button"], .modal img, .modal-close';

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
