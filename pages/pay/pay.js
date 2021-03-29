import { request } from '../../network/request'
Page({
  data: {
    cart: [],       //获取缓存中的购物车数据，注意:仅获取checked==true的商品
    address: {},    //获取地址
    totalPrice: '', //获取总价
    totalCount: ''  //获取数量
  },

  //支付按钮事件 包括整个支付流程:用户授权获取token，创建订单，发起支付，查询订单 
  handlePay() {
    const token = wx.getStorageSync('token')  //获取缓存中的token
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth', //跳转到授权页面
      })
    } else {   //已获取到token,开始支付流程
      //3个要传给创建订单接口的参数
      const order_price = this.data.totalPrice  //1.订单总价
      const addr = this.data.address            //2.收货地址
      const goods = []                          //3.订单数组(商品id,商品数量,商品单价)
      let cart = this.data.cart
      cart.forEach(item => { //把购物车内需要的3个字段遍历出来放到新的订单数组中
        goods.push({
          goods_id: item.goodsId.goods_id,
          goods_number: item.goodsNum,
          goods_price: item.goods_price
        })
      })
      /**1.发起创建订单请求 */
      request({
        url: '/my/orders/create',   //创建订单接口
        data: { order_price, addr, goods },  //请求体传需要的3个参数
        headers: { Authorization: token },   //请求头参数:token
        method: 'post'
      }).then(res => {
        console.log(res);  //这个res会返回order_number即订单编号
        let orderNum = res.data.order_number //保存返回的订单编号
        /**2. 发起支付参数请求 */
        request({
          url: '/my/orders/req_unifiedorder', //支付参数接口,调用微信支付必须的参数
          method: 'post',
          header: { Authorization: token }, //传token
          data: { orderNum }  //传订单编号
        }).then(res => {
          console.log(res);  //会返回一个pay对象，包含了调用微信支付需要的参数
          /*
           * 3.发起微信支付,所需参数即是上面pay对象返回的参数
          */
          wx.requestPayment({
            nonceStr: 'nonceStr',  
            package: 'package',
            paySign: 'paySign',
            timeStamp: 'timeStamp',
            success: () => {  //前端扫码支付成功后的回调
              /** 4. 发起查询后台订单请求，根据后台返回值判断订单是否真正支付成功 */
              request({
                url: '/my/orders/chkOrder',  //查询订单接口,所需参数为token和订单编号
                method: 'post',
                header: { Authorization: token },
                data: { orderNum }
              }).then(res => {
                console.log(res);   //此处后台会返回订单是否成功的信息，到这里才算完成支付
                wx.showToast({
                  title: '支付成功'
                })
                //5. 支付成功后，删除缓存内选中的购物车数据 (重新从缓存中获取)
                let cart = wx.getStorageSync('cart')
                cart = cart.filter(item => item.goods_checked == true)
                this.setData({   
                  cart   //更新缓存
                })
                //6.最后一步 跳转到订单页面
                wx.navigateTo({
                  url: '',  
                })
              })
            }
          })
        })
      })
    }
  },
  onShow: function () {
    let cart = wx.getStorageSync('cart')
    //filter方法不会修改原数组，所以要新建一个变量保存返回值
    let checkedCart = cart.filter(item => item.goods_checked === true) //仅获取checked==true的商品
    console.log(cart);
    let address = wx.getStorageSync('address')
    let totalPrice = wx.getStorageSync('totalPrice')
    let totalCount = wx.getStorageSync('totalCount')
    this.setData({
      cart: checkedCart,
      address,
      totalPrice,
      totalCount
    })
  }
})