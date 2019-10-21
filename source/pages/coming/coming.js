// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    // if (AppBase.UserInfo.avatarUrl == undefined) {
    //   wx.showModal({
    //     title: '提示',
    //     content: "你还没有登录，请到我的页面点击授权并登录",
    //     showCancel: false,
    //     success(e) {
    //       if (e.confirm) {
    //         wx.reLaunch({
    //           url: '/pages/member/member',
    //         })
    //       }
    //     }
    //   })
    // }
    var that = this;
  }
  asad1as(){

    wx.navigateToMiniProgram({
      appId: 'wxcdcb21983d5da570', // 要跳转的小程序的appid
      path: 'pages/home/home', // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功 
      }
    }) 

  }
  asadas(){
    wx.navigateToMiniProgram({
      appId: 'wxce8dfd9950dacbe7', // 要跳转的小程序的appid
      path: 'pages/wode/wode', // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功 
      }
    }) 

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.asadas = content.asadas;
body.asad1as = content.asad1as;
Page(body)