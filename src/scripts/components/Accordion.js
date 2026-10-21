export default class Accordion {
  constructor(element) {
    this.element = element;
    this.containers = this.element.querySelectorAll('.accordion__container');
    this.options = {
      notClosing: false,
      autoOpen: false,
    };
    this.setOptions();
    this.init();
  }

  init() {
    for (let i = 0; i < this.containers.length; i++) {
      const container = this.containers[i];

      // Auto-open si data-auto-open est présent
      if ('autoOpen' in container.dataset) {
        container.classList.add('is-active');
      }

      // Écoute le clic uniquement sur le header (le titre/bouton), pas sur tout le conteneur
      const header = container.querySelector('.accordion__header') || container;
      header.addEventListener('click', (event) =>
        this.initAccordion(event, container),
      );
    }
  }

  initAccordion(event, targetContainer) {
    const wasActive = targetContainer.classList.contains('is-active');

    // Si on n'a pas l'option notClosing, on ferme tous les autres accordéons
    if (!this.options.notClosing) {
      for (let i = 0; i < this.containers.length; i++) {
        this.containers[i].classList.remove('is-active');
      }
    }

    // Bascule l'état de l'accordéon cliqué
    if (!wasActive) {
      targetContainer.classList.add('is-active');
    } else if (this.options.notClosing) {
      targetContainer.classList.remove('is-active');
    }
  }

  setOptions() {
    if ('notClosing' in this.element.dataset) {
      this.options.notClosing = true;
    }
  }
}
