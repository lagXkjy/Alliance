const $api = require('api.js');
module.exports = {
  //请求数据
  request(url, data, method = 'POST') { //请求
    return new Promise((resolve, reject) => wx.request({
      url,
      data,
      method,
      header: {
        'content-type': 'application/json'
      },
      success: resolve,
      fail: reject
    }))
  },
  chooseImage(count) { //选择相片
    return new Promise((resolve, reject) => wx.chooseImage({
      count,
      success: resolve,
      fail: reject
    }))
  },
  chooseVideo(count) { //选择相片
    return new Promise((resolve, reject) => wx.chooseVideo({
      maxDuration: 60,
      success: resolve,
      fail: reject
    }))
  },
  uploadImage(filePath) { //上传图片
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: $api.UpLoadImg,
        filePath,
        name: 'postFile',
        success: resolve,
        fail: reject
      })
    })
  },
  uploadVideo(filePath) { //上传视频
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: $api.UploadVideo,
        filePath,
        name: 'postFile',
        success: resolve,
        fail: reject
      })
    })
  },
  deleteImage(img) { //删除图片
    return this.request('', {
      img
    })
  },
   showToast(title = '提示内容', icon = 'none', duration = 1500, mask = false) {
    return new Promise((resolve, reject) => wx.showToast({
      title,
      icon,
      mask,
      duration
    }))
  },
  loading(title = '请求中...', mask = true) {
    wx.showLoading({
      title,
      mask
    })
  },
  hide() {
    wx.hideLoading()
  },
  unique(arr, id) { //数组去重
    let hash = {}
    return arr.reduce((item, target) => {
      hash[target[id]] ? '' : hash[target[id]] = true && item.push(target)
      return item
    }, [])
  },
  timeStamp(str) { //时间戳转换为时间
    let timeStamp = ('' + str).replace(/\D/g, '')
    let date = new Date(+timeStamp),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      mi = date.getMinutes(),
      s = date.getSeconds(),
      w = date.getDay()
    m < 10 && (m = '0' + m)
    d < 10 && (d = '0' + d)
    h < 10 && (h = '0' + h)
    mi < 10 && (mi = '0' + mi)
    s < 10 && (s = '0' + s)
    return {
      y,
      m,
      d,
      h,
      mi,
      s,
      w,
      // showTime: `${y}-${m}-${d} ${h}:${mi}`,
      showTime: `${y}-${m}-${d}`
    }
  },
  //取倒计时（天时分秒）
  getTimeLeft(datetimeTo) {
    // 计算目标与现在时间差（毫秒）
    let time1 = new Date(datetimeTo).getTime();
    let time2 = new Date().getTime();
    let mss = time1 - time2;
    // 将时间差（毫秒）格式为：天时分秒
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    // let minutes = parseInt((mss / (60 * 1000)));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);

    // return  hours + ":" + minutes + ":" + seconds
    let obj = { days,hours, minutes, seconds, time: minutes + ":" + seconds }
    return obj
  },
  trim(data) { //判断字符串是否为空
    return (str) => data[str].trim().length > 0
  },
  login() {
    return new Promise((resolve, reject) => wx.login({
      success: resolve,
      fail: reject
    }))
  },
  getOpenId() { //获取openId
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('openid')) return resolve()
      this.login()
        .then(res => this.request($api.GetSaveUserOpenId, {
          code: res.code
        }))
        .then(res => {
          if (res.data.res) {
            wx.setStorageSync('openid', res.data.openid)
            if (res.data.UserLimitState==1){
              wx.reLaunch({
                url:`/pages/limit/limit`
              })
            }
            resolve()
          }
        })
    })
  },
  //获取并更新用户头像等信息
  getUserInfo(userInfo, callback = () => { }) {
    wx.setStorageSync('userInfo', userInfo);
    wx.request({
      url: $api.UpdateAvaUrlNick,
      data: {
        openId: wx.getStorageSync('openid'),
        avaUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: (res) => {
        if (res.data.res) {
          // wx.setStorageSync('prevGetInfo', new Date().getTime()) //记录本次获取头像等信息的时间戳
          callback()
        }
      }
    });
  },
}