import { request } from '../../network/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getUserInfo(e) {
    console.log(e);
    wx.login({
      timeout: 5000,
      success: (res) => {
        console.log(res);
        const code = res.code //获取微信返回的code
        const { encryptedData, iv, rawData, signature } = e.detail //解构赋值
        const loginParams = { encryptedData, iv, rawData, signature, code }  //所有request请求必传的参数
        //发起request登录请求
        request({
          url: '/users/wxlogin', //登录接口
          data: loginParams,    //传递登录参数值给自己服务器生成token(这些登录参数是自己后台接口定的，无特殊用意)
          method: 'post'   //注意是Post请求
        }).then(res => {
          console.log(res);  //此处返回值内包含了token  该接口需要企业账号，请求已成功但无法获取token
          wx.setStorageSync('token', res.data.token)  //token存入缓存中
          wx.navigateBack({
            delta: 1,  //返回上一页：支付页
          })
        })
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