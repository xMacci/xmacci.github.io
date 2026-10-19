import ComponentFactory from './ComponentFactory.js';
import Icons from './utils/Icons.js';
import CustomCursor from './utils/CustomCursor.js';
import Balatro from './utils/Balatro.js';

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
  }
}

new Main();
