export default class Accordion {
  constructor(element) {
    this.element = element;
    this.containers = this.element.querySelectorAll('.accordion__container');

    this.options = {
      notClosing: true,
    };

    this.setOptions();
    this.init();
  }

  init() {
    for (let i = 0; i < this.containers.length; i++) {
      const container = this.containers[i];

      // Ouvre tous les accordéons par défaut
      container.classList.add('is-active');

      const header = container.querySelector('.accordion__header') || container;
      header.addEventListener('click', (event) =>
        this.initAccordion(event, container),
      );
    }
  }

  initAccordion(event, targetContainer) {
    const wasActive = targetContainer.classList.contains('is-active');

    if (!this.options.notClosing) {
      for (let i = 0; i < this.containers.length; i++) {
        this.containers[i].classList.remove('is-active');
      }
    }

    if (wasActive) {
      targetContainer.classList.remove('is-active');
    } else {
      targetContainer.classList.add('is-active');
    }
  }

  setOptions() {
    // Si vous ajoutez data-single sur l'accordéon, il repassera en mode "un seul ouvert à la fois"
    if ('single' in this.element.dataset) {
      this.options.notClosing = false;
    }
  }
}
