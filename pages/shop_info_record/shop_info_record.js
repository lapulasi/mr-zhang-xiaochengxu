 var app = getApp();
 var util = require('../../utils/util.js');
 Page({
   data: {
     record_id: '',
     hidden: true,
     camerasNumArray: [0, 1, 2, 3, 4, 5, 6],
     viewCamerasIndex: 0,
     faceCamerasIndex: 0,
     viewCameraNumberValueArray: [],
     faceCameraNumberValueArray: [],
     viewChangeCameraNumberValueArray: [],
     faceChangeCameraNumberValueArray: [],
     date: '',
     viewImagesArray: [],
     faceImagesArray: [],
     tipTxt: '',
     delBtnClass: 'hide',
     shopName: '',
     shopId: '',
     shopAreaValue: '',
     testEffectValue: '',
     isViewCoverShow: 'hide',
     isFaceCoverShow: 'hide',
     isChangeViewCoverShow: 'hide',
     isChangeFaceCoverShow: 'hide',
     viewImgUrls: [],
     faceImgUrls: [],
     check1: false,
     check2: false,
     check3: false,
     check4: false,
     check5: false,
     isChangePage: 0,
     isChangeComponentShow: 'hide',
     viewChangeWhy: '',
     faceChangeWhy: '',
     imgUrl: ''
   },
   onLoad: function(options) {
     var _this = this;
     // 页面初始化 options为页面跳转所带来的参数
     this.setData({
       shopId: parseInt(options.shopId),
       isChangePage: parseInt(options.isChange)
     });

     //如果是编辑一个记录，则显示删除按钮
     if (options.record_id) {
       this.setData({
         delBtnClass: 'btn_show',
         record_id: options.record_id
       });
     }

     if (_this.data.isChangePage == 1) {
       _this.getInstallDetail()
       this.setData({
         isChangeComponentShow: 'flex'
       })
     }

   },

   getInstallDetail: function() {
     var _this = this
     wx.request({
       url: app.globalData.global_url + '/device/install/shop/' + _this.data.shopId,
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       success: function(res) {
         console.log("getInstallDetail http success" + JSON.stringify(res, null, 4));
         var result = res

         if (result.data != "") {
           _this.setData({
             imgUrl: app.globalData.global_imgUrl,
             viewCamerasIndex: result.data.viewNum,
             viewCameraNumberValueArray: result.data.viewUids,
             viewChangeCameraNumberValueArray: result.data.historyViewUids,
             viewImagesArray: result.data.viewImgUrls,
             viewImgUrls: result.data.viewImgUrls,
             faceCamerasIndex: result.data.faceNum,
             faceCameraNumberValueArray: result.data.faceUids,
             faceChangeCameraNumberValueArray: result.data.historyFaceUids,
             faceImagesArray: result.data.faceImgUrls,
             faceImgUrls: result.data.faceImgUrls,
             date: result.data.date == null ? '': util.formatTime(result.data.date),
             descValue: result.data.shopRemark,
             testEffectValue: result.data.testRemark,
             viewChangeWhy: result.data.viewReplaceRemark,
             faceChangeWhy: result.data.faceReplaceRemark
           })
         }
       },
       fail: function() {
         console.log()
       }
     })
   },

   addViewImages: function() {
     var _this = this
     wx.chooseImage({
       count: 1,
       success: function(res) {
         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         var tempFilePaths = res.tempFilePaths
         var len = _this.data.viewImagesArray.length
         _this.data.viewImagesArray[len] = tempFilePaths[0]

         _this.setData({
           viewImagesArray: _this.data.viewImagesArray
         })
         wx.uploadFile({
           url: app.globalData.global_url + '/device/install/upload',
           filePath: tempFilePaths[0],
           name: 'file',
           success: function(res) {
             var data = JSON.parse(res.data)
             var len = _this.data.viewImgUrls.length
             _this.data.viewImgUrls[len] = data.resultData
             _this.setData({
               viewImgUrls: _this.data.viewImgUrls
             })
           }
         })

       }
     })
   },

   deleteViewImage: function(e) {
     var index = parseInt(e.currentTarget.dataset.index)
     var _this = this
     wx.showModal({
       title: '温馨提示',
       content: '确定删除图片吗？',
       success: function(res) {
         if (res.confirm) {
           var tempArray = _this.data.viewImagesArray.slice(0, index).concat(_this.data.viewImagesArray.slice(index + 1))
           var tempImgUrls = _this.data.viewImgUrls.slice(0, index).concat(_this.data.viewImgUrls.slice(index + 1))
           _this.setData({
             viewImagesArray: tempArray, // 改变页面显示的图片数组
             viewImgUrls: tempImgUrls // 改变给后天的图片流数组
           })
         } else if (res.cancel) {}
       }
     })
   },

   addFaceImages: function() {
     var _this = this
     wx.chooseImage({
       success: function(res) {
         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         var tempFilePaths = res.tempFilePaths
         var len = _this.data.faceImagesArray.length
         _this.data.faceImagesArray[len] = tempFilePaths
         _this.setData({
           faceImagesArray: _this.data.faceImagesArray
         })
         // console.log(_this.data.faceImagesArray)
         wx.uploadFile({
           url: app.globalData.global_url + '/device/install/upload',
           filePath: tempFilePaths[0],
           name: 'file',
           success: function(res) {
             var data = JSON.parse(res.data)
             // console.log(data);
             var len = _this.data.faceImgUrls.length
             _this.data.faceImgUrls[len] = data.resultData
             _this.setData({
               faceImgUrls: _this.data.faceImgUrls
             })
           }
         })
       }
     })
   },

   deleteFaceImage: function(e) {
     var index = parseInt(e.currentTarget.dataset.index)
     var _this = this
     wx.showModal({
       title: '温馨提示',
       content: '确定删除图片吗？',
       success: function(res) {
         if (res.confirm) {
           var tempArray = _this.data.faceImagesArray.slice(0, index).concat(_this.data.faceImagesArray.slice(index + 1))
           var tempImgUrls = _this.data.faceImgUrls.slice(0, index).concat(_this.data.faceImgUrls.slice(index + 1))
           _this.setData({
             faceImagesArray: tempArray,
             faceImgUrls: tempImgUrls
           })
         } else if (res.cancel) {}
       }
     })
   },
   onUnload: function() {

   },
   bindViewCamerasChange: function(e) {
     this.setData({
       viewCamerasIndex: e.detail.value
     })
   },
   bindFaceCamerasChange: function(e) {
     this.setData({
       faceCamerasIndex: e.detail.value
     })
   },
   bindDateChange: function(e) {
     var today = new Date()
     var handlerDate = new Date(e.detail.value)
     if (handlerDate > today){ //如果安装时间晚于今天的日期，则选择今天的日期 
       today = util.formatTime(today)
       this.setData({
         date: today
       })
     }else{
       this.setData({
         date: e.detail.value
       })
     }
   },

   bindKehumingchengInput: function(e) {
     this.setData({
       kehumingchengValue: e.detail.value
     })
   },
   bindShopAreaInput: function(e) {
     this.setData({
       shopAreaValue: e.detail.value
     })
   },

   bindViewCameraNumbInput: function() {
     wx.scanCode({
       success: (res) => {
         const camera_len = this.data.viewCameraNumberValueArray.length
         if (!this.data.viewCameraNumberValueArray.includes(res.result)) {
           this.data.viewCameraNumberValueArray[camera_len] = res.result
           this.setData({
             viewCameraNumberValueArray: this.data.viewCameraNumberValueArray
           })
         }
         wx.showToast({
           title: '录入成功！',
           icon: 'success',
           duration: 2000
         })
       }
     })
   },
   checkViewCameraNumbInput: function() {
     if (this.data.viewCameraNumberValueArray.length > 0) {
       this.setData({
         isViewCoverShow: 'show',
         isFaceCoverShow: 'hide',
         isChangeViewCoverShow: 'hide',
         isChangeFaceCoverShow: 'hide',
       })
     } else {
       wx.showToast({
         title: '没有录入编号',
         icon: 'none',
         duration: 2000
       })
     }
   },
   bindChangeViewCameraNumbInput: function() {
     wx.scanCode({
       success: (res) => {
         const camera_len = this.data.viewChangeCameraNumberValueArray.length
         if (!this.data.viewChangeCameraNumberValueArray.includes(res.result)) {
           this.data.viewChangeCameraNumberValueArray[camera_len] = res.result
           this.setData({
             viewChangeCameraNumberValueArray: this.data.viewChangeCameraNumberValueArray
           })
         }

         // console.log(this.data.viewCameraNumberValueArray.includes(res.result))

         if (this.data.viewCameraNumberValueArray.includes(res.result)) {
           // console.log(res.result)
           var tempArr = this.data.viewCameraNumberValueArray
           tempArr.splice(tempArr.indexOf(res.result), 1)
           this.setData({
             viewCameraNumberValueArray: tempArr
           })
         }
         wx.showToast({
           title: '录入成功！',
           icon: 'success',
           duration: 2000
         })
       }
     })
   },
   checkChangeViewCameraNumbInput: function() {
     if (this.data.viewChangeCameraNumberValueArray.length > 0) {
       this.setData({
         isChangeViewCoverShow: 'show',
         isChangeFaceCoverShow: 'hide',
         isViewCoverShow: 'hide',
         isFaceCoverShow: 'hide'
       })
     } else {
       wx.showToast({
         title: '没有更换编号',
         icon: 'none',
         duration: 2000
       })
     }
   },
   bindChangeFaceCameraNumbInput: function() {
     wx.scanCode({
       success: (res) => {
         const camera_len = this.data.faceChangeCameraNumberValueArray.length
         if (!this.data.faceChangeCameraNumberValueArray.includes(res.result)) {
           this.data.faceChangeCameraNumberValueArray[camera_len] = res.result
           this.setData({
             faceChangeCameraNumberValueArray: this.data.faceChangeCameraNumberValueArray
           })
         }

         // console.log(this.data.faceCameraNumberValueArray.includes(res.result))

         if (this.data.faceCameraNumberValueArray.includes(res.result)) {
           // console.log(res.result)
           var tempArr = this.data.faceCameraNumberValueArray
           tempArr.splice(tempArr.indexOf(res.result), 1)
           this.setData({
             faceCameraNumberValueArray: tempArr
           })
         }
         wx.showToast({
           title: '录入成功！',
           icon: 'success',
           duration: 2000
         })
       }
     })
   },
   checkChangeFaceCameraNumbInput: function() {
     if (this.data.faceChangeCameraNumberValueArray.length > 0) {
       this.setData({
         isChangeViewCoverShow: 'hide',
         isChangeFaceCoverShow: 'show',
         isViewCoverShow: 'hide',
         isFaceCoverShow: 'hide'
       })
     } else {
       wx.showToast({
         title: '没有更换编号',
         icon: 'none',
         duration: 2000
       })
     }
   },
   changeViewIsCover: function() {
     this.setData({
       isViewCoverShow: 'hide'
     })
   },
   changeFaceIsCover: function() {
     this.setData({
       isFaceCoverShow: 'hide'
     })
   },
   changeChangeViewIsCover: function() {
     this.setData({
       isChangeViewCoverShow: 'hide'
     })
   },
   changeChangeFaceIsCover: function() {
     this.setData({
       isChangeFaceCoverShow: 'hide'
     })
   },
   bindFaceCameraNumbInput: function() {
     wx.scanCode({
       success: (res) => {
         const camera_len = this.data.faceCameraNumberValueArray.length
         if (!this.data.faceCameraNumberValueArray.includes(res.result)) {
           this.data.faceCameraNumberValueArray[camera_len] = res.result
           this.setData({
             faceCameraNumberValueArray: this.data.faceCameraNumberValueArray,
           })
         }
         wx.showToast({
           title: '录入成功！',
           icon: 'success',
           duration: 2000
         })
       }
     })
   },
   checkFaceCameraNumbInput: function() {
     if (this.data.faceCameraNumberValueArray.length > 0) {
       this.setData({
         isFaceCoverShow: 'show',
         isViewCoverShow: 'hide'
       })
     } else {
       wx.showToast({
         title: '没有录入编号',
         icon: 'none',
         duration: 2000
       })
     }
   },
   bindDescInput: function(e) {
     this.setData({
       descValue: e.detail.value
     })
   },
   bindTestEffectInput: function(e) {
     this.setData({
       testEffectValue: e.detail.value
     })
   },
   bindViewChangeWhy: function(e) {
     this.setData({
       viewChangeWhy: e.detail.value
     })
   },
   bindFaceChangeWhy: function(e) {
     this.setData({
       faceChangeWhy: e.detail.value
     })
   },
   tapSubmit: function() {
     var _this = this
     if (_this.data.camerasNumArray[_this.data.viewCamerasIndex] != _this.data.viewCameraNumberValueArray.length) {
       wx.showToast({
         title: '全景摄像头个数与录入编号个数不匹配，请确认！',
         icon: 'none',
         duration: 2500
       })
     } else {
       _this.data.check1 = true
     }

     if (_this.data.camerasNumArray[_this.data.faceCamerasIndex] != _this.data.faceCameraNumberValueArray.length) {
       wx.showToast({
         title: '人脸摄像头个数与录入编号个数不匹配，请确认！',
         icon: 'none',
         duration: 2500
       })
     } else {
       _this.data.check2 = true
     }

     if (_this.data.viewImagesArray.length < _this.data.camerasNumArray[_this.data.viewCamerasIndex]) {
       wx.showToast({
         title: '全景摄像头安装图片小于摄像头个数，请确认！',
         icon: 'none',
         duration: 2000
       })
     } else {
       _this.data.check3 = true
     }

     if (_this.data.faceImagesArray.length < _this.data.camerasNumArray[_this.data.faceCamerasIndex]) {
       wx.showToast({
         title: '人脸摄像头安装图片小于摄像头个数，请确认！',
         icon: 'none',
         duration: 2000
       })
     } else {
       _this.data.check4 = true
     }

     if (_this.data.date == '') {
       wx.showToast({
         title: '请选择安装日期！',
         icon: 'none',
         duration: 2000
       })
     } else {
       _this.data.check5 = true
     }

     if (_this.data.check1 == true && _this.data.check2 == true && _this.data.check3 == true && _this.data.check4 == true && _this.data.check5 == true) {
       wx.request({
         url: app.globalData.global_url + '/device/install/info/add/',
         method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         data: {
           openId: app.globalData.openid,
           shopId: _this.data.shopId,
           viewNum: _this.data.camerasNumArray[_this.data.viewCamerasIndex],
           viewUids: _this.data.viewCameraNumberValueArray,
           faceNum: _this.data.camerasNumArray[_this.data.faceCamerasIndex],
           faceUids: _this.data.faceCameraNumberValueArray,
           date: _this.data.date,
           shopRemark: _this.data.descValue,
           testRemark: _this.data.testEffectValue,
           viewImgUrls: _this.data.viewImgUrls,
           faceImgUrls: _this.data.faceImgUrls,
           historyViewUids: _this.data.viewChangeCameraNumberValueArray,
           viewReplaceRemark: _this.data.viewChangeWhy,
           historyFaceUids: _this.data.faceChangeCameraNumberValueArray,
           faceReplaceRemark: _this.data.faceChangeWhy
         },
         success: function(res) {
           // console.log("user_bind http success" + JSON.stringify(res, null, 4));
           if (res.data.resultCode == 'SUCCESS') {
             wx.showToast({
               title: '提交成功',
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
         complete: function() {
           _this.data.check1 = false
           _this.data.check2 = false
           _this.data.check3 = false
           _this.data.check4 = false
           _this.data.check5 = false
         }
       })
     }
   }
 })