// components/category-first/category-first.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleList: {
      type: Array
    }
  },
  data: {
    currentIndex: 0,
    goodsList: [],
    scrollTop: null
  },
  
  observers: {
    // 监听'titleList'的改变，当titleList被传入时，把值传给goodsList
    'titleList': function(newVal){
      // console.log(newVal);
      setTimeout(() => {
        this.setData({
          //把titleList第一条数据传给goodsLits作为默认展示数据
          goodsList: this.data.titleList[0].children
        })
      },1000)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    titleClick(e){
      // console.log(e);
      const idx = e.currentTarget.dataset.index
      this.setData({
        currentIndex: idx,
        //根据点击的idx值，获取对应频道的数据
        goodsList: this.data.titleList[idx].children,
        //每次点击时让右侧scroll回到顶部
        scrollTop: 0
      })
     
    }
  }
})
