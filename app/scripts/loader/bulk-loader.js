import axios from 'axios';

const items = {};

class BulkLoader{
	/**
	 * JSONを読み込み開始
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	static loadJSON(url){
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url
			}).then((response) => {
				items[url] = {
					data: response
				};
				resolve(response);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	/**
	 * videoを読み込み
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	static loadVideo(url){
		return new Promise((resolve, reject) => {
			const onVideoCompleted = (event) => {
				const _xhr = event.target;
				_xhr.removeEventListener('load', onVideoCompleted);
				if(_xhr.readyState === 4 && _xhr.status === 200){
					items[url] = {data: _xhr};
					resolve(_xhr.responseURL);
				}
			};

			const xhr = new XMLHttpRequest();
			xhr.addEventListener('load', onVideoCompleted);
			xhr.open('get', url, true);
			xhr.responseType = 'blob';
			xhr.send();
		});
	}

	static getItemByKey(key){
		return items[key] ? items[key] : null;
	}

	static remove(key){
		if(items[key] === null){
			return;
		}
		delete items[key];
	}

	/**
	 * 全てのキューをremoveする
	 * @return {[type]} [description]
	 */
	static removeAll(){
		Object.keys(items).forEach((key) => {
			delete items[key];
		});
		items = {};
	}

	constructor(){
		console.log('%cBulkLoader', 'color:#54d0ba;background:#333;padding:.25em;font-size:18px;font-weight:bold');
	}
}

export default BulkLoader;