export default class Scrolly {
  constructor(element) {
    this.element = element;

    this.options = {
      rootMargin: '0px 0px 0px 0px',
      repeat: true,
    };

    this.init();
  }

  init() {
    this.setOptions();
    const observer = new IntersectionObserver(
      this.watch.bind(this),
      this.options,
    );
    const items = this.element.querySelectorAll('[data-scrolly]');
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      observer.observe(item);
    }
  }
  watch(entries, observer) {
    console.log('watch');
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target;

      if (entry.isIntersecting) {
        console.log('oui');
        target.classList.add('is-active');

        if (!this.options.repeat) {
          observer.unobserve(target); //if needed dont replay animation
        }
      } else {
        console.log('non');
        target.classList.remove('is-active');
      }
    }
  }
  setOptions() {
    console.log(this.element.dataset);
    if ('noRepeat' in this.element.dataset) {
      this.options.repeat = false;
    }
  }
}
