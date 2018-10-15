//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    hidden: true,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindYanjie: function() {
    wx.navigateTo({
      url: '../organization/organization'
    })
  },
  onLoad: function() {
    var _this = this;
    //调用应用实例的方法获取全局数据
    _this.setData({
      hidden: false
    })
    
    wx.login({
      success: function(loginCode) {
        // console.log(loginCode)
        var appid = 'wx86226aa89478a313'; //填写微信小程序appid  
        var secret = '32f19cbb60cbe17cbd360214643dcbf6'; //填写微信小程序secret 
        wx.getUserInfo({
          withCredentials: false,
          success: function(res) {
            //头像，用户昵称等信息
            app.globalData.userInfo = res.userInfo;
            console.log(res.userInfo)
            _this.setData({
              motto: res.userInfo.avatarUrl
            });
          }
        });

        console.log("登陆完成...");
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + loginCode.code + '&grant_type=authorization_code',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            //根据openid获取用户信息
            app.globalData.openid = res.data.openid;
            console.log(res);
            wx.request({
              url: app.globalData.global_url + '/device/install/user/info/' + app.globalData.openid,
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function(res) {
                // console.log("http success" + JSON.stringify(res, null, 4));
                if (res.data == "") {
                  wx.navigateTo({
                    url: '../page_user_bind/page_user_bind'
                  })
                } else {
                  _this.setData({
                    userInfo: res.data,
                    hidden: true
                  })
                }
              },
              fail: function() {
                console.log("http fail");
              },
              complete: function() {}
            })
          }
        });
      }
    })
  }
})