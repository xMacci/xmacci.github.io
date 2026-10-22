import { gsap } from 'gsap';

export default class PageTransition {
  constructor(element) {
    this.overlay =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.overlay) return;

    this.init();
  }

  init() {
    // Animation d'entrée (dévoile la nouvelle page)
    this.animateIn();

    // Écoute des clics sur tous les liens de la page
    this.bindLinks();

    // Gère le retour en arrière / avant du navigateur (cache bfcache)
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.animateIn();
      }
    });
  }

  animateIn() {
    const top = this.overlay.querySelector('.panel--top');
    const bottom = this.overlay.querySelector('.panel--bottom');

    gsap.to(top, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' });
    gsap.to(bottom, { yPercent: 100, duration: 0.6, ease: 'power3.inOut' });
  }

  animateOut(url) {
    const top = this.overlay.querySelector('.panel--top');
    const bottom = this.overlay.querySelector('.panel--bottom');

    gsap
      .timeline({
        onComplete: () => {
          window.location.href = url;
        },
      })
      .to(top, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 0)
      .to(bottom, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 0);
  }

  bindLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');

      // Ignore les liens externes, ancres, mailto, tel et ouverture dans un nouvel onglet
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        href === window.location.pathname
      ) {
        return;
      }

      e.preventDefault();
      this.animateOut(href);
    });
  }
}
