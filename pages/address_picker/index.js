import regions from '../../utils/regions.js';

export default {
  addressPicker: {
    provinces:     [],//获取到的所有的省
    cities:        [],//选择的该省的所有市
    areas:         [],//选择的该市的所有区县
    defaultValue:  [0, 0, 0],
    selectedRegion: [0, 0, 0],
    animationData: {},
    show:          false,
  },

  setAddressPickerValue(province, city, area) {
    const { addressPicker } = this.data;

    addressPicker.province = province;
    addressPicker.city = city;
    addressPicker.area = area;


    this.setData({ addressPicker });
  },

  showPicker: function() {
    const fadeAnim = wx.createAnimation({
      duration:       500,
      timingFunction: 'ease',
    });
    this.fadeAnim = fadeAnim;

    const showAnim = wx.createAnimation({
      duration:       500,
      timingFunction: 'ease',
    });
    this.showAnim = showAnim;

    fadeAnim.backgroundColor('#000').opacity(0.5).step();
    showAnim.bottom(0+'rpx').step();

    const { addressPicker } = this.data;
    addressPicker.show = true;
    addressPicker.animationData = {
      fadeAnim: fadeAnim.export(),
      showAnim: showAnim.export(),
    };

    this.setData({ addressPicker });
  },

  hidePicker: function() {
    this.fadeAnim.backgroundColor('#fff').opacity(0).step();
    this.showAnim.bottom(-600+'rpx').step();

    const { addressPicker } = this.data;
    addressPicker.show = false;
    addressPicker.animationData = {
      fadeAnim: this.fadeAnim.export(),
      showAnim: this.showAnim.export(),
    };

    this.setData({ addressPicker });

  },

  //点击事件，点击弹出选择页
  openAddressPicker: function(){
    this.initAddressPicker();
    this.showPicker();
  },

  //取消按钮
  cancelPicker :function(){
    //这里也是动画，然其高度变为0
    this.hidePicker();
  },

  //确认按钮
  onAddressPick: function(){
    //一样是动画，级联选择页消失，效果和取消一样
    this.hidePicker();

    const [ provinceIndex, cityIndex, areaIndex ] = this.data.addressPicker.selectedRegion;
    const { addressPicker } = this.data;
    const { provinces, cities, areas } = addressPicker;

    addressPicker.province = provinces[provinceIndex];
    addressPicker.city = cities[cityIndex];
    addressPicker.area = areas[areaIndex];


    this.setData({ addressPicker });
  },

  //滚动选择的时候触发事件
  bindChange: function(e) {
    //这里是获取picker-view内的picker-view-column 当前选择的是第几项
    const _this = this;


    const val = e.detail.value;
    console.log('wtfffffffffffffff', val, this.data.addressPicker.selectedRegion);

    const { addressPicker } = this.data;

    addressPicker.cities = regions[val[0]].cities;
    addressPicker.areas = regions[val[0]].cities[val[1]].areas;

    const { selectedRegion } = addressPicker;
    //省变化，市区分别选中第一个
    if (selectedRegion[0]!=val[0]) {
      addressPicker.selectedRegion = [val[0], 0, 0];
    //市变化，区选中第一个
    } else if(addressPicker.selectedRegion[1]!=val[1]) {
      addressPicker.selectedRegion = [val[0], val[1], 0];
    //区变化，省市不变
    } else {
      addressPicker.selectedRegion = val;
    }
    //

    addressPicker.defaultValue = addressPicker.selectedRegion;

    this.setData({ addressPicker });
  },

  //这里是判断省市名称的显示
  initAddressPicker: function(selected){
    const that=this;

    let provinces    = [];
    let cities       = [];
    let areas        = [];
    let defaultValue = selected || [0, 0, 0];

    const { province, city, area } = this.data.addressPicker;

    //遍历所有的省，将省的名字存到provinces这个数组中
    for (let i =0; i < regions.length; i++) {
      provinces.push({ id: regions[i].id, name: regions[i].name, code: regions[i].code });
    }


    //检查传入的省编码是否有，有的话，选中column第一个游标为province index
    provinces.some((item, index) => {
      if (province && item.code==province.code) {
        defaultValue[0] = index;
        return true;
      }
    });


    const rCities = regions[defaultValue[0]].cities;

    if(rCities){//这里判断这个省级里面有没有市（如数据中的香港、澳门等就没有写市）
      //填充cities数组
      for (let i =0; i < rCities.length; i++) {
        cities.push({ id: rCities[i].id, name: rCities[i].name, code: rCities[i].code });
      }
      //这里是判断这个选择的省里面，有没有相应的下标为cityCode的市，因为这里的下标是前一次选择后的下标，
      //比如之前选择的一个省有10个市，我刚好滑到了第十个市，现在又重新选择了省，但是这个省最多只有5个市，
      //但是这时候的cityCode为9，而这里的市根本没有那么多，所以会报错
      const hasCity = cities.some((item, index) => {
        if (city && item.code==city.code) {
          defaultValue[1] = index;
          return true;
        }
      });


      console.log('执行了区级判断');

      const rAreas = rCities[defaultValue[1]].areas;

      if(rAreas){//这里是判断选择的这个市在数据里面有没有区县
        for (let i =0; i < rAreas.length; i++) {
          areas.push({ id: rAreas[i].id, name: rAreas[i].name, code: rAreas[i].code });
        }
        areas.some((item, index) => {
          if (area && item.code==area.code) {
            defaultValue[2] = index;
            return true;
          }
        }); //这里是判断选择的这个市里有没有下标为areaCode的区县，道理同上面市的选择
      }else{
        //如果这个市里面没有区县，那么把这个市的名字就赋值给areas这个数组
        areas.push(cities[defaultValue[1]]);
      }
    }else{
      //如果该省级没有市，那么就把省的名字作为市和区的名字
      cities.push(provinces[defaultValue[0]]);
      areas.push(provinces[defaultValue[0]]);
    }


    //选择成功后把相应的数组赋值给相应的变量

    const { addressPicker } = this.data;
    addressPicker.provinces = provinces;
    addressPicker.cities = cities;
    addressPicker.areas = areas;

    this.setData({ addressPicker });

    addressPicker.defaultValue = defaultValue;
    addressPicker.selectedRegion = defaultValue;
    this.setData({ addressPicker });



  },

  onLoad:function(){
   
  }
};
