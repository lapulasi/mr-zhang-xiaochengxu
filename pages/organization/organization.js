var app = getApp();

Page({
  data: {
    companyIndex: 0,
    companyRangeKey: 'name',
    companyArray: [{
      name: ''
    }],
    subCompanyIndex: 0,
    subCompanyRangeKey: 'name',
    subCompanyArray: [{
      name: ''
    }],
    officeIndex: 0,
    officeRangeKey: 'name',
    officeArray: [{
      name: ''
    }],
    shangquanIndex: 0,
    shangquanRangeKey: 'name',
    shangquanArray: [{
      name: ''
    }],
    shopIndex: 0,
    shopRangeKey: 'name',
    shopArray: [{
      name: ''
    }],
    personIndex: 0,
    personKey: 'person_name',
    personArray: [{
      person_name: ''
    }],
    levelData: [], //存层级数据
    isSubCompany: true,
    isOffice: true,
    isShangquan: true,
    isShop: true,
    isChange: true, //修改信息是否可点
    isSelect: 'changeBtn_h'
  },
  bindPickerChangeCompany: function(e) {
    this.setData({
      companyIndex: e.detail.value,
      isSubCompany: false
    })
    this.getLevelData();
  },
  bindSubCompany: function(e) {
    this.setData({
      subCompanyIndex: e.detail.value,
      isOffice: false
    })
    this.getOfficeData();
  },
  bindPickerChangeOffice: function(e) {
    this.setData({
      officeIndex: e.detail.value,
      isShangquan: false
    })
    this.getShangquanData();
  },
  bindPickerChangeShangquan: function(e) {
    this.setData({
      shangquanIndex: e.detail.value,
      isShop: false
    })
    this.getShopData();
  },
  bindPickerChangeShop: function(e) {
    this.setData({
      shopIndex: e.detail.value
    })
    this.getInstallDetail()
  },
  getInstallDetail: function() {
    var _this = this
    wx.request({
      url: app.globalData.global_url + '/device/install/shop/' + _this.data.shopArray[_this.data.shopIndex].id,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        console.log("getInstallDetail http success" + JSON.stringify(res, null, 4));
        if (res.data != "") {
          _this.setData({
            isChange: false,
            isSelect: 'changeBtn_s'
          })
        } else {
          _this.setData({
            isChange: true,
            isSelect: 'changeBtn_h'
          })
        }
      },
      fail: function() {
        console.log("http fail");
      },
      complete: function() {

      }
    })
  },
  changeInformation: function() {
    wx.navigateTo({
      url: '../shop_info_record/shop_info_record?shopName=' + this.data.shopArray[this.data.shopIndex].name + '&shopId=' + this.data.shopArray[this.data.shopIndex].id + '&isChange=1'
    })
  },
  entryInformation: function(e) {
    // console.log('您选择的门店是:' + this.data.shopArray[this.data.shopIndex].name)
    if (this.data.shopArray[this.data.shopIndex].name == '') {
      wx.showToast({
        title: '请选择门店',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../shop_info_record/shop_info_record?shopName=' + this.data.shopArray[this.data.shopIndex].name + '&shopId=' + this.data.shopArray[this.data.shopIndex].id + '&isChange=0'
      })
    }

  },
  onLoad: function() {
    var _this = this;
    _this.getCompanyList();

  },
  getCompanyList: function() {
    var _this = this;
    wx.request({
      url: app.globalData.global_url + '/org/list/company/all',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        // console.log("organization http success" + JSON.stringify(res, null, 4));
        if (res.data.length > 0) {
          _this.setData({
            companyArray: res.data
          })
        }
      },
      fail: function() {
        console.log("http fail");
      },
      complete: function() {}
    })
  },

  getLevelData: function(name) {
    var _this = this;
    wx.request({
      url: app.globalData.global_url + '/org/level/list/' + _this.data.companyArray[_this.data.companyIndex].id,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res) {
        // console.log("getLevelData http success" + JSON.stringify(res, null, 4));
        var len = res.data.length;
        if (len > 0) {
          _this.setData({
            levelData: res.data.slice(1)
          })
        } else {
          wx.showToast({
            title: '暂无层级数据',
          })
        }
      },
      fail: function() {
        console.log("http fail");
      },
      complete: function() {
        _this.getSubCompany()
      }
    })
  },

  getSubCompany: function() {
    var _this = this
    if (_this.data.levelData.length > 0) {
      wx.request({
        url: app.globalData.global_url + '/org/list',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data: {
          levelId: _this.data.levelData[0].id,
          orgCode: _this.data.companyArray[_this.data.companyIndex].id
        },
        success: function(res) {
          // console.log("getSubCompany http success" + JSON.stringify(res, null, 4));
          if (res.data.length > 0) {
            _this.setData({
              subCompanyArray: res.data
            })
          }
        },
        fail: function() {
          console.log("http fail");
        },
        complete: function() {}
      })
    } else {
      wx.showToast({
        title: '暂无层级数据',
      })
    }

  },
  getOfficeData: function() {
    var _this = this
    if (_this.data.levelData.length > 0) {
      wx.request({
        url: app.globalData.global_url + '/org/list',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data: {
          levelId: _this.data.levelData[1].id,
          orgCode: _this.data.subCompanyArray[_this.data.subCompanyIndex].orgCode
        },
        success: function(res) {
          // console.log("getOfficeData http success" + JSON.stringify(res, null, 4));
          if (res.data.length > 0) {
            _this.setData({
              officeArray: res.data
            })
          }
        },
        fail: function() {
          console.log("http fail");
        },
        complete: function() {}
      })
    } else {
      wx.showToast({
        title: '暂无层级数据',
      })
    }

  },
  getShangquanData: function(callback) {
    var _this = this
    if (_this.data.levelData.length > 0) {
      wx.request({
        url: app.globalData.global_url + '/org/list',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data: {
          levelId: _this.data.levelData[2].id,
          orgCode: _this.data.officeArray[_this.data.officeIndex].orgCode
        },
        success: function(res) {
          // console.log("getOfficeData http success" + JSON.stringify(res, null, 4));
          if (res.data.length > 0) {
            _this.setData({
              shangquanArray: res.data
            })
          }
        },
        fail: function() {
          console.log("http fail");
        },
        complete: function() {}
      })
    } else {
      wx.showToast({
        title: '暂无层级数据',
      })
    }

  },
  getShopData: function() {
    var _this = this
    if (_this.data.levelData.length > 0) {
      wx.request({
        url: app.globalData.global_url + '/org/list',
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data: {
          levelId: _this.data.levelData[3].id,
          orgCode: _this.data.shangquanArray[_this.data.shangquanIndex].orgCode
        },
        success: function(res) {
          // console.log("getOfficeData http success" + JSON.stringify(res, null, 4));
          if (res.data.length > 0) {
            _this.setData({
              shopArray: res.data
            })
          }
        },
        fail: function() {
          console.log("http fail");
        },
        complete: function() {}
      })
    } else {
      wx.showToast({
        title: '暂无层级数据',
      })
    }

  }
})