var app = getApp();
Page({
  data: {
    motto: '',
    userInfo: {},
    person_name: '',
    mobile_phone: '',
    old_name: '',
    fenjuIndex: 0,
    fenjuRangeKey: 'fenju',
    fenjuArray: [{
      fenju: '正在加载...'
    }],
    belong_departmentIndex: 0,
    belong_departmentRangeKey: 'belong_department',
    belong_departmentArray: [{
      belong_department: '正在加载...'
    }],
    personIndex: 0,
    personKey: 'person_name',
    personArray: [{
      person_name: '正在加载...'
    }],
    hidden: false
  },
  bindPersonNameInput: function(e) {
    this.setData({
      person_name: e.detail.value
    })
  },
  bindMobilePhoneInput: function(e) {
    this.setData({
      mobile_phone: e.detail.value
    })
  },
  tapSubmit: function() {
    var _this = this;
    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var flag = reg.test(_this.data.mobile_phone)
    if (!flag) {
      wx.showToast({
        title: '请输入正确的手机号码！',
      })
    } else {
      var dataMap = {
        name: _this.data.person_name,
        openId: app.globalData.openid,
        phone: _this.data.mobile_phone
      }

      wx.request({
        url: app.globalData.global_url + '/device/install/user/add/',
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        data: dataMap,
        success: function(res) {
         // console.log("user_bind http success" + JSON.stringify(res, null, 4));
          if (res.data.resultCode == 'SUCCESS') {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              complete: function() {
                wx.navigateTo({
                  url: '../index/index',
                })
              }
            })
          }
        },
        fail: function() {
          console.log("http fail");
        },
        complete: function() {}
      })
    }
  },
  onLoad: function() {

  }
})