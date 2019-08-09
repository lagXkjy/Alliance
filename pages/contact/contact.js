// pages/contact/contact.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({


  /**
   * 页面的初始数据
   */
  data: {
    BannerImg: $api.BannerImg,//图片拼接地址
    listData:{},
  },

  // 31.1880100000, 121.5974700000
  jump() { // 跳转
  let data=this.data.listData
    wx.navigateTo({
      url: `/pages/Map/Map?SiYiZhaoBanner=${data.SiYiZhaoAddress}&SiYiZhaoLon=${data.SiYiZhaoLon}&SiYiZhaoLat=${data.SiYiZhaoLat}`
    })
  },
  makePhoneCall() { //拨打手机号
    let data = this.data.listData
    wx.makePhoneCall({
      phoneNumber: data.SiYiZhaoPhone
    })
  },
  YiZhaoInfo() {
    $common.loading()
    $common.request($api.YiZhaoInfo, {

    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let listData=this.data.listData
        listData = res.data
        this.setData({
          listData
        })
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.YiZhaoInfo()
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