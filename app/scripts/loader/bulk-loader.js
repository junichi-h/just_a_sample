const items = {};

class BulkLoader{
	/**
	 * JSONを読み込み開始
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	static loadJSON(url){
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const onJSONLoadingCompleted = (event) => {
				xhr.removeEventListener('load', onJSONLoadingCompleted);
				xhr.removeEventListener('error', onError);
				if(xhr.readyState === 4 && xhr.status === 200){
					items[url] = {
						data: xhr.response
					}
					resolve(xhr.response);
				}
			};

			const onError = (error) => {
				xhr.removeEventListener('load', onJSONLoadingCompleted);
				xhr.removeEventListener('error', onError);
				reject(error);
			};

			xhr.addEventListener('load', onJSONLoadingCompleted);
			xhr.addEventListener('error', onError);
			xhr.responseType = 'json';
			xhr.open('get', url, true);
			xhr.send();
		});
	}

	/**
	 * videoを読み込み
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	static loadVideo(url){
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const onVideoCompleted = (event) => {
				xhr.removeEventListener('load', onVideoCompleted);
				xhr.removeEventListener('error', onError);
				if(xhr.readyState === 4 && xhr.status === 200){
					items[url] = {data: xhr};
					resolve(xhr.responseURL);
				}
			};
			
			const onError = (error) => {
				xhr.removeEventListener('load', onVideoCompleted);
				xhr.removeEventListener('error', onError);
				reject(error);
			};

			xhr.addEventListener('load', onVideoCompleted);
			xhr.addEventListener('error', onError);
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