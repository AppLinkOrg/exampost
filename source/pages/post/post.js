// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ images: [], video: "", mobile: "",noticesuccess:false});
    var api = new PostApi();
    api.catlist({}, (catlist)=>{
      this.Base.setMyData({ catlist, catindex:0 });
    });
  }
  onMyShow() {
    var that = this;

    var mylocation = this.Base.getMyData().mylocation;
    if (mylocation == undefined) {
      that.Base.getAddress((addressinfo) => {
        var address = { title: addressinfo.formatted_addresses.recommend, address: addressinfo.address, lat: addressinfo.location.lat, lng: addressinfo.location.lng};
        that.Base.setMyData({ mylocation: addressinfo, address: address });
      });
    }
    
  }
  selectaddress(){
    wx.navigateTo({
      url: '/pages/addressselect/addressselect?callbackid=address' ,
    })
  } 
  dataReturnCallback(callbackid, data) {
    console.log(callbackid);
    var that = this;
    if(callbackid=="address"){
      var address={title:data.title,address:data.address,lat:data.location.lat,lng:data.location.lng};

      that.Base.setMyData({ address: address });
    }
  }
  uploadimg(){
    var that=this;
    this.Base.uploadImage("post",(ret)=>{
      var images = that.Base.getMyData().images;
      images.push(ret);
      that.Base.setMyData({images});
    });
  }
  uploadvideo(){

    var that = this;
    this.Base.uploadVideo("post", (ret) => {
      that.Base.setMyData({ video: ret });
    });
  }
  phonenoCallback(mobile, e) {
    this.Base.setMyData({ mobile: mobile });
  }
  confirm(e){
    console.log(e);
    var title = e.detail.value.title;
    var images=this.Base.getMyData().images;
    var video = this.Base.getMyData().video;
    var catlist = this.Base.getMyData().catlist;
    var catindex = this.Base.getMyData().catindex;
    if(title.trim()==""){
      this.Base.info("写一下您的新鲜事～～～");
      return;
    }
    var api = new PostApi();
    api.create({
      cat_id: catlist[catindex].id,
      title:title,
      images:images.join(","),
      video:video
    },(ret)=>{
      if(ret.code==0){
        this.Base.setMyData({ noticesuccess:true,post_id:ret.return});
      }else{
        this.Base.info(ret.result);
      }
    });
  }
  closenotice(){
    var post_id=this.Base.getMyData().post_id;
    wx.switchTab({
      url: '/pages/times/times' ,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
  minusImg(e){
    var that=this;
    var seq=e.currentTarget.id;
    var images = that.Base.getMyData().images;
    var imgs=[];
    for(var i=0;i<images.length;i++){
      if(seq!=i){
        imgs.push(images[i]);
      }
    }
    that.Base.setMyData({ images: imgs});
  } 
  minusVideo(){
    this.Base.setMyData({ video: '' });
  }
  catchange(e){
    var catindex=e.detail.value;
    this.Base.setMyData({ catindex: catindex });
  }
  selectupload(){
    var that=this;
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success: function (res) {
        if(res.tapIndex==0){
          that.uploadimg();
        }else if(res.tapIndex==1){
          that.uploadvideo();
        } else if (res.tapIndex == 1) {
          that.uploadvideo();
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
  like(e){
    var id=e.currentTarget.id;
    console.log(id);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.selectaddress = content.selectaddress; 
body.dataReturnCallback = content.dataReturnCallback;
body.uploadimg = content.uploadimg;
body.phonenoCallback = content.phonenoCallback;
body.uploadvideo = content.uploadvideo; 
body.confirm = content.confirm;
body.closenotice = content.closenotice; 
body.minusImg = content.minusImg; 
body.catchange = content.catchange; 
body.selectupload = content.selectupload;
body.minusVideo = content.minusVideo;
Page(body)