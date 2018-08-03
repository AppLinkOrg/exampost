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
    this.Base.setMyData({ list: [], ontype: false, commenttext:""});
  }
  onMyShow() {
    var that = this;
    if(AppBase.NEEDRELOADTIMES==true){
      this.Base.setMyData({ list: [], ontype: false, commenttext: "" });
      AppBase.NEEDRELOADTIMES=false;
    }
    this.loaddata();
  }
  
  loaddata() {
    var that = this;
    var api = new PostApi();
    var that = this;
    var list = this.Base.getMyData().list;
    var api = new PostApi();
    var json = {};
    if (list.length == 0) {
      json = {
        intimes:"Y",
        orderby: "post_time desc limit 0,15"
      };
    } else {
      var lastpost = list[0];
      json = {
        intimes: "Y",
        post_time_from: lastpost.post_time + ".99"
      }
    }
    api.list(json, (nlist) => {
      if (nlist.length == 0) {
        return;
      }
      wx.showToast({
        title: '发现' + nlist.length + "条记录",
        icon: "none"
      })
      for (var i = 0; i < nlist.length; i++) {

        if (nlist[i].images == "") {

          nlist[i].images = [];
        } else {

          nlist[i].images = nlist[i].images.split(",");
        }
        nlist[i].timeduration = time_ago(nlist[i].post_time_timespan);

      }
      for (var i = 0; i < list.length; i++) {
        nlist.push(list.postlist[i]);
      }
      wx.hideTabBarRedDot({
        index: 2,
      })
      that.Base.setMyData({ list: nlist });
    });




  }
  onReachBottom() {

    var that = this;
    var api = new PostApi();
    var that = this;
    var list = this.Base.getMyData().list;
    var api = new PostApi();
    var lastpost = list[list.length - 1];
    console.log(lastpost.post_time_timespan);
    var lasttimespan = lastpost.post_time_timespan - 1;
    var lasttimespan_str = this.Base.util.FormatDateTime(new Date(lasttimespan * 1000)) + ".99";
    var json = {
      post_time_to: lasttimespan_str,
      intimes: "Y",
      orderby: "post_time desc limit 0,10"
    }
    api.list(json, (nlist) => {
      if (nlist.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: "none"
        })
        return;
      }
      for (var i = 0; i < nlist.length; i++) {
        if (nlist[i].images==""){

          nlist[i].images = [];
        }else{

          nlist[i].images = nlist[i].images.split(",");
        }
        
        nlist[i].timeduration = time_ago(nlist[i].post_time_timespan);

        list.push(nlist[i]);
      }
      that.Base.setMyData({ list: list });
    });




  }
  onPullDownRefresh(){
    this.Base.setMyData({list:[]});
    this.onMyShow();
  }

  like(e) {
    var id = e.currentTarget.id;
    var api = new PostApi();
    api.like({ post_id: id },(ret)=>{
      var list = this.Base.getMyData().list;
      var UserInfo = this.Base.getMyData().UserInfo;
      for(var i=0;i<list.length;i++){
        if(list[i].id==id){
          if (list[i].like=='N'){
            list[i].likelist.push(UserInfo);
            list[i].like = "Y";
          }else{
            list[i].likelist.pop();
            list[i].like = "N";
          }
        }
      }
      this.Base.setMyData({ list});
    });
  }
  
  gotoOntype(e) {
    var id=e.currentTarget.id;
    this.Base.setMyData({ ontype:true,comment_post_id:id });
  }
  unontype() {
    this.Base.setMyData({ ontype: false });
  }
  comment(){
    var comment_post_id = this.Base.getMyData().comment_post_id;
    var commenttext = this.Base.getMyData().commenttext;

    
    var api = new PostApi();
    api.comment({ post_id: comment_post_id, comment: commenttext }, (ret) => {
      var list = this.Base.getMyData().list;
      var UserInfo = this.Base.getMyData().UserInfo;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == comment_post_id) {
          var com={comment:commenttext,nickName:UserInfo.nickName};
          list[i].commentlist.push(com);
        }
      }
      this.Base.setMyData({ list, comment: commenttext, ontype: false  });
    });



  }

  changecommenttext(e){
    var commenttext=e.detail.value;
    this.Base.setMyData({ commenttext});
  }
  deletemypost(e){
    var that=this;
    var id=e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success(res){
        if(res.confirm){
          var postapi=new PostApi();
          postapi._delete({"idlist":id},(ret)=>{
            
            var list=[];
            var olist=that.Base.getMyData().list;
            for(var i=0;i<olist.length;i++){
              if(olist[i].id!=id){
                list.push(olist[i]);
              }
            }
            that.Base.setMyData({list});
          })
        }
      }
    })
  }
}
var count = 0;

function time_ago(agoTime) {

  // 计算出当前日期时间到之前的日期时间的毫秒数，以便进行下一步的计算
  var time = (new Date()).getTime() / 1000 - agoTime;

  var num = 0;
  if (time >= 31104000) { // N年前
    num = parseInt(time / 31104000);
    return num + '年前';
  }
  if (time >= 2592000) { // N月前
    num = parseInt(time / 2592000);
    return num + '月前';
  }
  if (time >= 86400) { // N天前
    num = parseInt(time / 86400);
    return num + '天前';
  }
  if (time >= 3600) { // N小时前
    num = parseInt(time / 3600);
    return num + '小时前';
  }
  if (time > 60) { // N分钟前
    num = parseInt(time / 60);
    return num + '分钟前';
  }
  return '1分钟前';
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.onPullDownRefresh = content.onPullDownRefresh;
body.onReachBottom = content.onReachBottom;
body.onReachBottom = content.onReachBottom;

body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab; 
body.loaddata = content.loaddata;
body.like = content.like; 
body.gotoOntype = content.gotoOntype;
body.unontype = content.unontype; 
body.comment = content.comment; 
body.changecommenttext = content.changecommenttext;
body.deletemypost = content.deletemypost;

Page(body)