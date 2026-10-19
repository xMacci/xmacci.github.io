import { gsap } from 'gsap';

export default class ScrollFix {
  constructor() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    this.init();
  }

  init() {
    // 1. Gestion des clics sur les liens d'ancres (#contact, etc.)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="#"]');
      if (!link) return;

      const url = new URL(link.href, window.location.origin);

      // Si le lien vise une ancre sur la page actuelle
      if (url.pathname === window.location.pathname && url.hash) {
        const target = document.querySelector(url.hash);
        if (target) {
          e.preventDefault();
          this.scrollToElement(target);
          history.pushState(null, null, url.hash);
        }
      }
    });

    // 2. Gestion de l'arrivée directe sur la page avec une ancre dans l'URL
    window.addEventListener('load', () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => this.scrollToElement(target), 350);
        }
      }
    });
  }

  scrollToElement(target) {
    // Englobe le footer complet si l'élément s'y trouve
    const footerContainer = target.closest('.footer') || target;

    // Récupère tous les éléments animés du footer (ex: zoomIn, zoomOut)
    const animatedElements = footerContainer.querySelectorAll(
      '[data-scrolly], [data-gsap], .has-gsap',
    );

    // Active les classes d'animation
    target.classList.add('is-active');
    footerContainer.classList.add('is-active');
    animatedElements.forEach((el) => el.classList.add('is-active'));

    // Forcer GSAP à annuler l'invisibilité (opacity: 0, scale)
    gsap.set([target, footerContainer, ...animatedElements], {
      opacity: 1,
      visibility: 'visible',
      scale: 1,
      y: 0,
      x: 0,
      clearProps: 'transform',
    });

    // Calcul de la position exacte et défilement fluide
    const headerOffset = 60; // Hauteur de ton header fixe
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });
  }
}
