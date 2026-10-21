export default class Tabs {
  constructor(element) {
    this.element = element;
    this.onglets = element.querySelectorAll('.js-tab');
    this.contenus = element.querySelectorAll('.js-tab-content');
    this.selectedType = '';
    this.options = {
      defaultTab: '',
    };

    this.init();
  }

  init() {
    this.setOptions();

    // Attache l'événement de clic à chaque onglet
    for (let i = 0; i < this.onglets.length; i++) {
      const onglet = this.onglets[i];
      onglet.addEventListener('click', this.selectOnglet.bind(this));
    }

    this.activeStartup();
  }

  selectOnglet(event) {
    const target = event.currentTarget;
    const tabId = target.dataset.tabId;

    // Si l'onglet cliqué est déjà actif, on conserve sa sélection
    if (this.selectedType === tabId) return;

    this.selectedType = tabId;

    // Mise à jour de la classe is-active sur les boutons
    for (let i = 0; i < this.onglets.length; i++) {
      const onglet = this.onglets[i];
      if (onglet.dataset.tabId === this.selectedType) {
        onglet.classList.add('is-active');
      } else {
        onglet.classList.remove('is-active');
      }
    }

    this.showContenu();
  }

  showContenu() {
    const contenus = this.element.querySelectorAll('[data-tab-content-id]');

    for (let i = 0; i < contenus.length; i++) {
      const contenu = contenus[i];

      if (this.selectedType === contenu.dataset.tabContentId) {
        contenu.classList.add('is-active');
      } else {
        contenu.classList.remove('is-active');
      }
    }

    // Force les scripts enfants (Galerie, animations, scroll) à recalculer leurs hauteurs/largeurs
    window.dispatchEvent(new Event('resize'));
  }

  activeStartup() {
    // Définit la valeur de selectedType avec defaultTab ou le premier onglet disponible
    if (this.options.defaultTab) {
      this.selectedType = this.options.defaultTab;
    } else if (this.onglets.length > 0) {
      this.selectedType = this.onglets[0].dataset.tabId;
    }

    // Active l'onglet correspondant
    for (let i = 0; i < this.onglets.length; i++) {
      const onglet = this.onglets[i];
      if (onglet.dataset.tabId === this.selectedType) {
        onglet.classList.add('is-active');
      } else {
        onglet.classList.remove('is-active');
      }
    }

    this.showContenu();
  }

  setOptions() {
    if ('defaultTab' in this.element.dataset) {
      this.options.defaultTab = this.element.dataset.defaultTab;
    }
  }
}
