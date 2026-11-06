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
    // Pas de pin : la page défile normalement. Chaque mot (avec sa
    // description et ses lignes) apparaît quand il entre à l'écran
    // et disparaît quand il en sort, dans les deux sens de scroll.
    const pinTargets = this.element.querySelectorAll('[data-pin-items]');

    for (let i = 0; i < pinTargets.length; i++) {
      const target = pinTargets[i];
      const words = target.querySelectorAll('[data-pin-word]');

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const desc = word.querySelector('[data-pin-desc]');
        const wordLines = word.querySelectorAll('.line__inner');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: word,
            start: 'top 70%', // apparaît une fois bien entré à l'écran
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
          },
        });

        tl.fromTo(
          word,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        );

        // Description : juste après le mot
        if (desc) {
          tl.fromTo(
            desc,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            '-=0.25',
          );
        }

        // Lignes vertes sous la description : s'étirent une après l'autre
        if (wordLines.length) {
          tl.fromTo(
            wordLines,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.4, stagger: 0.08, ease: 'power2.inOut' },
            '-=0.2',
          );
        }
      }
    }
  }
  initScramble() {
    const drawnItems = this.element.querySelectorAll('.textScramble');
    for (let index = 0; index < drawnItems.length; index++) {
      const single = drawnItems[index];
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

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const pinTarget = isMobile ? sectionHoriz.closest('.analysis-process') || sectionHoriz : sectionHoriz;

      gsap.to(panels, {
        xPercent: -100 * (nbPanels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: pinTarget,
          start: 'top top',
          invalidateOnRefresh: true,
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
