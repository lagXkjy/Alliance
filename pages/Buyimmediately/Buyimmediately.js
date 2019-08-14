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
    shareOpenid:"",//分享人id
    userInfo:"",
    CaPosterImage:"",//海报背景
    ShareQrCode:"",//海报二维码
    imageH:'',//二维码高度
    QuotaIsFull:false,//是否有名额
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
        WxParse.wxParse('CaActivityIntroduction', 'html', listData.CaActivityIntroduction, this, 0);
        WxParse.wxParse('CaBuyInstructions', 'html', listData.CaBuyInstructions, this, 0);
        this.setData({
          listData,
          imgUrls,
          QuotaIsFull:res.data.QuotaIsFull
        });
        // : $common.unique(listData, 'CaId')
      } else {
        $common.showToast("请求失败")
      }
    }).then(res=>{
        this.Countdown()
        this.GetCourseAtyQrCode()
      wx.setNavigationBarTitle({
        title: this.data.listData.CaName,
      })
    })
  },
  GetCourseAtyOrder() { //购买记录
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
    this.getCanvasSize()
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
  userInfo(){//获取用户信息
    let userInfo = wx.getStorageSync("userInfo")
    this.setData({
      userInfo
    })
  },
  GetUserLimitState() {//是否限制
    $common.request($api.GetUserLimitState, {
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        if (res.data.UserLimitState == 1) {
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
    $common.getOpenId().then(res => {
      this.GetUserLimitState()
      this.GetCourseAtyInfo()
      this.data.page=1
      this.data.GetCourseAtyOrder=[]
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
    $common.request($api.PostUserShareAtyCourse, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
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
    // $common.loading()
    $common.request($api.GetCourseAtyQrCode, {
      CaId: this.data.CaId,
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        this.setData({
          ShareQrCode: res.data.ShareQrCode
        })
        // this.startDraw()
        this.download()
      } else {
        $common.showToast("请求失败")
      }
    })
  },
  download() {
    $common.loading()
    let data = this.data
    // console.log(data.ActivityImg + data.listData.CaPosterImage)
    // console.log(data.UserShareQr + data.ShareQrCode)
    wx.downloadFile({ //下载背景图
      url: data.ActivityImg + data.listData.CaPosterImage,
      success: (res) => {
        if (res.statusCode === 200) {
          this.data.CaPosterImage = res.tempFilePath;
          wx.downloadFile({ //下载头像
            url: data.UserShareQr + data.ShareQrCode,
            success: (res) => {
              $common.hide()
              if (res.statusCode === 200) {
                this.data.ShareQrCode = res.tempFilePath;
                this.setData({
                  ActivityImg: data.ActivityImg,
                  ShareQrCode: data.ShareQrCode,
                })
                this.getCanvasSize();
              }
            }
          })
        }
      }
    })
  },
  startDraw() {
    // 使用 wx.createContext 获取绘图上下文 context
    let data = this.data
    let context = wx.createCanvasContext('posterCanvas', this)
    context.drawImage(data.CaPosterImage, 0, 0, data.contentW, data.contentH); //画背景
    context.save(); //先保存状态，以便画完再用
    // let width = (data.contentW - 87) / 2
    // console.log(width)
    // console.log(data.imageH)
    // 106   360
    // 600/174*data.contentW
    let width=174 / 600 * data.contentW
    let leftheight = 722 / 1066 * data.contentH
    let leftwidth = (data.contentW - width) / 2
    context.drawImage(data.ShareQrCode, leftwidth, leftheight, width, width); //画二维码
    context.save(); //先保存状态，以便画完再用
    context.draw()
  },
  getCanvasSize() { //获取canvas宽高
    if (this.data.isShow){
      var query = wx.createSelectorQuery()
      wx.createSelectorQuery().select('.canvas').boundingClientRect((res) => {
        this.data.contentW = res.width;
        this.data.contentH = res.height;
        this.data.imageH = res.height * 0.69; //图片的高度占canvas的71%
        this.startDraw();
      }).exec();
    }
  },
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