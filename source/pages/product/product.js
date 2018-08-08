// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ProductApi } from "../../apis/product.api.js";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options.id=1;
    this.Base.Page = this;
    this.Base.pagetitle = "";
    super.onLoad(options);
    this.Base.setMyData({ commentlist: [], commenttext: "", audio: "", audio_value:0, video: "",audio_duration:0});
  }
  onMyShow() {

    audioctx = wx.createAudioContext('myAudio');
    videoctx = wx.createVideoContext('myVideo');

    var that = this;
    var instapi = new InstApi();
    instapi.product({id:this.Base.options.id}, (product) => {
      that.Base.setMyData(product);


      that.Base.pagetitle = product.name;

      wx.setNavigationBarTitle({
        title: product.name
      });
      WxParse.wxParse('content', 'html', product.content, that, 10);
    });
    

    this.loadcomment();
  } 
  audioPlay() {
    videoctx.pause();
  }
  audiotimeupdate(e){

    var that = this;
    that.Base.setMyData({ audio_duration: e.detail.duration,audio_value:e.detail.currentTime });
  }
  aduio_slider(e) {
    var that = this;
    console.log(e);
    var currentTime = e.detail.value;
    audioctx.seek(currentTime );
    that.Base.setMyData({ audio_value:currentTime });
  }
  mydownload() {
    var that=this;
    var id = this.Base.getMyData().id;
    var attachment = this.Base.getMyData().attachment;
    var uploadpath = this.Base.getMyData().uploadpath;
    var downloadcount = parseInt(this.Base.getMyData().downloadcount);
    wx.showToast({
      title: '正在下载文件......',
      icon:"none"
    });
    var url=uploadpath+"product/"+attachment;
    console.log(attachment);
    this.Base.download(url, (filepath)=>{
      var productapi=new ProductApi();
      productapi.download({ product_id: id},(ret)=>{
        that.Base.setMyData({ downloadcount: downloadcount+1});
      });
      wx.showModal({
        title: '下载成功',
        content: '是否直接打开资料',
        success(res){
          if(res.confirm){
            wx.openDocument({
              filePath: filepath,
            })
          }
        }
      })
    });
  }
  showincomment(){
    this.Base.setMyData({ incomment:true});
  }
  commenttextchange(e){
    this.Base.setMyData({ commenttext: e.detail.value });
  }
  hideincomment() {
    this.Base.setMyData({ incomment: false });
  }
  comment(){
    var commenttext=this.Base.getMyData().commenttext;
    if(commenttext.trim()==""){
      wx.showToast({
        title: '请输入评论内容',
        icon:"none"
      });
      return;
    }

    var api=new ProductApi();
    api.comment({product_id:this.Base.options.id,comment:commenttext},()=>{
      this.loadcomment();
      this.Base.setMyData({ incomment: false, commenttext:"" });
    });
  }
  loadcomment(){
    var api = new ProductApi();
    api.commentlist({ product_id: this.Base.options.id},(commentlist)=>{
      this.Base.setMyData({commentlist:commentlist});
    });
  }
  videoplay(){
    audioctx.pause();
  }
  audioplay() {
  }
  fav(){
    var fav=this.Base.getMyData().fav;
    var api=new ProductApi();
    api.fav({"product_id":this.Base.options.id},(ret)=>{

      if (fav == "Y") {
        this.Base.setMyData({ fav: "N" });
        this.Base.toast("取消收藏成功");
      }else{

        this.Base.setMyData({ fav: "Y" });
        this.Base.toast("收藏成功");
      }
    });
  }
  sharetotimes(){

    var papi = new ProductApi();
    papi.poster({ product_id: this.Base.options.id },(ret)=>{
      var url = "https://cmsdev.app-link.org/Users/alucard263096/deky/upload/poster/" + this.Base.options.id+".png";
      wx.navigateTo({
        url:"/pages/photodownload/photodownload?url="+url,
      })
    });
  }
}
var audioctx=null;
var videoctx=null;
var catc=null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.mydownload = content.mydownload;
body.showincomment = content.showincomment;
body.hideincomment = content.hideincomment; 
body.comment = content.comment;
body.commenttextchange = content.commenttextchange; 
body.loadcomment = content.loadcomment;
body.videoplay = content.videoplay; 
body.fav = content.fav;
body.audioPlay = content.audioPlay;
body.audiotimeupdate = content.audiotimeupdate; 
body.aduio_slider = content.aduio_slider;
body.sharetotimes = content.sharetotimes;

Page(body)