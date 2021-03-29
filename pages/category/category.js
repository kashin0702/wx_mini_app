// pages/category/category.js
import { getCategory } from '../../network/getCategory';
Page({
  data: {
    // 分类-左侧频道数据
    titleList: []
  },
  //和data同层级的Cates，用于保存不和页面交互的临时数据
  Cates: [],

  onLoad: function (options) {
    //获取缓存
    const cates = wx.getStorageSync('cates')
    if (!cates) { //判断1.缓存不存在，重新请求数据
      getCategory().then(res => {
        // console.log(res.data.message);
        this.setData({
          titleList: res.data.message
        })
        // 把数据保存到缓存中，value中要保存时间戳和数据本身 2个属性值
        wx.setStorageSync('cates', { time: Date.now(), data: res.data.message })
      })
      //判断2.缓存时间戳大于设定的时间间隔60秒，也重新请求
    } else if (Date.now() - cates.time > 1000 * 60) {
      getCategory().then(res => {
        // console.log(res.data.message);
        this.setData({
          titleList: res.data.message
        })
        wx.setStorageSync('cates', { time: Date.now(), data: res.data.message })
      })
    } else {  //判断3.可以使用缓存数据
      console.log(cates.data);
      this.Cates = cates.data  //把缓存数据赋值给Cates
      this.setData({
        titleList: this.Cates
      })
    }

  }

})