export default class Header {
  constructor(element) {
    this.element = element;
    this.options = {
      threshold: 50, // Seuil en pixels avant déclenchement
      autoHide: false,
    };
    this.scrollPosition = 0;
    this.lastScrollPosition = 0;
    this.html = document.documentElement;

    this.init();
    this.initNavMobile();
  }

  init() {
    this.setOptions();

    if (this.options.autoHide) {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  setOptions() {
    if ('autoHide' in this.element.dataset) {
      this.options.autoHide = true;
    }

    if ('threshold' in this.element.dataset) {
      this.options.threshold = parseFloat(this.element.dataset.threshold);
    }
  }

  onScroll() {
    this.lastScrollPosition = this.scrollPosition;
    this.scrollPosition = document.scrollingElement.scrollTop;

    this.setDirections();
    this.setHeaderState();
  }

  setHeaderState() {
    if (!this.options.autoHide) return;

    const isScrollingDown = this.scrollPosition > this.lastScrollPosition;
    const passedThreshold = this.scrollPosition > this.options.threshold;

    // Masque si on scroll vers le bas ET qu'on a dépassé le seuil
    if (isScrollingDown && passedThreshold) {
      this.html.classList.add('header-is-hidden');
    } else {
      this.html.classList.remove('header-is-hidden');
    }
  }

  setDirections() {
    if (this.scrollPosition >= this.lastScrollPosition) {
      this.html.classList.add('is-scrolling-down');
      this.html.classList.remove('is-scrolling-up');
    } else {
      this.html.classList.add('is-scrolling-up');
      this.html.classList.remove('is-scrolling-down');
    }
  }

  initNavMobile() {
    const toggle = this.element.querySelector('.js-toggle');
    if (toggle) {
      toggle.addEventListener('click', this.onToggleNav.bind(this));
    }

    // Sélectionne tous les liens dans le header
    const links = this.element.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', this.closeNav.bind(this));
    });
  }

  onToggleNav() {
    this.html.classList.toggle('nav-is-active');
  }

  closeNav() {
    this.html.classList.remove('nav-is-active');
  }
}
