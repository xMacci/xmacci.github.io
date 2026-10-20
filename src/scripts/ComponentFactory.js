import Scroller from './components/Scroller.js';
import Scrolly from './components/Scrolly.js';
import Carousel from './components/Carousel.js';
import Youtube from './components/YouTube.js';
import Accordion from './components/Accordion.js';
import Form from './components/Form.js';
import Header from './components/Header.js';
import Tabs from './components/Tabs.js';
import TextAnim from './components/TextAnim.js';
import Projets from './components/Projets.js';
import Words from './components/Words.js';
import Theme from './components/theme.js';
import Pointer from './components/Pointer.js';
import GsapAnimate from './components/GsapAnimate.js';

export default class ComponentFactory {
  constructor() {
    this.componentInstances = [];
    this.componentList = {
      Scroller,
      Scrolly,
      Carousel,
      YouTube: Youtube,
      Accordion,
      Form,
      Header,
      Tabs,
      TextAnim,
      Projets,
      Theme,
      Words,
      Pointer,
      GsapAnimate,
    };
    this.init();
  }
  init() {
    const components = document.querySelectorAll('[data-component]');

    for (let i = 0; i < components.length; i++) {
      const element = components[i];
      const componentName = element.dataset.component;

      if (this.componentList[componentName]) {
        const instance = new this.componentList[componentName](element);
        this.componentInstances.push(instance);
      } else {
        console.log(`La composante ${componentName} n'existe pas`);
      }
    }
  }
}
