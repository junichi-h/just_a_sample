import { TweenLite, Expo } from 'gsap';
import SectionManger from './controller/section-manager';

class Main{
  constructor(){
    this.manager = new SectionManger();
  }

  hideLoader(){
    const loader = document.getElementById('loader');
    const inner = loader.querySelector('.loader');
    const buttonContainer = document.getElementById('button-container');
    TweenLite.set(buttonContainer, { alpha: 0 });
    TweenLite.to(inner, 1, {
      scaleX: 0.6,
      scaleY: 0.6,
      ease: Expo.easeOut
    });
    TweenLite.to(loader, 1.2, {
      alpha: 0,
      delay: .2,
      display: 'none',
      ease: Expo.easeOut,
      onComplete: () => {
        this.manager.init();
        window.setTimeout(() => {
          TweenLite.to(document.getElementById('button-container'), 0.6, {
            alpha: 1,
            ease: Expo.easeOut
          });
        }, 1500)
      }
    });
  }
}

const main = new Main();
window.setTimeout(() => {
  main.hideLoader();
}, 2000);


