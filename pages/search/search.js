import {request} from '../../network/request'
Page({
  data: {
    goods: []  //搜索结果列表
  },
  timer: -1, //创建一个全局定时器，用于输入框防抖
  handleInput (e) {
    let query = e.detail.value.trim()  //从input事件传过来的detail中获取用户要搜索的值 头尾去空格
      clearTimeout(this.timer)  //每次触发输入框事件时，清空定时器
      this.timer = setTimeout(() => {
        this.getSearchResult(query)  //重新设置定时器，给搜索事件设置防抖
      },1500)
  },
  //定义搜索请求
  getSearchResult(query) {  
    request({
      url: '/goods/qsearch',     //搜索接口
      data: {query} //传入搜索的内容
    }).then(res => {
      console.log(res); //返回一个Goods数组，包含goods_id和goods_name
      this.setData({ goods: res.data.message})  //获取返回数据
    })
  },
  //点击搜索结果跳转到详情页
  searchClick(e){
    console.log(e);
    let goodsId = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goods_id=${goodsId}`,
    })
  },


})