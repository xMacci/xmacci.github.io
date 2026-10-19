import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Projets {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger);

    this.element = element;
    this.cards = Array.from(this.element.querySelectorAll('.projet-card'));
    this.dots = Array.from(
      this.element.querySelectorAll('.projet-pagination .dot'),
    );
    this.pagination = this.element.querySelector('.projet-pagination');

    this.init();
  }

  init() {
    if (!this.cards.length) return;

    const mm = gsap.matchMedia();

    // --- 1. DESKTOP (>= 769px) : Stacking 3D avec Pinning ---
    mm.add('(min-width: 769px)', () => {
      const totalCards = this.cards.length;

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.element,
          start: 'top top',
          end: () => `+=${(totalCards - 1) * 100}%`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const activeIndex = Math.min(
              Math.floor(self.progress * totalCards),
              totalCards - 1,
            );
            this.setActiveDot(activeIndex);
          },
        },
      });

      this.cards.forEach((card, index) => {
        // Animation interne
        this.animateCardContent(card, true);

        // Effet de superposition 3D
        if (index > 0) {
          mainTl.fromTo(card, { yPercent: 100 }, { yPercent: 0, ease: 'none' });

          const prevCard = this.cards[index - 1];
          mainTl.to(
            prevCard,
            {
              scale: 0.9,
              opacity: 0.2,
              filter: 'blur(8px)',
              ease: 'none',
            },
            '<',
          );
        }
      });
    });

    // --- 2. MOBILE (<= 768px) : Scroll fluide + Animation de révélation au scroll ---
    mm.add('(max-width: 768px)', () => {
      this.cards.forEach((card, index) => {
        // Nettoyage préalable des props de placement desktop
        gsap.set(card, {
          clearProps: 'position,top,left,height,transform,filter,opacity',
        });

        // Synchronisation des Dots
        ScrollTrigger.create({
          trigger: card,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => this.setActiveDot(index),
          onEnterBack: () => this.setActiveDot(index),
        });

        // Animation d'entrée au scroll sur chaque carte mobile
        this.animateCardContent(card, false);
      });
    });

    this.initPaginationEvents();
  }

  /* --- ANIMATION SÉQUENTIELLE DU CONTENU DE LA CARTE --- */
  animateCardContent(card, isDesktop) {
    const title = card.querySelector('.projet-card__header h1');
    const lines = card.querySelectorAll('.line__inner');
    const meta = card.querySelectorAll(
      '.projet-card__meta, .projet-card__header > h3',
    );
    const imageContainer = card.querySelector('.projet-card__image-container');
    const badge = card.querySelector('.badge-voir-projet');

    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: isDesktop ? 'top 80%' : 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    // A. Titre qui glisse vers le bas/haut
    if (title) {
      cardTl.fromTo(
        title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      );
    }

    // B. Lignes vertes qui s'étirent
    if (lines.length) {
      cardTl.fromTo(
        lines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power2.inOut' },
        '-=0.4',
      );
    }

    // C. Métadonnées
    if (meta.length) {
      cardTl.fromTo(
        meta,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        '-=0.3',
      );
    }

    // D. Image principal (Slide Up)
    if (imageContainer) {
      cardTl.fromTo(
        imageContainer,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5',
      );
    }

    // E. Badge "Voir le projet" (Pop + Rotation)
    if (badge) {
      cardTl.fromTo(
        badge,
        { opacity: 0, scale: 0, rotate: -180 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'back.out(1.8)',
        },
        '-=0.4',
      );
    }
  }

  initPaginationEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this.cards[index]) {
          this.cards[index].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  setActiveDot(activeIndex) {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
}
