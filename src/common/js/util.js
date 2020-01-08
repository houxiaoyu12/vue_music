//生成随机数
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}
//数组顺序洗牌
export function shuffle(arr) {
	let _arr = arr.slice()
	for (let i = 0; i < _arr.length; i++) {
		let j = getRandomInt(0, i)
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	return _arr
}

//函数防抖
export function debounce(fn, t) {
  let timer
  let delay = t || 500;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  }
}