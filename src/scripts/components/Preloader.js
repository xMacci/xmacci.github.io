import { gsap } from 'gsap';

export default class Preloader {
  constructor(element = '.preloader') {
    this.el =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    // Skip preloader if already seen in this session
    if (sessionStorage.getItem('preloaderSeen')) {
      this.el.style.display = 'none';
      return;
    }

    this.counterEl = this.el.querySelector('.preloader__counter');
    this.counter = { value: 0 };

    this.init();
  }

  init() {
    document.body.classList.add('is-loading');

    const tl = gsap.timeline({
      onComplete: () => this.destroy(),
    });

    tl.to(this.counter, {
      value: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (this.counterEl) {
          this.counterEl.textContent = Math.floor(this.counter.value);
        }
      },
    }).to(this.el, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    });
  }

  destroy() {
    document.body.classList.remove('is-loading');
    this.el.style.display = 'none';

    // Save state so it won't play again during this browser session
    sessionStorage.setItem('preloaderSeen', 'true');
  }
}
