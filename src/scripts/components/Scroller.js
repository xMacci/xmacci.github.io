import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin.js';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin.js';
export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    this.element = element;
    this.options = {
      hasSkew: false,
      hasScale: false,
      hasPinItems: false,
      hasHoriz: false,
    };

    this.setOptions();
    this.init();
  }

  init() {
    this.smoother = ScrollSmoother.create({
      wrapper: this.element,
      content:
        this.element.querySelector('#smooth-content') ||
        this.element.firstElementChild,
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
      onUpdate: (self) => this.onUpdateScroll(self),
      onStop: (self) => this.onStopScroll(self),
      ease: 'expo.out',
    });
  }

  onUpdateScroll(self) {
    if (this.options.hasSkew) this.updateSkew(self);
    if (this.options.hasScale) this.updateScale(self);
  }

  onStopScroll(self) {
    if (this.options.hasSkew) this.stopSkew(self);
    if (this.options.hasScale) this.stopScale(self);
  }

  initSkew() {
    this.skewTarget = this.element.querySelectorAll('[data-skew]');
    if (this.skewTarget.length > 0) {
      this.skewSetter = gsap.quickTo(this.skewTarget, 'skewY');
      this.skewSetter(0);
    }
  }

  updateSkew(self) {
    if (!this.skewSetter) return;
    const velocity = self.getVelocity();
    const force = 5;
    let skew = gsap.utils.mapRange(-1000, 1000, -force, force, velocity);
    skew = gsap.utils.clamp(-force, force, skew);

    this.skewSetter(skew);
  }

  stopSkew() {
    if (this.skewSetter) {
      this.skewSetter(0);
    }
  }

  initScale() {
    this.scaleImages = this.element.querySelectorAll('[data-scale]');
  }

  updateScale(self) {
    if (!this.scaleImages || !this.scaleImages.length) return;
    const velocity = self.getVelocity();
    const force = 0.02;
    let scale = gsap.utils.mapRange(-1000, 1000, force, -force, velocity);
    scale = gsap.utils.clamp(-force, force, scale);
    const finalScale = 1 + scale;

    gsap.set(this.scaleImages, { scale: finalScale });
  }

  stopScale() {
    if (!this.scaleImages || !this.scaleImages.length) return;
    gsap.to(this.scaleImages, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  initPin() {
    const pinTargets = this.element.querySelectorAll('[data-pin-items]');

    for (let i = 0; i < pinTargets.length; i++) {
      const target = pinTargets[i];
      const words = target.querySelectorAll('[data-pin-word]');

      if (!words.length) continue;

      gsap.set(words, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: target,
          pin: true,
          start: 'top top',
          end: '+=70%',
          scrub: 0.3,
          anticipatePin: 1,
        },
      });

      for (let j = 0; j < words.length; j++) {
        const word = words[j];

        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          },
          `+=0.15`,
        );
      }
    }
  }
  initScramble() {
    const drawnItems = this.element.querySelectorAll('.textScramble');
    for (let index = 0; index < drawnItems.length; index++) {
      const single = drawnItems[index];
      console.log(single);
      this.scrambleRepeat = 0;
      if ('scrambleRepeat' in single.dataset) {
        this.scrambleRepeat = single.dataset.scrambleRepeat;
      }
      gsap.to(single, {
        scrollTrigger: single,
        duration: 1,
        scrambleText: single.innerText,
        repeat: this.scrambleRepeat,
      });
    }
  }
  initHoriz() {
    const sectionsHoriz = this.element.querySelectorAll('.js-horiz');

    for (let i = 0; i < sectionsHoriz.length; i++) {
      const sectionHoriz = sectionsHoriz[i];
      const panels = sectionHoriz.querySelectorAll('.js-panel');
      const nbPanels = panels.length;
      const buffer = 200;

      if (nbPanels === 0) continue;

      gsap.to(panels, {
        xPercent: -100 * (nbPanels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionHoriz,
          pin: true,
          scrub: 1,
          snap: 1 / (nbPanels - 1),
          end: () => `+=${sectionHoriz.offsetWidth * (nbPanels - 1) + buffer}`,
          anticipatePin: 1,
        },
      });
    }
  }
  setOptions() {
    if (this.element.querySelector('[data-skew]')) {
      this.options.hasSkew = true;
      this.initSkew();
    }
    if (this.element.querySelector('[data-scale]')) {
      this.options.hasScale = true;
      this.initScale();
    }
    if (this.element.querySelector('[data-pin-items]')) {
      this.options.hasPinItems = true;
      this.initPin();
    }
    if (this.element.querySelector('[data-horiz]')) {
      this.options.hasHoriz = true;
      this.initHoriz();
    }
  }
}
