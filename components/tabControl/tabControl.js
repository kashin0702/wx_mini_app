// components/tabControl/tabControl.js
Component({
  properties: {
    list: {
      type: Array
    },  //父组件传入的tab名
  },
  data: {
    currentIndex: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tabClick(e) {
      // console.log(e);
      this.setData({
        currentIndex: e.currentTarget.dataset.index 
      })
      const index = this.data.currentIndex
      this.triggerEvent('tabChange',{index}) //把index对象传递给父组件
    }
  }
})
