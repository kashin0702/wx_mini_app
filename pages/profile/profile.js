// pages/profile/profile.js
Page({
  data: {
    userInfo: {},  //用户信息
    collectNums: '' //收藏商品的数量
  },
  getUserInfo(e) {
    let {userInfo} = e.detail  //解构赋值，把detail对象内的userInfo 赋值给同名对象
    console.log(userInfo);
    this.setData({
      userInfo   //存入本地data
    })
    wx.setStorageSync('userInfo', this.data.userInfo)  //存入缓存
  },
  //获取收藏商品数量
  getCollect() {
    let favGoods = wx.getStorageSync('favGoods') || []
    this.setData({ collectNums: favGoods.length })  //收藏商品数量=缓存数组长度
  },
  onShow: function () {
    let user = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: user   //每次打开页面时从缓存获取userInfo
    })

    this.getCollect()  //执行方法 获取收藏商品数量
  },

})