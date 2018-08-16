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
    this.Base.setMyData({toplist:[],productlist:[]});
  }
  onMyShow() {
    var that = this;
    var instapi=new InstApi();
    instapi.indexbanner({ displaytype:"home"},(indexbanner)=>{
      that.Base.setMyData({ indexbanner: indexbanner});
    });
    var productlist=this.Base.getMyData().productlist;
    if (productlist.length==0){
      instapi.productlist({orderby:"published_date desc limit 0,15"}, (productlist) => {
        that.Base.setMyData({ productlist: productlist });
      });
    }
    instapi.productlist({ontop:"Y", orderby: "published_date desc " }, (toplist) => {
      that.Base.setMyData({ toplist: toplist });
    });
  }
  onPullDownRefresh(){
    this.Base.setMyData({ productlist: [],toplist:[] });
    this.onMyShow();
  }
  onReachBottom(){
    this.Base.setMyData({reachmore:true});
    var that = this;
    var instapi = new InstApi();
    var productlist = this.Base.getMyData().productlist;
    var lastpost = productlist[productlist.length-1];
    var lasttimespan = lastpost.published_date_timespan - 1;
    var lasttimespan_str = this.Base.util.FormatDateTime(new Date(lasttimespan * 1000)) + ".99";
    console.log(lasttimespan_str);
    instapi.productlist({ published_date_to: lasttimespan_str, orderby: " published_date desc limit 0,10" }, (nproductlist) => {
      for(var i=0;i<nproductlist.length;i++){
        productlist.push(nproductlist[i]);
      }

      this.Base.setMyData({ productlist: productlist, reachmore:false });
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.onPullDownRefresh = content.onPullDownRefresh;
Page(body)