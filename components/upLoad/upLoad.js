// components/upLoad/upLoad.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upLoadList: {  //接收父组件传过来的图片列表
      type: Array
    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeImg(e) {
      console.log(e);
      let idx = e.currentTarget.dataset.idx
      this.triggerEvent('removeImg',{idx})
    }
  }
})
