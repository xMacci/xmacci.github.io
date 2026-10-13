import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.options = {
      slidesPerView: 3,
      spaceBetween: 150,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
    };
    this.setOptions();
    this.init();
  }
  setOptions() {
    if ('autoplay' in this.element.dataset) {
      this.options.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };
    }
    if ('loop' in this.element.dataset) {
      this.options.loop = {
        loop: true,
      };
    }
    if ('slides' in this.element.dataset) {
      this.options.slidesPerView =
        parseInt(this.element.dataset.slides, 10) || this.options.slidesPerView;
    }
    if ('split' in this.element.dataset) {
      this.options.breakpoints = {
        100: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        935: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: this.options.slidesPerView,
        },
      };
    }
  }
  init() {
    new Swiper(this.element, this.options);
  }
}
