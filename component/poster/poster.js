Component({
  properties: {
    posterData: {
      type: Object,
      value: null,
      observer(e) {
       
      }
    },
    isShow:{
      type: Boolean,
    }
  },
  data:{
    isShow:false,
    contentW: 0, //canvas的尺寸
    contentH: 0,
    image:"/images/poster.png",
    QRcode:"/images/banner2.jpg"
  },
  ready: function (e) {
    this.getCanvasSize()
    
  },
  methods:{
    startDraw(){
      // 使用 wx.createContext 获取绘图上下文 context
      let data = this.data
      let context = wx.createCanvasContext('posterCanvas', this)
      context.drawImage(data.image, 0, 0, data.contentW, data.contentH); //画背景
      context.save(); //先保存状态，以便画完再用
      context.drawImage(data.QRcode, 106, 360, 87, 87); //画二维码
      context.save(); //先保存状态，以便画完再用
      context.draw()
    },
    getCanvasSize() { //获取canvas宽高
      var query = wx.createSelectorQuery()
      // query.select('.canvas').boundingClientRect((res) => {
      //   console.log(res)
      //   // 返回值包括画布的实际宽高
      //   // this.drawImage(res)
      // }).exec()
      wx.createSelectorQuery().in(this).select('.canvas').boundingClientRect((res) => {
        console.log(res)
        this.data.contentW = res.width;
        this.data.contentH = res.height;
        this.startDraw();
      }).exec();
    },
    close() { //点击消失
      this.setData({
        isShow: false
      })
    },
    saveImage: function (e) {
      console.log(e)
      wx.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        success: function (res) {
          console.log(e)
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
  }
})
