/*操作dom的方法*/

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ')
}

//右侧获取点击字母dom事件封装
export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if(val){
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}
