import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText.js';

export default class Textanim {
  constructor(element) {
    this.element = element;
    // Valeurs par défaut si rien n'est spécifié dans le HTML
    this.options = {
      repeat: false,
      duration: 1,
      stagger: 0.05,
      delay: 0.25,
    };
    gsap.registerPlugin(SplitText);
    document.fonts.ready.then(this.init.bind(this));
  }

  setOptions() {
    if ('repeat' in this.element.dataset) {
      this.options.repeat = true;
    }

    // Récupération des valeurs HTML si elles existent
    if (this.element.dataset.duration) {
      this.options.duration = parseFloat(this.element.dataset.duration);
    }
    if (this.element.dataset.stagger) {
      this.options.stagger = parseFloat(this.element.dataset.stagger);
    }
    if (this.element.dataset.delay) {
      this.options.delay = parseFloat(this.element.dataset.delay);
    }
  }

  init() {
    this.setOptions();
    this.split = SplitText.create(this.element, {
      mask: 'chars',
      type: 'chars, words, lines',
      autoSplit: true,
    });
    this.initAnim();
    this.initObserver();
  }

  initObserver() {
    const observer = new IntersectionObserver(this.watch.bind(this), {
      rootMargin: '0px 0px 0px 0px',
    });
    observer.observe(this.element);
  }

  watch(entries, observer) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target;

      if (entry.isIntersecting) {
        this.anim(true);
        if (!this.options.repeat) {
          observer.unobserve(target);
        }
      } else {
        this.anim(false);
      }
    }
  }

  initAnim() {
    gsap.set(this.split.chars, {
      yPercent: 'random([-100, 100])',
      autoAlpha: 0,
    });
  }

  anim(isAnimIn) {
    const alpha = isAnimIn ? 1 : 0;
    const y = isAnimIn ? 0 : 'random([-100, 100])';

    gsap.to(this.split.chars, {
      duration: this.options.duration,
      yPercent: y,
      autoAlpha: alpha,
      delay: this.options.delay,
      stagger: this.options.stagger,
      ease: 'expo.out',
    });
  }
}
