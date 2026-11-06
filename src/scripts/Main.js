import ComponentFactory from './ComponentFactory.js';
import Icons from './utils/Icons.js';
import CustomCursor from './utils/CustomCursor.js';
import Balatro from './utils/Balatro.js';
import ScrollFix from './utils/ScrollFix.js';
import FormSend from './utils/FormSend.js';
class Main {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add('has-js');

    Icons.load();
    new ComponentFactory();

    // Instanciation de CustomCursor
    new CustomCursor();

    // Fond animé Balatro
    this.balatro = new Balatro();
    this.scrollFix = new ScrollFix();
    this.formSend = new FormSend();

    // Réglage système « réduire les animations » : on arrête la vidéo de fond
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('video.video').forEach((video) => {
        video.removeAttribute('autoplay');
        video.pause();
      });
    }

    // Mobile / tactile : on retire la vidéo de fond et le grain (filtre SVG).
    // - La vidéo plein écran (à 5 % d'opacité) est décodée en continu et
    //   recomposée à chaque frame de scroll : grosse cause de lag sur mobile.
    // - Quand le navigateur bloque l'autoplay (iOS en mode économie
    //   d'énergie), il affiche un bouton play par-dessus la page.
    // - Le grain plein écran (feTurbulence) est très coûteux à chaque scroll.
    const isMobile =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

    if (isMobile) {
      document.querySelectorAll('video.video').forEach((video) => {
        video.pause();
        video.removeAttribute('src'); // arrête aussi le téléchargement
        video.load();
        video.remove();
      });
      document.querySelectorAll('.noise-overlay').forEach((el) => el.remove());
    }
  }
}

new Main();
