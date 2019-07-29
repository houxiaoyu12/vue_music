//jsonp方法封装

import originJSONP from 'jsonp'

export default function (url, data, option) {
  url += (url.indexOf('?')<0 ? '?' : '&') + param(data);

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if(!err){//表示成功
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

//处理data
function param(data) {
  let url = '';
  for(let k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`//转换成url
  }
  return url ? url.substring(1) : '';
}
