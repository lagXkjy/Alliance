// pages/Successful/Successful.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CaId: "",
  },
  seeorder() {
    wx.redirectTo({
      url: '/pages/myorder/myorder',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.CaId = options.CaId
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
    $common.loading()
    $common.request($api.PostUserShareAtyCourse, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {} else {
        $common.showToast("请求失败")
      }
    })
    return {
      title: '转发',
      path: `/pages/Buyimmediately/Buyimmediately?CaId=${this.data.CaId}&shareOpenid=${wx.getStorageSync("openid")}`,
      // imageUrl: 'https://......./img/groupshare.png',  //用户分享出去的自定义图片大小为5:4,
      success: function(res) {
        console.log("chengg")
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 分享失败
      },
    }
  }
})