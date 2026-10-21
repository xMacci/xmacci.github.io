export default class Modales {
  constructor(element) {
    this.triggerImg = element;
    this.modal = document.querySelector('.modal');

    if (!this.modal || !this.triggerImg) return;

    this.modalImg = this.modal.querySelector('.js-modal-img');
    this.captionText = this.modal.querySelector('.js-modal-caption');
    this.closeBtn = this.modal.querySelector('.js-modal-close');

    this.init();
  }

  init() {
    // Ouverture lors du clic sur l'image
    this.triggerImg.addEventListener('click', () => this.open());

    // Fermeture via le bouton X
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Fermeture lors du clic sur le fond noir
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        document.documentElement.classList.contains('is-modal-open')
      ) {
        this.close();
      }
    });
  }

  open() {
    const src = this.triggerImg.getAttribute('src');
    const alt = this.triggerImg.getAttribute('alt');

    if (this.modalImg && src) {
      this.modalImg.setAttribute('src', src);
    }

    if (this.captionText) {
      this.captionText.textContent = alt || '';
    }

    // Active la modale sur html et body
    document.documentElement.classList.add('is-modal-open');
    document.body.classList.add('is-modal-open');
  }
  close() {
    document.documentElement.classList.remove('is-modal-open');
    document.body.classList.remove('is-modal-open');
  }
}
