import { TweenLite, Sine, Expo } from 'gsap';
import AbstractSection from './abstract-section';

class Section05 extends AbstractSection{
  constructor(container){
    super(container);
    TweenLite.set(this._inner, { alpha: 0 });
  }

  onEnter(){
    super.onEnter();
    // reset
    TweenLite.set(this._inner, { rotation: 0 });
    window.setTimeout(() => {
      TweenLite.to(this._inner, 1, {
        alpha: 1,
        ease: Sine.easeOut
      });
      TweenLite.to(this._inner, 2, {
        rotation: 720,
        delay: .4,
        ease: Expo.easeOut,
        onComplete: () => {
          this._isPlaying = false;
          super.emit('enterAfter', { target: this });
        }
      });
    }, 1000);
  }

  onExit(){
    super.onExit();

  }
}

 export default Section05;
