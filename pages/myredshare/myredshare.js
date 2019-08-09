const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityImg: $api.ActivityImg,//图片拼接地址
    listData: [],
    page: 1,
    pagesize: 10,
    TotalAmount:"",
  },
  details(e) {
    wx.navigateTo({
      url: `/pages/Orderdetails/Orderdetails`,
    })
  },
  GetUserRedEnvelopeList() {
    $common.loading()
    $common.request($api.GetUserRedEnvelopeList, {
      page: this.data.page,
      pagesize: this.data.pagesize,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let data = res.data;
        let listData = this.data.listData;
        let TotalAmount = data.TotalAmount
        listData = listData.concat(data.RedEnvelopList);
        listData.forEach(res => {
          let data = $common.timeStamp(res.RerCoCreateTime).showTime
          res.RerCoCreateTimes = data
        })
        this.setData({
          listData,
          TotalAmount
        });
        // : $common.unique(listData, 'CaId')
        this.data.page++;
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.data.page = 1;
    this.data.listData = []
    this.GetUserRedEnvelopeList()
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
    this.data.page = 1
    this.data.listData = []
    this.GetUserRedEnvelopeList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.GetUserRedEnvelopeList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})