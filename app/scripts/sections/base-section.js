import EventEmitter from 'eventemitter3';

import { addClass, text } from '../helper/dom-helper';

class BaseSection extends EventEmitter{
	constructor(container, params){
		super();
		this._container = container;
		this.params = params;
		this._inner = this._container.querySelector('.inner');
		this._isPlaying = false;
		// 初期段階でcontainerにalpha:0, display: 'none' にセット
    	TweenLite.set(this._container, { alpha: 0 });
    	this._container.style.display = 'none';

    	this._createElement = this._createElement.bind(this);
	}

	/**
	 * 初期化
	 * @public
	 */
	init(){
		this._createElement();
	}

	/**
	 * JSONからの値でDOMを生成する。
	 * @return {[type]} [description]
	 */
	_createElement(){
		this._container.style.background = this.params.style.background;
		const _text = this.params.elements[0].text;
		/*
			<div class="inner">
				<div class="title">${text}</div>
			</div>
			上記構成のHTMLを生成する
		*/
		const title = document.createElement('div');
		text(title, _text);
		addClass(title, 'title');
		this._inner.appendChild(title);
	}

	onEnter(){
		if(this._isPlaying){
      		return;
    	}
    	TweenLite.set(this._container, { alpha: 0 });
    	TweenLite.set(this._inner, { rotation: 0 });
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

export default BaseSection;
