// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ productlist: [] });
  }
  onMyShow() {
    var that = this;
   
    console.log(this.Base.getMyData().UserInfo);
    console.log(AppBase.UserInfo.avatarUrl);
    console.log(5555555555550);
    
  }
  
  getUserInfo(){
    AppBase.UserInfo.openid=undefined;
    console.log(1231321321);
    this.onShow();
  }
  

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getUserInfo = content.getUserInfo;
Page(body)