import { gsap } from 'gsap';

export default class TextAnimScramble {
  constructor(element) {
    this.el =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    // Capturation sécurisée du texte (avec fallback si le DOM n'est pas encore prêt)
    this.text = this.el.textContent.trim() || 'Défilez vers le bas';
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.frame = 0;
    this.queue = [];

    this.startLoop();
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
      this.setText(this.text).then(() => {
        gsap.delayedCall(2.5, scramble);
      });
    };
    scramble();
  }
}
