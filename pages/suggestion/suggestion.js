// pages/suggestion/suggestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      { name: '体验问题', isActive: true },
      { name: '商品、商家投诉', isActive: false }
    ],
    upLoadList: [],  //上传的图片列表，传给子组件
  },
  currentIndex: 0,
  textVal: '',   //文本域的输入内容

  tabClick(e) {
    console.log(e);
    this.currentIndex = e.currentTarget.dataset.index
    let tabList = this.data.tabList
    tabList.forEach((item, index) => {
      index == this.currentIndex ? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabList
    })
  },
  //点击+号上传图片
  upLoadImg() {
    wx.chooseImage({  //wx添加图片api
      count: 8,  //最多可选择图片数
      success: (res) => {  //成功后回调，res会返回图片的临时路径
        this.data.upLoadList.push(...res.tempFilePaths)  //每次上传成功后，拼接新数组到老数组中
        this.setData({
          upLoadList: this.data.upLoadList  //把图片路径保存到本地data中，以供页面渲染
        })
        console.log(this.data.upLoadList);
      }
    })
  },
    //删除选中的缩略图
    removeImg(e){
      let idx = e.detail.idx
      let list = this.data.upLoadList
      list.splice(idx,1)  //删除该索引位的图片
      this.setData({
        upLoadList: list
      })
    },

    //获取文本域输入内容
    handleTextarea(e) {
      this.textVal = e.detail.value 
    },
    /**提交按钮-要处理的事
     * 1.验证文本域内容是否合法
     * 2.把选中的图片上传到服务器
     * 3.上传成功后清空页面数据
    */
    submit() {
      if(!this.textVal.trim()){ //输入内容为空
        wx.showToast({
          title: '输入内容不合法',
          icon: 'none'
        })
        return 
      }
      this.data.upLoadList.forEach((item,index) => { //遍历数组挨个上传
        wx.uploadFile({  //微信上传文件接口 该接口一次只能上传一个文件，所以传数组时，需要对数组遍历进行上传
          filePath: item,   //要上传文件的本地路径，即数组元素的值，通过wx.chooseImage返回的临时路径获取
          name: 'suggest-img',    //文件名 可自定义
          url: 'https://images.ac.cn/Home/Index/UploadAction',   //要传到哪里  测试地址：新浪图床接口
          formData: {}, //附带的文本信息
          success: (res) => {
            console.log(res);  //接口返回图片外网路径，保存下来
            let url = JSON.parse(res.data)  //返回json对象的话 需要格式化一下
            //判断何时全部上传完毕？ 
            if(index === this.data.upLoadList.length-1){ //当索引值和数组长度-1相等时，即遍历到最后一位
              console.log('把文本内容和外网图片路径传给后台服务器');
              //提交成功后 重置当前页面
              this.setData({
                textVal: '',
                
              })
            }
          }
        })
      })
     
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})