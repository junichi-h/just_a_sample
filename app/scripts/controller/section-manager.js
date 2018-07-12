import EventEmitter from 'eventemitter3';
import Section01 from '../sections/section01';
import Section02 from '../sections/section02';
import Section03 from '../sections/section03';
import Section04 from '../sections/section04';
import Section05 from '../sections/section05';

class SectionManger extends EventEmitter{
  constructor(){
    super();

    this._sections = [
        new Section01(document.getElementById('section01')),
        new Section02(document.getElementById('section02')),
        new Section03(document.getElementById('section03')),
        new Section04(document.getElementById('section04')),
        new Section05(document.getElementById('section05'))
    ];

    this._currentSectionIndex = 0;
    this._btnNext = document.getElementById('next');
    this._btnPrev = document.getElementById('prev');

    this._onNext = this._onNext.bind(this);
    this._onPrev = this._onPrev.bind(this);
    this._goto = this._goto.bind(this);
    this._onEnterAfter = this._onEnterAfter.bind(this);
    this._onExitAfter = this._onExitAfter.bind(this);
  }

  init(){
    this._btnNext.addEventListener('click', this._onNext);
    this._btnPrev.addEventListener('click', this._onPrev);
    this._sections[this._currentSectionIndex].onEnter();
    this._sections.forEach((section) => {
      section.on('enterAfter', this._onEnterAfter);
      section.on('exitAfter', this._onExitAfter);
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
    this._sections[prev].onExit();
    this._sections[next].onEnter();
  }
}

export default SectionManger;
