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
    this.Base.setMyData(options);


    if(options.url!=undefined){
      this.Base.setMyData({url:options.url});
    } else {
      var uploadpath = this.Base.getMyData().uploadpath;
      var model = this.Base.getMyData().model;
      var file = this.Base.getMyData().file;
      var url = uploadpath+model+"/"+file;

      this.Base.setMyData({ url: url });
    }
  }
  onMyShow() {
    var that = this;
  }
  downloadphoto(){
    var url = this.Base.getMyData().url;

    console.log(url);
    this.Base.downloadImage(url,(ret)=>{
      console.log(ret);
      this.Base.toast("下载成功");
    },true);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.downloadphoto = content.downloadphoto;
Page(body)