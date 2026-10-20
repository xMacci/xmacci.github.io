import { gsap } from 'gsap';

export default class GsapAnimate {
  constructor(element) {
    // Si instancié par ComponentFactory, cherche dans l'élément parent ou sur toute la page
    this.container = element || document;

    // Récupère les enfants avec data-gsap
    const targets = Array.from(this.container.querySelectorAll('[data-gsap]'));

    // Si le conteneur lui-même a data-gsap
    if (
      this.container !== document &&
      this.container.hasAttribute('data-gsap')
    ) {
      targets.unshift(this.container);
    }

    this.elements = targets;
    if (!this.elements.length) return;

    this.init();
  }

  init() {
    this.elements.forEach((el) => {
      const type = el.dataset.gsap || 'fromBottom';
      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || 0.8;
      const distance = parseFloat(el.dataset.distance) || 50;

      let startState = { autoAlpha: 0 }; // Gère opacity: 0 ET visibility: hidden

      switch (type) {
        case 'fromLeft':
          startState.x = -distance;
          break;
        case 'fromRight':
          startState.x = distance;
          break;
        case 'fromTop':
          startState.y = -distance;
          break;
        case 'zoomIn':
          startState.scale = 0.8;
          break;
        case 'zoomOut':
          startState.scale = 1.15;
          break;
        case 'fadeIn':
          break;
        case 'fromBottom':
        default:
          startState.y = distance;
          break;
      }

      // Remplaçant de l'animation CSS : autoAlpha passe à 1 et efface visibility: hidden
      gsap.fromTo(el, startState, {
        autoAlpha: 1, // Rend l'élément visible et opaque
        x: 0,
        y: 0,
        scale: 1,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    });
  }
}
