//index.js
//获取应用实例

import util from '../../utils/util';
import addressPicker from '../address_picker/index';

console.log(util)

let option = {
  data: {},
};
util.registComp(option, addressPicker, {
  data: {
    
  },
  onLoad() {
    this.setAddressPickerValue(
      { code: '110000', name: '省' },
      { code: '110100', name: '市' },
      { name: '区', code: '110101' }
    )
  }
})

Page(option)
