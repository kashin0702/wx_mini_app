let ajaxTimes = 0  //定义一个变量，保存请求次数 初始为0
export function request(option) {
  ajaxTimes++;      //每次调用请求时，次数+1
  wx.showLoading({  //发送请求时，就调用showLoading显示图标
    title: '加载中'
  })
  return new Promise((resolve,reject) => {
    // 保存请求的主接口
    const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
    wx.request({
      url: baseURL + option.url, //传入option参数，动态获取接口
      method: option.method || 'GET',
      data: option.data,
      success: function(res){
        resolve(res)
      },
      fail: function(err){
        reject(err)
      },
      complete: () => { //hideLoading封装到complete函数内
        ajaxTimes--;  //每次请求完成时,次数-1
        if(ajaxTimes===0){ //当前页面所有请求都完成，隐藏loading图标
          wx.hideLoading() 
        }
      }
    })
  })
}