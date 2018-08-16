// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  ContentApi
} from "../../apis/content.api";
import {
  MemberApi
} from "../../apis/member.api";
import {
  PostApi
} from "../../apis/post.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id = 4;
    super.onLoad(options);
    this.Base.setMyData({
      currenttab: "0",
      list: [],
      allmycomment: [],
      id: options.id
    });
  }
  onMyShow() {
    var that = this;
    var memberApi = new MemberApi();
    memberApi.info({
      fmember_id: this.Base.options.id
    }, (memberinfo) => {
      if (memberinfo != null) {
        this.Base.setMyData({
          memberinfo: memberinfo
        });
      }
    });
    this.loaddata();
  }


  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
  }
  loaddata(e) {
    console.log("loaddata");
    var api = new PostApi();
    var that = this;

    api.list({
      orderby: " r_main.post_time desc ",
      status: "A",
      onlymy:"Y",
      fmember_id: this.Base.options.id
    }, (nlist) => {

      for (var i = 0; i < nlist.length; i++) {
        if (nlist[i].images == "") {

          nlist[i].images = [];
        } else {

          nlist[i].images = nlist[i].images.split(",");
        }

        nlist[i].timeduration = time_ago(nlist[i].post_time_timespan);

        //list.push(nlist[i]);
      }
      that.Base.setMyData({
        list: nlist
      });
    });
    api.allmycomment({
      member_id: this.Base.options.id
    }, (allmycomment) => {
      for (var i = 0; i < allmycomment.length; i++) {
        allmycomment[i].comment_time_ago = time_ago(allmycomment[i].comment_time_timespan);
      }
      that.Base.setMyData({
        allmycomment
      });
      });
    api.allmylike({
      member_id: this.Base.options.id
    }, (allmylike) => {
      for (var i = 0; i < allmylike.length; i++) {
        allmylike[i].like_time_ago = time_ago(allmylike[i].like_time_timespan);
      }
      that.Base.setMyData({
        allmylike
      });
    });
  }

  allfollow() {
    wx.navigateTo({
      url: '/pages/myfollow/myfollow',
    })
  }
  allpost() {
    wx.navigateTo({
      url: '/pages/mypost/mypost',
    })
  }


  addfriend() {
    console.log("aaa");
    var api = new MemberApi();
    var that = this;

    api.addfriend({
      follow_member_id: this.Base.options.id
    }, (ret) => {
      wx.showToast({
        title: '关注成功',
        icon: "none"
      });
      var memberinfo = that.Base.getMyData().memberinfo;
      memberinfo.followed = true;
      memberinfo.fanscount = memberinfo.fanscount + 1;
      that.Base.setMyData({
        memberinfo: memberinfo
      });
    });
  }
  removefriend() {

    var api = new MemberApi();
    var that = this;

    api.removefriend({
      follow_member_id: this.Base.options.id
    }, (ret) => {
      wx.showToast({
        title: '已取消关注',
        icon: "none"
      });
      var memberinfo = that.Base.getMyData().memberinfo;
      memberinfo.followed = false;
      memberinfo.fanscount = memberinfo.fanscount - 1;
      that.Base.setMyData({
        memberinfo: memberinfo
      });
    });
  }
  gotochatroom() {

    wx.navigateTo({
      url: '/pages/chatroom/chatroom?member_id=' + this.Base.options.id,
    })
  }


  deletemypost(e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          var postapi = new PostApi();
          postapi._delete({
            "idlist": id
          }, (ret) => {

            var list = [];
            var olist = that.Base.getMyData().list;
            for (var i = 0; i < olist.length; i++) {
              if (olist[i].id != id) {
                list.push(olist[i]);
              }
            }
            that.Base.setMyData({
              list
            });
          })
        }
      }
    })
  }
}


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
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;
body.allpost = content.allpost;
body.allfollow = content.allfollow;
body.addfriend = content.addfriend;
body.removefriend = content.removefriend;
body.gotochatroom = content.gotochatroom;
body.deletemypost = content.deletemypost;
Page(body)