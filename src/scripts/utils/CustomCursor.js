import { gsap } from 'gsap';

export default class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    if (!this.cursor) return;

    // S'exécute uniquement sur les appareils avec une souris
    if (!window.matchMedia('(pointer: fine)').matches) return;

    this.init();
  }

  init() {
    // Centrage du point d'ancrage et opacité initiale
    gsap.set(this.cursor, {
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
    });

    const xTo = gsap.quickTo(this.cursor, 'x', {
      duration: 0.1,
      ease: 'power2.out',
    });
    const yTo = gsap.quickTo(this.cursor, 'y', {
      duration: 0.1,
      ease: 'power2.out',
    });

    // Suivi du pointeur
    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Détection des survols
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .dot, .image-hover, [role="button"]')) {
        this.cursor.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .dot,.image-hover, [role="button"]')) {
        this.cursor.classList.remove('cursor-hover');
      }
    });

    // Entrée et sortie de fenêtre
    document.addEventListener('mouseleave', () =>
      gsap.to(this.cursor, { opacity: 0, duration: 0.2 }),
    );
    document.addEventListener('mouseenter', () =>
      gsap.to(this.cursor, { opacity: 1, duration: 0.2 }),
    );
  }
}
