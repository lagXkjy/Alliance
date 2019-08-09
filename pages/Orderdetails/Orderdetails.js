// pages/Orderdetails/Orderdetails.js

const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CoId:"",
    listData:{}
  },  
  GetUserAtyOrderInfo() {
    $common.loading()
    $common.request($api.GetUserAtyOrderInfo, {
      CoId: this.data.CoId,
    }).then(res => {
      $common.hide()
      if (res.data.res) { 
        let listData=this.data.listData
        listData = res.data.OrderInfo
        let data = $common.timeStamp(listData.CoCreateTime)
        console.log(data)
        listData.CoCreateTimes = `${data.showTime} ${data.h}:${data.m}`
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
  onLoad: function (options) {
    this.data.CoId = options.CoId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetUserAtyOrderInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})