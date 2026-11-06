import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class TextAnimScramble {
  constructor(element) {
    this.el =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    // Capturation sécurisée du texte (avec fallback si le DOM n'est pas encore prêt)
    this.text = this.el.textContent.trim() || 'Défilez vers le bas';
    this.chars = '!<>-_\\/[]{}—=+*^?#19356298_______';
    this.frame = 0;
    this.queue = [];

    // data-scramble-scroll : scramble lancé au scroll (à chaque entrée
    // à l'écran) au lieu de la boucle continue
    if ('scrambleScroll' in this.el.dataset) {
      this.startOnScroll();
    } else {
      this.startLoop();
    }
  }

  startOnScroll() {
    gsap.registerPlugin(ScrollTrigger);
    const play = () => this.setText(this.text);

    ScrollTrigger.create({
      trigger: this.el,
      start: 'top 70%',
      end: 'bottom 20%',
      onEnter: play,
      onEnterBack: play,
    });
  }

  setText(newText) {
    const oldText = this.el.textContent.trim() || newText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 15);
      const end = start + Math.floor(Math.random() * 15);
      this.queue.push({ from, to, start, end, char: '' });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity: 0.5;">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update.bind(this));
      this.frame++;
    }
  }

  startLoop() {
    const scramble = () => {
      // Hors écran : on met la boucle en pause (économise des FPS)
      if (!this.isVisible) {
        this.isWaiting = true;
        return;
      }
      this.setText(this.text).then(() => {
        gsap.delayedCall(2, scramble);
      });
    };

    this.isVisible = true;
    this.isWaiting = false;
    const observer = new IntersectionObserver(([entry]) => {
      this.isVisible = entry.isIntersecting;
      // Revient à l'écran : on relance la boucle si elle était en pause
      if (this.isVisible && this.isWaiting) {
        this.isWaiting = false;
        scramble();
      }
    });
    observer.observe(this.el);

    scramble();
  }
}
