import EventEmitter from 'eventemitter3';
import { TweenLite, Expo } from 'gsap';
import BulkLoader from '../loader/bulk-loader';
import BaseSection from '../sections/base-section';

class SectionManger extends EventEmitter{
  constructor(){
    super();
    this._sections = [];
    this._currentSectionIndex = 0;
    this._btnNext = document.getElementById('next');
    this._btnPrev = document.getElementById('prev');
    this._jsonData = null;

    this._onJSONLoadingCompleted = this._onJSONLoadingCompleted.bind(this);
    this._hideLoader = this._hideLoader.bind(this);
    this._onNext = this._onNext.bind(this);
    this._onPrev = this._onPrev.bind(this);
    this._goto = this._goto.bind(this);
    this._onEnterAfter = this._onEnterAfter.bind(this);
    this._onExitAfter = this._onExitAfter.bind(this);
    this._onResize = this._onResize.bind(this);
    this._preloadVideo = this._preloadVideo.bind(this);
    this._onFirstVideoLoadingCompleted = this._onFirstVideoLoadingCompleted.bind(this);
  }

  init(){
    // start loading json
    BulkLoader.loadJSON('assets/data/section.json').then(this._onJSONLoadingCompleted);
  }

  /**
   * JSON ローディング完了
   * @param  {[type]} response [description]
   * @return {[type]}          [description]
   */
  _onJSONLoadingCompleted(response){
    const dataList = response;
    this._jsonData = dataList;
    // start load video
    BulkLoader.loadVideo(`assets/videos/${dataList[0].videoUrl}`).then(this._onFirstVideoLoadingCompleted);
    const parent = document.getElementById('main');
    const children = parent.querySelectorAll('.section');

    for(let i = 0, num = dataList.length; i < num; i++){
      const section = new BaseSection(children[i], dataList[i]);
      section.init();
      this._sections[i] = section;
    }

    this._hideLoader();
  }

  /**
   * 最初の動画読み込み終えたら次の
   * @return {[type]} [description]
   */
  _onFirstVideoLoadingCompleted(){
    this._preloadVideo();
  }

  _hideLoader(){
    const loader = document.getElementById('loader');
    const inner = loader.querySelector('.loader');
    const buttonContainer = document.getElementById('button-container');

    this._btnNext.addEventListener('click', this._onNext);
    this._btnPrev.addEventListener('click', this._onPrev);

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
        console.log(this._sections[0]);
        this._sections[0].onEnter();
        window.setTimeout(() => {
          TweenLite.to(document.getElementById('button-container'), 0.6, {
            alpha: 1,
            ease: Expo.easeOut
          });
        }, 1500)
      }
    });
  }

  /**
   * 次へが押されたら
   * @param event
   * @private
   */
  _onNext(event){
    event.preventDefault();
    // アニメーション中もしくは現在表示してるsectionが最大のsectionの時は何もさせない
    if(this._sections[this._currentSectionIndex].isPlaying || this._currentSectionIndex >= this._sections.length - 1){
      return;
    }
    const prevIndex = this._currentSectionIndex;
    const nextIndex = Math.min(this._currentSectionIndex + 1, this._sections.length - 1);
    this._goto(prevIndex, nextIndex);
  }

  /**
   * 戻るが押されたら
   * @private
   */
  _onPrev(){
    event.preventDefault();
    // アニメーション中もしくは現在表示してるsectionが0番目のsectionの時は何もさせない
    if(this._sections[this._currentSectionIndex].isPlaying || this._currentSectionIndex === 0){
      return;
    }
    const prevIndex = this._currentSectionIndex;
    const nextIndex = Math.min(this._currentSectionIndex - 1, this._sections.length - 1);
    this._goto(prevIndex, nextIndex);
  }
  /**
   * Enterのアニメーション完了
   * 各sectionクラスのEventEmitterがdipatchしてます。
   */
  _onEnterAfter(event){
    console.log('enter完了');
    console.log(event);
  }
  /**
   * Exitのアニメーション完了
   */
  _onExitAfter(){}

  /**
   * 該当するsectionを消しつつInのアニメーションをさせる
   */
  _goto(prev, next){
    if(prev === next) {
      return;
    }
    this._currentSectionIndex = next;
    this._preloadVideo();
    this._sections[prev].onExit();
    this._sections[next].onEnter();
  }

  /**
   * 今表示してる次のSection用の動画を読み込みさせる
   * @return {[type]} [description]
   */
  _preloadVideo(){
    const nextIndex = Math.min(this._currentSectionIndex + 1, this._sections.length - 1);
    const nextVideoUrl = `assets/videos/${this._jsonData[nextIndex].videoUrl}`;
    const item = BulkLoader.getItemByKey(nextVideoUrl);
    if(item === null){
      BulkLoader.loadVideo(nextVideoUrl);
    }
  }

  _onResize(){
    const width = window.innerWidth;
    const height = window.innerHeight;

    this._sections.forEach((section) => {
      section.resize(width, height);
    });
  }
}

export default SectionManger;
