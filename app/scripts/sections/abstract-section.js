import EventEmitter from 'eventemitter3';
import { TweenLite, Sine } from 'gsap';

class AbstractSection extends EventEmitter{
  constructor(container){
    super();
    this._container = container;
    this._inner = this._container.querySelector('.inner');
    this._isPlaying = false;

    // 初期段階でcontainerにalpha:0, display: 'none' にセット
    TweenLite.set(this._container, { alpha: 0 });
    this._container.style.display = 'none';
  }

  /**
   * @protected
   * 該当するSection INするアニメーションを継承する親で書く
   */
  onEnter(){
    if(this._isPlaying){
      return;
    }
    super.emit('enterBefore');
    this._isPlaying = true;
    TweenLite.set(this._inner, {
      scaleX: 1,
      scaleY: 1
    });
    this._container.style.display = 'block';
    TweenLite.to(this._container, 1.2, {
      alpha: 1,
      ease: Sine.easeOut
    });
  }

  /**
   * @protected
   * 該当するSection Out.
   * アニメーションは継承する親で記載
   */
  onExit(){
    if(this._isPlaying){
      return;
    }
    this._isPlaying = true;
    super.emit('exitBefore');
    TweenLite.to(this._inner, 0.9, {
      scaleX: 0.6,
      scaleY: 0.6,
      ease: Expo.easeOut
    });
    TweenLite.to(this._container, 1.2, {
      alpha: 0,
      delay: .2,
      display: 'none',
      ease: Sine.easeOut,
      onComplete: () => {
        this._isPlaying = false;
        super.emit('exitAfter');
      }
    });
  }

  resize(width, height){
    console.log(width, height);
  }

  get isPlaying(){
    return this._isPlaying;
  }
}

export default AbstractSection;