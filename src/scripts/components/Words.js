import { gsap } from 'gsap';

export default class Words {
  constructor(element) {
    this.element =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;

    // Évite la double initialisation si le composant a déjà été instancié
    if (this.element.dataset.initialized) return;
    this.element.dataset.initialized = 'true';

    this.items = this.element.querySelectorAll('[data-rotate-item]');
    if (!this.items.length) return;

    this.duration = parseInt(this.element.dataset.duration, 10) || 4500;
    this.animDuration = parseFloat(this.element.dataset.animDuration) || 0.6;
    this.yOffset = parseInt(this.element.dataset.yOffset, 10) || 40;

    this.currentIndex = 0;
    this.init();
  }

  init() {
    gsap.set(this.items, {
      opacity: 0,
      y: this.yOffset,
      visibility: 'visible',
    });
    gsap.set(this.items[0], { opacity: 1, y: 0 });

    // 2. Lancement de la boucle de rotation
    this.startRotation();
  }

  startRotation() {
    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.rotate();
    }, this.duration);
  }

  rotate() {
    const currentItem = this.items[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    const nextItem = this.items[this.currentIndex];

    // Animation de sortie vers le haut
    gsap.to(currentItem, {
      y: -this.yOffset,
      opacity: 0,
      duration: this.animDuration,
      ease: 'power2.inOut',
    });

    // Animation d'entrée depuis le bas
    gsap.fromTo(
      nextItem,
      { y: this.yOffset, opacity: 0, visibility: 'visible' },
      {
        y: 0,
        opacity: 1,
        duration: this.animDuration,
        ease: 'power2.inOut',
      },
    );
  }
}
