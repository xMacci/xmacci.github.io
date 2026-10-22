import { gsap } from 'gsap';

export default class PageTransition {
  constructor(element = '[data-component="PageTransition"]') {
    this.overlay =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.overlay) return;

    this.init();
  }

  init() {
    // Ouverture du rideau au chargement de la page
    this.animateIn();

    // Écoute des clics sur l'ensemble de la page
    this.bindLinks();

    // Gestion du bouton Précédent/Suivant du navigateur (Bfcache / history)
    window.addEventListener('pageshow', (event) => {
      this.resetOverlay();
    });
  }

  /**
   * Disparition de l'overlay : libère l'écran pour permettre la navigation
   */
  animateIn() {
    gsap.to(this.overlay, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.6,
      ease: 'power3.inOut',
      pointerEvents: 'none',
    });
  }

  /**
   * Apparition de l'overlay : ferme le menu mobile et redirige
   * @param {string} url - Destination de la page
   */
  animateOut(url) {
    // 1. Ferme le menu mobile pour réactiver le scroll du body
    document.body.classList.remove('is-menu-open', 'nav-open');

    // 2. Joue l'animation de fermeture
    gsap.to(this.overlay, {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.5,
      ease: 'power3.inOut',
      pointerEvents: 'all',
      onComplete: () => {
        window.location.href = url;
      },
    });
  }

  /**
   * Réinitialise l'overlay si l'utilisateur revient en arrière
   */
  resetOverlay() {
    document.body.classList.remove('is-menu-open', 'nav-open');
    gsap.to(this.overlay, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.4,
      ease: 'power3.inOut',
      pointerEvents: 'none',
    });
  }

  /**
   * Intercepte et filtre les clics sur la page
   */
  bindLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = link.pathname;
      const currentPath = window.location.pathname;
      const isSamePage = linkPath === currentPath || href.startsWith('#');
      const hasHash = link.hash !== '' || href.includes('#');

      // 1. Ancre sur la même page (ex: #projets ou a-propos.html#projets)
      if (isSamePage && hasHash) {
        document.body.classList.remove('is-menu-open', 'nav-open');
        return;
      }

      // 2. Clic sur la page actuelle sans ancre (ex: clic "Accueil" déjà sur l'Accueil)
      if (isSamePage && !hasHash) {
        e.preventDefault();
        document.body.classList.remove('is-menu-open', 'nav-open');
        return;
      }

      // 3. Ignorer liens externes, mailto, tel et liens ouvrants dans un nouvel onglet
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        link.origin !== window.location.origin
      ) {
        return;
      }

      // 4. Lancement de la transition vers la nouvelle page
      e.preventDefault();
      this.animateOut(href);
    });
  }
}
