// pages/goodsList/goodsList.js
import {request} from '../../network/request';
Page({
  data: {
    goods: []
  },
  queryParams: {  //data同级定义一个参数对象
    //这3个都是后台定义好的接口参数，
    cid: null,  //商品分类id 通过options获取
    pagenum: 1, //显示第几页
    pagesize: 10 //商品每页显示几条
  },
  total: null, //全局变量： 总数据条数
  
  //在当前页定义获取数据方法，因为需要传参所以不用外部导入方法
  getGoodsList() {
    return request({
      url: '/goods/search',
      data: this.queryParams //url后缀参数，通过定义好的queryParam变量获取
    })
  },
  tabChange(e) {
    console.log(e);
  },
  onLoad: function (options) {
    console.log(options); //options包含navigator url携带的参数
    this.queryParams.cid = options.cid //把cid传给queryParams
    //请求数据
    this.getGoodsList().then(res => {
      console.log(res);
      this.total = res.data.message.total //保存总数据条数
      this.setData({
        goods: res.data.message.goods
      })
      // console.log(this.data.goods);
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      goods: []   //1.重置页面数据
    })
    this.queryParams.pagenum = 1 //2.重置页码
    this.getGoodsList().then(res => { //3.重新发送请求
      this.total = res.data.message.total //保存总数据条数
      this.setData({
        goods: res.data.message.goods
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const totalPages = Math.ceil( this.total / this.queryParams.pagesize )
    if(this.queryParams.pagenum >= totalPages){ //当前页码>=总页码 即提示没有下一页
      wx.showToast({ //官方弹窗api
        title: '没有下一页了',
        icon: 'none'
      })
    }else{   //获取下一页数据，并对数据进行拼接
      this.queryParams.pagenum += 1
      const oldPage = this.data.goods
      this.getGoodsList().then(res => {
        this.setData({
          goods: [...oldPage, ...res.data.message.goods] //解构语法，把新数组拼接到原数组中
        })        
      })
    }
  }
})