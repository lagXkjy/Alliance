// pages/mytab/mytab.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      url: '/images/orderimg.png',
      title: "我的订单",
      to: '/pages/myorder/myorder'
    }, {
      url: '/images/redimg.png',
      title: "我的红包分享",
      to: '/pages/myredshare/myredshare'
    }, {
      url: '/images/phoneimg.png',
      title: "联系一朝",
      to: '/pages/contact/contact'
    }],
    userInfo:'',
  },
  jump(e) { // 跳转
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },
  getUserInfo(res){
      let userInfo = res.detail.userInfo;
      if (!userInfo) return;
    $common.getUserInfo(userInfo, this.functions());
    this.userInfo()
  },
  functions(){
   
  },
  userInfo(){
    let userInfo = wx.getStorageSync("userInfo")
    this.setData({
      userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userInfo()
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

  }
})