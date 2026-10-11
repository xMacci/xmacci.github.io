import { gsap } from 'gsap';

export default class Words {
  constructor(element) {
    this.element = element;

    // Valeurs par défaut
    this.options = {
      duration: 3000,
      animDuration: 0.5,
      delay: 0.2,
      yOffset: 30,
    };

    this.setOptions();

    // Sélection de tous les éléments à faire tourner dans la composante
    this.spans = Array.from(
      this.element.querySelectorAll('[data-rotate-item]'),
    );
    this.currentIndex = 0;

    this.init();
  }

  setOptions() {
    if (this.element.dataset.duration) {
      this.options.duration = parseFloat(this.element.dataset.duration);
    }
    if (this.element.dataset.animDuration) {
      this.options.animDuration = parseFloat(this.element.dataset.animDuration);
    }
    if (this.element.dataset.delay) {
      this.options.delay = parseFloat(this.element.dataset.delay);
    }
    if (this.element.dataset.yOffset) {
      this.options.yOffset = parseFloat(this.element.dataset.yOffset);
    }
  }

  init() {
    if (!this.spans.length) return;

    // Masque tous les mots sauf le premier
    gsap.set(this.spans, { opacity: 0, y: this.options.yOffset });
    gsap.set(this.spans[0], { opacity: 1, y: 0 });

    this.startLoop();
  }

  startLoop() {
    setInterval(() => {
      const currentText = this.spans[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.spans.length;
      const nextText = this.spans[this.currentIndex];

      // Animation de sortie vers le haut
      gsap.to(currentText, {
        opacity: 0,
        y: -this.options.yOffset,
        duration: this.options.animDuration,
        ease: 'power2.in',
      });

      // Animation d'entrée depuis le bas
      gsap.fromTo(
        nextText,
        { opacity: 0, y: this.options.yOffset },
        {
          opacity: 1,
          y: 0,
          duration: this.options.animDuration,
          delay: this.options.delay,
          ease: 'power2.out',
        },
      );
    }, this.options.duration);
  }
}
