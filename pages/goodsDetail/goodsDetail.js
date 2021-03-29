// pages/goodsDetail/goodsDetail.js
import { request } from '../../network/request';
Page({
  data: {
    swiperImg: [],
    goodsPrice: '',
    goodsName: '',
    goodsContent: '',
    goodsFav: ''  //商品收藏状态
  },
  goodsInfo: {  //创建一个全局非渲染层对象，主要用于传递给购物车
    goodsId: null,  //商品id  用于网络请求时获取商品详情
    goods_price: '',  //添加购物车传参
    goods_name: '',   //添加购物车传参
    goodsNum: null,  //商品数量 添加购物车用
    goods_img: null,  //商品缩略图
    goods_checked: true //是否选中 默认为选中
  },

  //点击轮播图预览图片
  swiperClick(e) {
    console.log(e);
    const urls = this.data.swiperImg.map(function (val) { //创建图片数组
      return val.pics_big
    })
    const current = e.currentTarget.dataset.url //创建点击的图片路径
    console.log(current);
    wx.previewImage({  //预览图片API
      urls: urls,      //参数1：传入要预览的图片数组
      current: current //参数2：传入当前要显示的是哪张图,通过data- 把参数传过来
    })
  },

  // 请求商品详情方法
  getDetail() {
    request({
      url: '/goods/detail',
      data: this.goodsInfo.goodsId  //传参商品id,需为对象格式{goods_id: xxxx}
    }).then(res => {
      console.log(res);
      //goodsInfo：传递给购物车的数据
      this.goodsInfo.goods_name = res.data.message.goods_name
      this.goodsInfo.goods_price = res.data.message.goods_price
      this.goodsInfo.goods_img = res.data.message.pics[0]  //把轮播图第1张设为购物车缩略图
      //渲染层数据
      this.setData({
        swiperImg: res.data.message.pics, //获取轮播图数据
        goodsPrice: res.data.message.goods_price, //获取商品价格
        goodsName: res.data.message.goods_name, //获取商品名称
        goodsContent: res.data.message.goods_introduce //商品详情 **富文本数据**
      })
    })
  },
  /**
   *  购物车思路：
   * 1.通过goodsId判断购物车中是否有该商品,若有，对应的商品goodsNum+1
   * 2.若没有该商品，goodsNum=1, goods对象push到cart数组
   * 3.更新购物车数据到缓存中
   * 4.弹窗给出对应的提示
   */
  addCart() {
    let cart = wx.getStorageSync('cart') || [] //获取缓存中购物车数据,若没有则设置为空数组
    let index = cart.findIndex(val => { //findIndex返回符合条件的第1条数据的索引
      // goodsId={goods_id: 'xxxx'} 里面还有一层，要获取到最里层
      return val.goodsId.goods_id === this.goodsInfo.goodsId.goods_id  //判断数组中的goods_id和用户点击的goodsId是否一样
    })
    if (index === -1) { //-1表示数组内没有符合条件的，即没有该商品
      this.goodsInfo.goodsNum = 1;  //设置商品数量为1
      cart.push(this.goodsInfo)  //添加一条商品数据到购物车数组中
    } else {
      cart[index].goodsNum++; //有相同商品，对应索引的商品数量+1
    }
    wx.setStorageSync('cart', cart)  //每次执行完上面步骤都要重新设置缓存
    wx.showToast({
      title: '添加购物车成功',
      mask: true
    })
  },
  /**商品收藏，思路
   * 1.每次页面onShow时，获取缓存判断商品是否已收藏，显示对应样式
   * 2.点击图标时，把收藏的数据添加到缓存数组中，已收藏商品数量+1，取消收藏时商品数量-1
   * 并且对缓存数组做更新 要存的数据：图片，名字，价格 */
  itemFav() {
    const favGoods = {      //创建一个收藏对象，包括id,图片，名字，价格 存入缓存并传给收藏页面使用
      favImg: this.goodsInfo.goods_img,
      favName: this.goodsInfo.goods_name,
      favPrice: this.goodsInfo.goods_price,
      favId: this.goodsInfo.goodsId.goods_id,
      favStatus: this.data.goodsFav
    }
    let fav = wx.getStorageSync('favGoods') || [] //先从缓存获取已收藏商品数组
    let res = fav.some(item => {  //判断数组中是否已存在收藏商品
      return item.favId === this.goodsInfo.goodsId.goods_id
    })
    if (!this.data.goodsFav) {
      wx.showToast({
        title: '收藏成功'
      })
      this.setData({ goodsFav: !this.data.goodsFav }) //更新收藏状态：取反
      favGoods.favStatus = this.data.goodsFav  //更新收藏对象状态
      if(!res) { //缓存中不存在该商品，添加到本地数据和缓存中
        fav.push(favGoods)
        wx.setStorageSync('favGoods', fav)
      }
    } else {
      wx.showToast({
        title: '已取消收藏'
      })
      this.setData({ goodsFav: !this.data.goodsFav })
      let index = fav.findIndex(item => {  //根据goodsId 获取要删除商品的索引值
        return item.favId === this.goodsInfo.goodsId.goods_id 
      })
      fav.splice(index,1)  //删除该项商品
      wx.setStorageSync('favGoods', fav)  //更新缓存
    }
    
    
  },
  onLoad: function (options) {
    console.log(options);
    this.goodsInfo.goodsId = options  //关键语句：获取goodsList页面navigator url中传递过来的goodsId
    this.getDetail()
  },

  onShow: function () {
    //每次onShow时 获取收藏状态，否则该状态会被data初始化
    let fav = wx.getStorageSync('favGoods') || []
    let res = fav.some(item => item.favId === this.goodsInfo.goodsId.goods_id )
    if(!fav || !res){  //缓存为空或数组中无该商品，设置图标为未收藏
      this.setData({
        goodsFav: false
      })
    }else {  //已收藏，设置图标为已收藏
      this.setData({
        goodsFav: true
      })
    }
  }
})