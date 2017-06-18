function registComp() {
  let pageObj = arguments[0];
  let length = arguments.length;
  for (let i = 1; i < length; i++) {
    let compObj = arguments[i];
    // for (let compKey in compObj) {
    // if (compKey == 'data') {
    // let data = compObj[compKey];
    // for(let dataKey in data) {
    // pageObj.data[dataKey] = data[dataKey];
    // }
    // } else {
    // pageObj[compKey] = compObj[compKey];
    // }
    // }
    for (let compKey in compObj) {
      if (typeof (compObj[compKey]) == 'object') {
        // 合并页面中的data
        let data = compObj[compKey];
        pageObj.data[compKey] = data;

      } else {
        // 合并页面中的方法
        pageObj[compKey] = compObj[compKey];
      }
    }
  }
}


export default {
  registComp
}