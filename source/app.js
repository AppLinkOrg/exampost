//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力

  },
  onShow: function(options) {
    // Do something when show.
    console.log("on app show");
    console.log(options);
    if (options.scene == 1044 && options.isSticky == false) {
      console.log("openin1033");
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function(res) {
          console.log("res");
          console.log(res);

        }
      })
    } 
  }
})