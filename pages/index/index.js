const app = getApp()
import {getSwiper} from '../../network/getSwiper'
import {getRecommend} from '../../network/getRecommend'
import { getFloorData } from '../../network/getFloorData'
Page({
  data: {
    list: [],
    recommends: [],
    floorList: []
  },
  onLoad() {
    getSwiper().then(res => { //获取轮播图数据
      this.setData({
        list: res.data.message
      })
    }),
    getRecommend().then(res => {//获取推荐分类数据
      // console.log(res);
      this.setData({
        recommends: res.data.message
      })
    }),
    getFloorData().then(res => { //获取推荐楼层数据
      console.log(res.data.message);
      this.setData({
        floorList: res.data.message
      })
    })
  }
  
  
})
