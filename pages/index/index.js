// pages/mytab/mytab.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityImg: $api.ActivityImg,//图片拼接地址
    page:1,//页数
    pagesize:10,//一页几条
    listData:[],
    blank:false,
  },
  Buyimmediately(e){//跳转页面
    let index=e.currentTarget.dataset.index
    let data=this.data.listData
    wx.navigateTo({
      url: `../Buyimmediately/Buyimmediately?CaId=${data[index].CaId}`,
    })
  },
  getData(){//本页数据
    $common.loading()
    $common.request($api.GetCourseAtyList, {
      page:this.data.page,
       pagesize:this.data.pagesize
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let data = res.data;
        let listData = this.data.listData;
        listData = listData.concat(data.DataList);
        listData.forEach(res=>{
          let data = $common.timeStamp(res.CaActivityEndDate)
          res.times = `${data.showTime} ${data.h}:${data.mi}:${data.s}`
        })
        this.setData({
          listData,
          blank:true,
        });
        // : $common.unique(listData, 'CaId')
        this.data.page++;
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  GetUserLimitState(){//是否限制
    $common.request($api.GetUserLimitState, {
      openid:wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        if (res.data.UserLimitState==1){
          wx.reLaunch({
            url: `/pages/limit/limit`
          })
        }
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $common.getOpenId()
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
    this.data.page = 1
    this.data.listData = []
    $common.getOpenId().then(res => {
      this.GetUserLimitState()
      this.getData()
    })
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
    this.getData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})