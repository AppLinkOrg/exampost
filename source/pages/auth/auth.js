//index.js
//获取应用实例
const app = getApp()

Page({
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  getUserInfo: function (e) {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})
