// pages/Confirmation/Confirmation.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityImg: $api.ActivityImg, //图片拼接地址
    name: "", //姓名
    phone: "", //手机号
    CaId: '',
    listData: {},
    shareOpenid: "",
  },
  nameinput(e) { //姓名
    this.setData({
      name: e.detail.value
    })
  },
  phoneinput(e) { //手机号
    this.setData({
      phone: e.detail.value
    })
  },
  GetConfigOrder() { //获取订单信息
    $common.loading()
    $common.request($api.GetConfigOrder, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let listData = this.data.listData = res.data
        this.setData({
          listData
        })
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  submit() {
    if (this.data.name == '') return $common.showToast("请输入姓名")
    if (!$api.phoneReg.test(this.data.phone) || this.data.phone == "") return $common.showToast('请输入正确手机号')
    $common.loading()
    // CaId  课程ID     openid        UserName【姓名】   UserPhone【手机号码】     ShareUserId【分享人UserId，没有可以传   0
    let { CaId,}=this.data
    $common.request($api.PlaceAnOrder, {
      CaId: +this.data.CaId,
      openid: wx.getStorageSync("openid"),
      UserName: this.data.name,
      UserPhone: +this.data.phone,
      shareOpenid: this.data.shareOpenid
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let data = res.data;
        wx.setStorageSync("name", this.data.name)
        wx.setStorageSync("phone", this.data.phone)
        wx.requestPayment({
          'timeStamp': res.data.paras.timeStamp,
          'nonceStr': res.data.paras.nonceStr,
          'package': res.data.paras.package,
          'signType': 'MD5',
          'paySign': res.data.paras.paySign,
          'success': function(res) {
            console.log('success');
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
            wx.redirectTo({
              url: `/pages/Successful/Successful?CaId=${CaId}`,
            })
          },
          'fail': function(fail) {
            $common.request($api.CanCelPay, {
              CoId: res.data.CoId,
              userId: res.data.userId,
            }).then(res => {
              $common.hide()
              if (res.data.res) {
                
              } else {
                $common.showToast("请求失败")
              }
              }, "POST")
          },
          'complete': function(res) {
            console.log('complete');
          }
        });
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let name = wx.getStorageSync("name")
    let phone = wx.getStorageSync("phone")
    let CaId = options.CaId
    this.setData({
      phone: phone != '' ? phone : "",
      name: name != '' ? name : "",
      CaId,
      shareOpenid: options.shareOpenid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.GetConfigOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})