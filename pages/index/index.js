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
      { code: '110000', name: '北京' },
      { code: '110100', name: '北京' },
      { name: '丰台', code: '110105' }
    )
  }
})

Page(option)
