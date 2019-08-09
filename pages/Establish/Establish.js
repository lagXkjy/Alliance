// pages/Establish/Establish.js
const $api = require('../../utils/api.js')
const $common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BannerImg: $api.BannerImg,//banner拼接地址
    name:'',
    Contacts:'',
    phonenumber:'',
    address:'',
    focus: {},//获取焦点
    Submitted:false,//是否显示信息已提交或修改
    listData:{},
    SiCreateAlliancesBanner:'',//banner
  },
  formSubmit(e){
    console.log(e)
  },
  toast(str) {
    $common.showToast(`${str}`)
  },
  getFocus(key) { //使其主动获得焦点
    let {
      focus
    } = this.data
    if (!focus[key]) focus[key] = false
    let keys = `focus.${key}`
    this.setData({
      [keys]: true
    })
  },
  Submission(data) { //判断所填信息是否完善
    let t = $common.trim(data)
    console.log(data)
    switch (false) {
      case t('name'):
        return (this.getFocus('name'), this.toast('请完善机构名称'));
        break
      case t('Contacts'):
        return (this.getFocus('Contacts'), this.toast('请完善联系人'));
        break
      case t('phonenumber'):
        return (this.getFocus('phonenumber'), this.toast('请完善手机号'));
        break
      case t('address'):
        return (this.getFocus('address'), this.toast('请完善机构地址'));
        break
      default:
        return true
    }
  },
  formSubmit(e) {
    console.log(e)
    let data = e.detail.value
    let { name, Contacts, phonenumber, address ,listData} = this.data
    if (!this.Submission(data)) return
    if (!$api.phoneReg.test(data.phonenumber)) return this.toast('请输入正确手机号')

    $common.loading()
    // openid      MiId：机构ID    MechName【机构名称】  Contacts【联系人】  ContactNumber【手机号码】   MechAddress【联系地址】
    let openid = wx.getStorageSync('openid')
    $common.request($api.PostMechanismInfo, {
      OpenId: openid,
      MiId: listData.MiId,
      MechName: data.name,
      Contacts: data.Contacts,
      ContactNumber: data.phonenumber,
      MechAddress: data.address
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        $common.showToast("提交成功")
        this.GetMechanismInfo()
      } else {
        $common.showToast("提交失败")
      }
    })
  },
  GetMechanismInfo() {//获取机构信息
    $common.request($api.GetMechanismInfo, {
      openid: wx.getStorageSync("openid")
    }).then(res => {
      $common.hide()
      if (res.data.res) {
        let listData = this.data.listData
        listData = res.data.MechanismInfo
        this.setData({
          listData,
          SiCreateAlliancesBanner: res.data.SiCreateAlliancesBanner
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
    this.GetMechanismInfo()
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