const phoneReg = /^(1[3456789]|9[28])\d{9}$/ // 正则手机号码
const http =`qklm.1-zhao.fun`
const host = `https://${http}`
const ActivityImg = `${host}/MultimediaFiles/ActivityImg/`//首页拼接图片地址
const UserShareQr = `${host}/MultimediaFiles/UserShareQr/`//二维码拼接地址
const BannerImg = `${host}/MultimediaFiles/BannerImg/`//联系一朝页面banner
module.exports = {
  phoneReg,
  ActivityImg,
  UserShareQr,
  BannerImg,
  //获取openid
  GetSaveUserOpenId: `${host}/ltp/UserInfo/GetSaveUserOpenId`,
  //更新用户昵称与头像
  UpdateAvaUrlNick: `${host}/ltp/UserInfo/UpdateAvaUrlNick`,
  //抢课  获取课程列表
  GetCourseAtyList: `${host}/ltp/CourseAtyInfo/GetCourseAtyList`,
  // 获取课程活动详情
  GetCourseAtyInfo: `${host}/ltp/CourseAtyInfo/GetCourseAtyInfo`,
  //获取某个活动课程的 购买记录
  GetCourseAtyOrder: `${host}/ltp/CourseAtyOrder/GetCourseAtyOrder`,
  // 获取分享课程二维码 openid    CaId【课程ID
  GetCourseAtyQrCode: `${host}/ltp/CourseAtyInfo/GetCourseAtyQrCode`,
  // 确认订单信息 CaId  课程ID     openid
  GetConfigOrder: `${host}/ltp/CourseAtyOrder/GetConfigOrder`,
  // 取消支付 CaId  课程ID     openid
  CanCelPay: `${host}/ltp/CourseAtyOrder/CanCelPay`,
  // 提交订单信息 CaId  课程ID     openid        UserName【姓名】   UserPhone【手机号码】     ShareUserId【分享人UserId，没有可以传   0】
  PlaceAnOrder: `${host}/ltp/CourseAtyOrder/PlaceAnOrder`,
  // 添加分享记录    CaId  活动ID   openid
  PostUserShareAtyCourse: `${host}/ltp/CourseAtyInfo/PostUserShareAtyCourse`,
  // 获取用户的订单列表 openid      page        pagesize
  GetUserAtyCourseOrder: `${host}/ltp/CourseAtyOrder/GetUserAtyCourseOrder`,
  //  获取订单详情  参数：CoId   订单ID
  GetUserAtyOrderInfo: `${host}/ltp/CourseAtyOrder/GetUserAtyOrderInfo`,
  //  获取分享的红包记录 openid            page          pagesize RedEnvelopList  { ..... RerRedEnvelopesState【1：已到账   除了1以外的都是未到账】 }
  GetUserRedEnvelopeList: `${host}/ltp/RedEnvelop/GetUserRedEnvelopeList`,
  // 联系一朝   返回参数：SiYiZhaoBanner：Banner图片        SiYiZhaoAddress：一朝地址         SiYiZhaoPhone：一朝联系电话
  YiZhaoInfo: `${host}/ltp/RedEnvelop/YiZhaoInfo`,
  //  获取用户提交的机构详情  参数：openid
  GetMechanismInfo: `${host}/ltp/Mechanism/GetMechanismInfo`,
  // 添加 //修改 机构信息
  PostMechanismInfo: `${host}/ltp/Mechanism/PostMechanismInfo`,
  //获取用户限制状态 openid    回传参数：UserLimitState    0：正常       1：限制
  GetUserLimitState: `${host}/ltp/UserInfo/GetUserLimitState`,
}
