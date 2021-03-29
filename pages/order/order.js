import { request } from '../../network/request'
Page({
  data: {
    tabs: [
      { name: '全部订单', isActive: true, id: 1 },
      { name: '待付款', isActive: false, id: 2 },
      { name: '待收货', isActive: false, id: 3 },
      { name: '退货退款', isActive: false, id: 4 },
    ],
    orders: []   //接口返回的订单数据
  },
  type: null,   //全局变量 保存传过来的type

  //1.点击时激活样式, 2. 点击时显示对应tab栏数据
  itemClick(e) {
    let currentIndex = e.currentTarget.dataset.index  //获取点击的索引
    let tabs = this.data.tabs
    tabs.forEach((item, idx) => {
      //遍历数组，当前元素索引值和点击索引相等时，激活样式  
      idx === currentIndex ? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabs    //更新本地数据
    })
    //第2件事：显示对应Tab的数据，即重新发送请求
    let token = wx.getStorageSync('token')
    request({
      url: '/my/orders/all',
      header: { Authorization: token },
      data: { type: currentIndex + 1 }   //传入当前索引+1 就是对应的type
    }).then(res => {
      this.data.orders = res.data.message  //获取对应的订单数据
      this.setData({ orders: this.data.orders })
    })
  },

  //从个人中心页跳转过来时，传入type激活样式  其实2个方法一样，只是传入的参数不同
  activeTab(type) {   //根据type值激活对应的tab
    let tabs = this.data.tabs
    tabs.forEach((item, idx) => {
      //遍历数组，传入的type和索引相等时，激活tab样式  
      idx === type ? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabs
    })
  },

  onLoad: function (options) {
    // console.log(options); //获取到profile页面-navigator url中传过来的type值
  },
  onShow: function () {
    /**getCurrentPages获取小程序的页面栈，页面栈是一个数组
     * 用户每跳转一个页面，会往页面栈存入当前页面对象，
     * 获取当前页面对象：即页面栈数组的最后一个元素：pages[pages.length-1]   */
    let pages = getCurrentPages()
    console.log(pages);
    let currentPage = pages[pages.length - 1]  //页面栈数组的最后一个元素就是当前页面对象
    console.log(currentPage.options);   //获取url中传过来的options对象
    this.type = currentPage.options.type  //保存获取到的type

    this.activeTab(this.type - 1)  //传入上面的type,激活对应的tab 注意：index=type-1

    /** 1.判断token是否存在
     * 这里注释代码因为非企业账号拿不到token，防止进入死循环
     * */
    let token = wx.getStorageSync('token')
    // if(!token){ //若token为空 ，则跳转到授权页面进行登录操作
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   })
    //   return
    // }

    //2.有token了，发起历史订单查询接口的请求
    request({
      url: '/my/orders/all',
      header: { Authorization: token }, //传token
      method: 'get',
      data: currentPage.options //传type值
    }).then(res => {
      //根据type值，接口返回对应的历史订单、待发货订单、待付款订单数据
      let orders = res.data.message
      this.setData({
        orders    //保存到本地orders中，再在wxml内渲染数据
      })
    })

  },


  


})