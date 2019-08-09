// pages/Buyimmediately/Buyimmediately.js
const WxParse = require('../../wxParse/wxParse.js');
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserShareQr: $api.UserShareQr,//二维码拼接地址
    ActivityImg: $api.ActivityImg, //图片拼接地址
    page: 1, //页数
    pagesize: 10, //一页几条
    CaId: "",
    timer: "", //时间计时器
    timeLeft: "", //时间
    isShow: false,
    contentW: 0, //canvas的尺寸
    contentH: 0,
    title: '', //标题
    imgUrls: [], //轮播图
    listData: [], //页面详情
    GetCourseAtyOrder: [], //购买记录
    totalCount: '', //购买记录条数
    ShareQrCode:'',//二维码
    shareOpenid:"",//分享人id
    userInfo:"",
  },
  GetCourseAtyInfo() { //本页数据
    $common.loading()
    $common.request($api.GetCourseAtyInfo, {
      CaId: this.data.CaId,
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let listData = res.data.AtyInfo
        listData.EndDate = $common.timeStamp(listData.CaActivityEndDate).showTime
        let imgUrls = listData.CaMainImage.slice(0, listData.CaMainImage.length - 1).split("|");
        WxParse.wxParse('CaActivityIntroduction', 'html', listData.CaBuyInstructions, this, 0);
        WxParse.wxParse('CaBuyInstructions', 'html', listData.CaBuyInstructions, this, 0);
        this.setData({
          listData,
          imgUrls
        });
        // : $common.unique(listData, 'CaId')
        this.data.page++;
      } else {
        $common.showToast("请求失败")
      }
    }).then(res=>{
        this.Countdown()
        this.GetCourseAtyQrCode()
      wx.setNavigationBarTitle({
        title: this.data.listData.CaActivityBriefIntroduction,
      })
    })
  },
  GetCourseAtyOrder() { //购买记录
    $common.loading()
    $common.request($api.GetCourseAtyOrder, {
      CaId: this.data.CaId,
      page: this.data.page,
      pagesize: this.data.pagesize
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let data = res.data;
        let GetCourseAtyOrder = this.data.GetCourseAtyOrder;
        GetCourseAtyOrder = GetCourseAtyOrder.concat(data.AtyOrderList);
        let totalCount = data.totalCount
        GetCourseAtyOrder.forEach(res => {
          const str = res.CoBuyerName;//名字星号问题
          let outPutStr = "";
          for (let i = 0; i < str.length; i++) {
            if (i === 0) {
              outPutStr += str.slice(i, i + 1);
            } else {
              outPutStr += "*";
            }
          }
          res.BuyerName = outPutStr
          res.BuyerPhone = res.CoBuyerPhone.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2');
        })
        this.setData({
          totalCount,
          GetCourseAtyOrder
        });
        this.data.page++;
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  Countdown() { //时间倒计时
    let that = this
    let time = $common.timeStamp(that.data.listData.CaActivityEndDate)
    let times = `${time.y}/${time.m}/${time.d} ${time.h}:${time.mi}:${time.s}`
    that.data.timer = setInterval(() => { //注意箭头函数！！
      let getTimeLeft = $common.getTimeLeft(times)
      that.setData({
        timeLeft: $common.getTimeLeft(times) //使用了util.getTimeLeft
      });
      if (getTimeLeft.hours == 0 && getTimeLeft.minutes == 0 && getTimeLeft.seconds == 0) {
        clearInterval(that.data.timer)
      }
    }, 1000);
  },
  poster() { //生成海报
    this.setData({
      isShow: true
    })
  },
  getUserInfo(res) {//获取用户信息
    let userInfo = res.detail.userInfo;
    if (!userInfo) return;
    $common.getUserInfo(userInfo, this.userInfo());
  },
  purchase(e) { //立即抢购
  let that=this
    let CaId = e.currentTarget.dataset.caid
    wx.navigateTo({
      url: `/pages/Confirmation/Confirmation?CaId=${CaId}&shareOpenid=${that.data.shareOpenid}`,
    })
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
    this.data.CaId = options.CaId
    this.data.shareOpenid = options.shareOpenid == undefined ? "" : options.shareOpenid
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
    this.data.page=1
    $common.getOpenId().then(res => {
      this.GetCourseAtyInfo()
      this.GetCourseAtyOrder()
    })
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
    clearInterval(this.data.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.GetCourseAtyInfo()
    this.GetCourseAtyOrder()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.GetCourseAtyOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    $common.loading()
    $common.request($api.PostUserShareAtyCourse, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
      } else {
        $common.showToast("请求失败")
      }
    })
      return {
        title: this.data.listData.CaActivityBriefIntroduction,
        path: `/pages/Buyimmediately/Buyimmediately?CaId=${this.data.CaId}&shareOpenid=${wx.getStorageSync("openid")}&CaActivityBriefIntroduction=${this.data.listData.CaActivityBriefIntroduction}`,
        // imageUrl: 'https://......./img/groupshare.png',  //用户分享出去的自定义图片大小为5:4,
        success: function (res) {
          console.log("chengg")
          // 转发成功
          wx.showToast({
            title: "分享成功",
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          // 分享失败
        },
      }
    
  },

  GetCourseAtyQrCode() {//获取二维码
    $common.loading()
    $common.request($api.GetCourseAtyQrCode, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        this.setData({
          ShareQrCode: res.data.ShareQrCode
        })
        this.startDraw()
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  startDraw() {
    // 使用 wx.createContext 获取绘图上下文 context
    let data = this.data

    // width: 600rpx;
    // height: 1065rpx;
    let context = wx.createCanvasContext('posterCanvas', this)
    context.drawImage(data.ActivityImg + data.listData.CaPosterImage, 0, 0, 300, 532.5); //画背景
    context.save(); //先保存状态，以便画完再用
    context.drawImage(data.UserShareQr+data.ShareQrCode, 106, 360, 87, 87); //画二维码
    context.save(); //先保存状态，以便画完再用
    context.draw()
  },
  // getCanvasSize() { //获取canvas宽高

  //   // const query = wx.createSelectorQuery()
  //   // // query.select('.canvas').boundingClientRect()
  //   // query.selectViewport().scrollOffset()
  //   // query.exec(function (res) {
  //   //   console.log(res)
  //   //   res[0].top       // #the-id节点的上边界坐标
  //   //   res[1].scrollTop // 显示区域的竖直滚动位置
  //   //   console.log('打印demo的元素的信息', res);
  //   //   console.log('打印高度', res[0].height);
  //   // })
  //   var query = wx.createSelectorQuery()
  //   wx.createSelectorQuery().select('.canvas').boundingClientRect((res) => {
  //     console.log(res)
  //     this.data.contentW = res.width;
  //     this.data.contentH = res.height;
  //     this.startDraw();
  //   }).exec();
  // },
  close() { //点击消失
    this.setData({
      isShow: false
    })
  },
  saveImage: function(e) {
    wx.canvasToTempFilePath({
      canvasId: 'posterCanvas',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
})