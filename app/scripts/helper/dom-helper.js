const _regHistory = {};
// ---------------------------------------------------------
// private func
// ---------------------------------------------------------
const isUndefined = (value) => {
	return typeof value === 'undefined';
};

const isNull = value => {
	return value === null;
};

const _regClassName = function(className){
  if(_regHistory[className]){
    return _regHistory[className];
  }
  const reg = new RegExp(`(^|\\s+)${className}(\\s+|$)`);
  _regHistory[className] = reg;
  return reg;
};

const _trim = function(str){
  return str.replace(/^\s+|\s+$/g, '');
};

export const hasClass = function(element, className){
  const defaultClassName = element.className;
  if(!defaultClassName || defaultClassName.length === 0){
    return false;
  } else if(defaultClassName === className){
    return true;
  }
  return _regClassName(className).test(defaultClassName);
};

export const addClass = function(element, className){
  if(isNull(element)){
    return;
  }
  const defaultClassName = element.className;
  if(!hasClass(element, className)){
    element.className += (defaultClassName ? ' ' : '') + className;
  }
};

export const removeClass = function(element, className, _except){
  if(isNull(element)){
    return;
  }
  const defaultClassName = element.className;
  let newClassName = '';
  if(_except || hasClass(element, className)){
    newClassName = _trim(defaultClassName.replace(_regClassName(className), ' '));
    element.className = newClassName;
  }
};

export const text = function(element, str = ''){
  if(isUndefined(element.textContent)){
    element.innerText = str;
  } else {
    element.textContent = str;
  }
};