// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { ContentApi } from "../../apis/content.api";
import { MemberApi } from "../../apis/member.api";
import { PostApi } from "../../apis/post.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      currenttab: "0"
    });
  }
  onMyShow() {
    var that = this;
    var memberApi = new MemberApi();
    memberApi.info({fmember_id:this.Base.options.id}, (memberinfo) => {
      if (memberinfo != null) {
        this.Base.setMyData({ memberinfo: memberinfo });
      }
    });
    this.loaddata();


  }


  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
    this.loaddata();
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
    this.loaddata();
  }
  loaddata(e) {
    var api = new PostApi();
    var that = this;
    var seq = this.Base.getMyData().currenttab;
    switch (seq) {
      case "0":
        api.list({ orderby: " r_main.post_time desc ", status: "A,I", "onlymy": "Y",member_id: this.Base.options.id  }, (listMy) => {
          for (var i = 0; i < listMy.length; i++) {
            listMy[i].cover = listMy[i].images.split(",")[0];
          }
          that.Base.setMyData({ listMy });
        });
        break;
      case "1":
        api.list({ orderby: " r_main.post_time desc ", status: "A,I", "onlyfollow": "Y", member_id: this.Base.options.id  }, (listFollow) => {
          for (var i = 0; i < listFollow.length; i++) {
            listFollow[i].cover = listFollow[i].images.split(",")[0];
          }
          that.Base.setMyData({ listFollow });
        });
        break;
    }
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
  addfriend(){

    var api = new MemberApi();
    var that = this;

    api.addfriend({follow_member_id:this.Base.options.id},(ret)=>{
      wx.showToast({
        title: '关注成功',
        icon:"none"
      });
      var memberinfo=that.Base.getMyData().memberinfo;
      memberinfo.followed=true;
      memberinfo.fanscount = memberinfo.fanscount+1;
      that.Base.setMyData({memberinfo:memberinfo});
    });
  }
  removefriend() {

    var api = new MemberApi();
    var that = this;

    api.removefriend({ follow_member_id: this.Base.options.id }, (ret) => {
      wx.showToast({
        title: '已取消关注',
        icon: "none"
      });
      var memberinfo = that.Base.getMyData().memberinfo;
      memberinfo.followed = false;
      memberinfo.fanscount = memberinfo.fanscount - 1;
      that.Base.setMyData({ memberinfo: memberinfo });
    });
  }
  gotochatroom() {

    wx.navigateTo({
      url: '/pages/chatroom/chatroom?member_id='+this.Base.options.id,
    })
  } 
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
Page(body)