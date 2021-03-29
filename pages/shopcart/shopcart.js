Page({
  data: {
    address: {}, //收货地址
    goods: [],  //购物车数据 
    totalCount: 0,  //商品数量
    totalPrice: 0,   //商品总价
    allCheck: null   //底部全选按钮
  },
  getAddress() {
    wx.chooseAddress({ //获取收货地址api
      success: (result) => { //用户点击确认
        console.log(result);
        this.data.address = result
        wx.setStorageSync('address', this.data.address) //把地址存入缓存
      },
    })
  },

  //计算商品总价格和总数量
  getTotal() {
    let count = 0;
    let price = 0;
    // 每次调用getTotal方法，重新获取缓存数据
    let goods = wx.getStorageSync('cart') || []
    goods.filter(item => {
      return item.goods_checked === true
    }).forEach(item => {
      count += item.goodsNum
      price += item.goodsNum * item.goods_price
    })
    this.setData({
      totalCount: count,
      totalPrice: price
    })
    //把数量和总价也存入缓存中，给支付页面调用
    wx.setStorageSync('totalPrice', this.data.totalPrice)
    wx.setStorageSync('totalCount', this.data.totalCount)
  },

  /**修改复选框状态
   * 思路：
   * 1.每次点击时取反
   * 2.通过数组every方法更新全选框的状态
   * 3.更新缓存，并重新计算商品总价和数量
   */
  checkChange(e) {
    let idx = e.currentTarget.dataset.idx
    // console.log(e);
    // 1.对点击的复选框取反
    this.data.goods[idx].goods_checked = !this.data.goods[idx].goods_checked
    //2.更新缓存值
    wx.setStorageSync('cart', this.data.goods)
    //3.重新计算价格和数量
    this.getTotal()

    //4.第2件事:关联allCheck状态，先重新获取缓存
    let cart = wx.getStorageSync('cart')
    //1.购物车数组为空时, allCheck=false  2.不为空时，通过every判断全选框状态
    let allCheck = cart.length != 0 ? cart.every(item => item.goods_checked === true) : false
    this.setData({
      allCheck
    })
  },

  /**
   * 修改全选框状态
   */
  selectAll() {
    //1. 取反
    this.setData({
      allCheck: !this.data.allCheck
    })
    //2.关联购物车所有商品的check值
    let cart = this.data.goods
    if (this.data.allCheck) {
      cart.forEach(item => item.goods_checked = true)
    } else {
      cart.forEach(item => item.goods_checked = false)
    }
    this.setData({
      goods: cart  //更新本地data
    })
    //更新缓存
    wx.setStorageSync('cart', this.data.goods)
    //每个方法最后都别忘 重新计算价格和数量
    this.getTotal()
  },

  /**修改商品数量
   * 思路：
   * 1.更新数量后，更新本地数据
   * 2.更新缓存
   * 3.重新计算价格
   */
  handleNum(e) {
    // console.log(e);
    let num = e.currentTarget.dataset.num //商品数量+1||-1
    let idx = e.currentTarget.dataset.idx //商品索引
    let cart = wx.getStorageSync('cart')
    // 判断商品数量=1且用户点击了-1按钮， 弹窗提示删除
    if (cart[idx].goodsNum === 1 && num === -1) {
      wx.showModal({  //wx官方api弹窗
        cancelColor: 'cancelColor',
        title: '警告',
        content: '是否删除?',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击了确定');
            cart.splice(idx, 1)  //删除索引值=idx 的数组元素
            this.setData({  //更新本地data
              goods: cart
            })
            wx.setStorageSync('cart', cart) //更新缓存
            this.getTotal() //重新计算价格和数量

          } else if (res.cancel) {
            console.log('用户点击了取消');
          }
        }
      })
    } else {
      cart[idx].goodsNum += num
      this.setData({
        goods: cart  //更新本地data
      })
      wx.setStorageSync('cart', cart)  //更新缓存
      this.getTotal() //重新计算价格
    }

  },

  /**跳转到支付页
   * 1.判断是否有商品，没有则弹窗提示
   * 2.判断是否有收货地址，没有则弹窗提示
   * 3.都满足，则跳转到支付页面
   */
  goPay() {
    const address = wx.getStorageSync('address') //收货地址
    const totalCount = this.data.totalCount  //选中的商品数量
    if (!address) {
      wx.showToast({
        title: '还没有添加收货地址',
      }) 
      return  //多个If语句 必须写return
    }
    if (totalCount === 0) {
      wx.showToast({
        title: '你还没有选择商品',
        icon: 'none'
      })
      return  //多个If语句 必须写return
    }
    wx.navigateTo({  //以上2个都不满足，跳转到pay页面
      url: '/pages/pay/pay',
    })
  },
  onLoad: function (options) {//onload只在第一次打开页面渲染
    console.log(options); //navigator url参数
  },
  onShow: function () { //onshow中每次重新打开页面都会渲染
    //获取缓存中的收货地址
    const address = wx.getStorageSync('address')
    this.setData({    //每次显示页面时渲染收货地址
      address
    })

    //获取缓存中的购物车数据
    const goods = wx.getStorageSync('cart')
    this.setData({
      goods
    })
    console.log(this.data.goods);
    this.getTotal() //计算商品数量和总价

    // 每次渲染页面时也要进行一次allCheck判断
    let allCheck = goods.length != 0 ? goods.every(item => item.goods_checked === true) : false
    this.setData({
      allCheck
    })
  }

})