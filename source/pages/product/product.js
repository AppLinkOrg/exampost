// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ProductApi
} from "../../apis/product.api.js";
import {
  PostApi
} from "../../apis/post.api.js";
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  
  audiostate = false;
  audiorecord = 0;
  onLoad(options) {
    //options.id = 5;
    options.id = parseInt(options.id);
    this.Base.Page = this;
    this.Base.pagetitle = "";
    super.onLoad(options);
    this.Base.setMyData({
      audioplay: false,
      comments: [],
      commenttext: "",
      audio: "",
      audio_value: 0,
      video: "",
      audio_duration: 0,
      snumber: snumber
    });
    innerAudioContext=wx.createInnerAudioContext();
    this.Base.setMyData({
      currenttab: 0,
      reply: null,
      likelist: [],
      showmorecomment: []
    });
  }
  onMyShow() {

    audioctx = wx.createAudioContext('myAudio');
    videoctx = wx.createVideoContext('myVideo');

    console.log("audio play0");
    var that = this;
    var instapi = new InstApi();
    var id = this.Base.getMyData().id;
    if (id == undefined) {

      instapi.product({
        id: this.Base.options.id
      }, (product) => {
        product.id = parseInt(product.id);
        var uploadpath = that.Base.getMyData().uploadpath;

        that.Base.setMyData(product);
        that.Base.pagetitle = product.name;
        if (product.audio != "") {
          //innerAudioContext.autoplay = true;
          innerAudioContext.src = uploadpath + "product/" + product.audio;

          innerAudioContext.onPlay(that.audioPlay);
          innerAudioContext.onPause(that.audioPause);
          innerAudioContext.onTimeUpdate(that.audiotimeupdate);
          innerAudioContext.onCanplay(that.audiotimeupdate);
          var durationget = setInterval(() => {
            if (innerAudioContext.duration > 0) {
              that.Base.setMyData({
                audio_duration: innerAudioContext.duration,
                audio_duration_str: dtime(innerAudioContext.duration)
              });
              clearInterval(durationget);
            }
          }, 1000);
        }

        wx.setNavigationBarTitle({
          title: product.name
        });
        product.content = this.Base.util.HtmlDecode(product.content);
        WxParse.wxParse('content', 'html', product.content, that, 10);
      });
    }


    this.loadcomment();
    this.loadlikelist();
   
    if (this.audiostate == true) {
      console.log("audio play");
      this.audioPlay();
    }
  }
  loadcomment() {
    var api = new PostApi();
    api.commentlist({
      post_id: parseInt(this.Base.options.id) + snumber,
      orderby: "r_main.comment_time"
    }, (commentlist) => {
      if (this.Base.options.comment_id != undefined) {
        this.Base.setMyData({
          comments: commentlist,
          into_comment_id: "comment_" + this.Base.options.comment_id
        });
        this.Base.options.comment_id = undefined;
      } else {

        this.Base.setMyData({
          comments: commentlist
        });
      }
    });
  }
  audioPlay() {
    innerAudioContext.play();
    this.Base.setMyData({
      audioplay: true
    });
    this.audiostate=true;
    videoctx.pause();
  }
  clickaudioPause() {
    this.audiostate = false;
    this.Base.audioPause();
  }
  audioPause() {
    this.Base.setMyData({
      audioplay: false
    });
    innerAudioContext.pause();
  }
  onUnload() {
    this.audioPause();
  }
  audiotimeupdate(e) {

    var that = this;
    that.Base.setMyData({
      audio_duration: innerAudioContext.duration,
      audio_duration_str: dtime(innerAudioContext.duration),
      audio_value: innerAudioContext.currentTime,
      audio_value_str: dtime(innerAudioContext.currentTime)
    });
  }
  aduio_slider(e) {
    var that = this;
    console.log(e);
    var currentTime = e.detail.value;
    //audioctx.seek(currentTime);
    innerAudioContext.seek(currentTime);
    that.Base.setMyData({
      audio_value: currentTime
    });
  }
  mydownload() {
    var that = this;
    var id = this.Base.getMyData().id;
    var attachment = this.Base.getMyData().attachment;
    var uploadpath = this.Base.getMyData().uploadpath;
    var downloadcount = parseInt(this.Base.getMyData().downloadcount);
    wx.showToast({
      title: '正在下载文件......',
      icon: "none"
    });
    var url = uploadpath + "product/" + attachment;
    console.log(attachment);
    this.Base.download(url, (filepath) => {
      var productapi = new ProductApi();
      productapi.download({
        product_id: id
      }, (ret) => {
        that.Base.setMyData({
          downloadcount: downloadcount + 1
        });
      });
      wx.showModal({
        title: '下载成功',
        content: '是否直接打开资料',
        success(res) {
          if (res.confirm) {
            wx.openDocument({
              filePath: filepath,
            })
          }
        }
      })
    });
  }
  showincomment() {
    this.Base.setMyData({
      incomment: true
    });
  }
  commenttextchange(e) {
    this.Base.setMyData({
      commenttext: e.detail.value
    });
  }
  hideincomment() {
    this.Base.setMyData({
      incomment: false
    });
  }
  comment() {
    var commenttext = this.Base.getMyData().commenttext;
    if (commenttext.trim() == "") {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      });
      return;
    }

    var api = new ProductApi();
    api.comment({
      product_id: this.Base.options.id,
      comment: commenttext
    }, () => {
      this.loadcomment();
      this.Base.setMyData({
        incomment: false,
        commenttext: ""
      });
    });
  }
  loadcomment() {
    var api = new PostApi();
    api.commentlist({
      post_id: this.Base.options.id + snumber
    }, (commentlist) => {
      if (this.Base.options.comment_id != undefined) {
        this.Base.setMyData({
          comments: commentlist,
          into_comment_id: "comment_" + this.Base.options.comment_id
        });
        this.Base.options.comment_id = undefined;
      } else {

        this.Base.setMyData({
          comments: commentlist
        });
      }
    });
  }
  videoplay() {
    this.Base.setMyData({
      audioplay: false
    });
    audioctx.pause();
  }
  audioplay() {}
  fav() {
    var fav = this.Base.getMyData().fav;
    var api = new ProductApi();
    api.fav({
      "product_id": this.Base.options.id
    }, (ret) => {

      if (fav == "Y") {
        this.Base.setMyData({
          fav: "N"
        });
        this.Base.toast("取消收藏成功");
      } else {

        this.Base.setMyData({
          fav: "Y"
        });
        this.Base.toast("收藏成功");
      }
    });
  }
  sharetotimes() {

    var papi = new ProductApi();
    papi.poster({
      product_id: this.Base.options.id
    }, (ret) => {
      var url = "https://cmsdev.app-link.org/Users/alucard263096/deky/upload/poster/" + ret.return;
      wx.navigateTo({
        url: "/pages/photodownload/photodownload?url=" + url,
      });
    });
  }

  likeComment(e) {
    console.log("like?");
    var that = this;
    var seq = e.currentTarget.id;
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    console.log(comment);
    var api = new PostApi();
    api.commentlike({
      comment_id: comment.id,
      post_id: parseInt(comment.post_id) + snumber
    }, (ret) => {
      if (comments[seq].iliked == 'Y') {

        comments[seq].iliked = 'N';
        comments[seq].likecount = parseInt(comments[seq].likecount) - 1;
      } else {

        comments[seq].iliked = 'Y';
        comments[seq].likecount = parseInt(comments[seq].likecount) + 1;
      }
      that.Base.setMyData({
        comments
      });
    });
  }
  likeSubComment(e) {
    console.log("sublike?");
    var that = this;
    var seq = e.currentTarget.id.split("_");
    var seq_1 = seq[0];
    var seq_2 = seq[1];
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq_1].subcomments[seq_2];
    console.log(comment);
    var api = new PostApi();
    api.commentlike({
      comment_id: comment.id,
      post_id: comment.post_id
    }, (ret) => {
      comments[seq_1].subcomments[seq_2].iliked = 'Y';
      comments[seq_1].subcomments[seq_2].likecount = parseInt(comments[seq_1].subcomments[seq_2].likecount) + 1;
      that.Base.setMyData({
        comments
      });
    });
  }
  reply(e) {
    var seq = e.currentTarget.id;
    var comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    this.Base.setMyData({
      reply: comment
    });
  }
  subreply(e) {
    var seq = e.currentTarget.id.split("_");
    var seq_1 = seq[0];
    var seq_2 = seq[1];

    var comments = this.Base.getMyData().comments;
    var comment = comments[seq_1].subcomments[seq_2];
    comment.id = comments[seq_1].id;
    this.Base.setMyData({
      reply: comment
    });
  }
  clearReply() {
    this.Base.setMyData({
      reply: null
    });
  }
  loadlikelist() {
    var api = new PostApi();
    api.likelist({
      post_id: parseInt(this.Base.options.id) + snumber
    }, (likelist) => {
      this.Base.setMyData({
        likelist
      });
    });
  }

  deletecomment(e) {
    var seq = e.currentTarget.id;
    var comments = [];
    var that = this;
    comments = this.Base.getMyData().comments;
    var comment = comments[seq];
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success(res) {
        if (res.confirm) {

          var api = new PostApi();
          api.deletepost({
            idlist: comment.id
          }, (ret) => {
            comments.splice(seq, 1);
            that.Base.setMyData({
              comments
            });
          });
        }
      }
    })
  }


  like() {
    var api = new PostApi();
    var that = this;
    api.like({
      post_id: this.Base.options.id + snumber
    }, (ret) => {
      var like = this.Base.getMyData().like;
      var likecount = this.Base.getMyData().likecount;
      if (like == 'Y') {
        this.Base.setMyData({
          like: "N",
          likecount: likecount - 1
        });
      } else {
        this.Base.setMyData({
          like: "Y",
          likecount: parseInt(likecount) + 1
        });
      }
      that.loadlikelist();
    });

    //var data = this.Base.getMyData();
    //var like=this.Base.getMyData().like;
    //this.Base.setMyData({liked:true});
    //this.loadlikelist();
  }


  onShareAppMessage(e) {
    console.log("abbb");
    console.log(e);
    wx.updateShareMenu({
      withShareTicket: true
    });
    var id = this.Base.getMyData().id;
    var sharecount = parseInt(this.Base.getMyData().sharecount);

    var api = new ProductApi();
    api.share({
      id: id
    });
    //that.toast("分享成功");

    var that = this;
    that.Base.setMyData({
      sharecount: ++sharecount
    });
    return {
      // 分享路径，房间名+用户uid
      // 转发成功的回调函数
      success: function(res) {
        var api = new ProductApi();
        var sharecount = parseInt(this.Base.getMyData().sharecount);
        api.share({
          id: id
        });
        that.Base.setMyData({
          sharecount: ++sharecount
        });
        //that.toast("分享成功");
      },
      fail: function(res) {}
    }

  }
  clickshowmorecomment(e) {
    var id = e.currentTarget.id;
    var showmorecomment = this.Base.getMyData().showmorecomment;
    showmorecomment[id] = 1;
    this.Base.setMyData({
      showmorecomment
    });

  }
}

function dtime(t) {
  var t = parseInt(t);
  var minute = parseInt(t / 60);
  var second = parseInt(t % 60);
  minute = minute <= 9 ? "0" + minute.toString() : minute.toString();
  second = second <= 9 ? "0" + second.toString() : second.toString();

  return minute + ":" + second;
}




var innerAudioContext = null;
var snumber = 100000000;
var audioctx = null;
var videoctx = null;
var catc = null;
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
body.deletecomment = content.deletecomment;
body.likeComment = content.likeComment;
body.reply = content.reply;
body.clearReply = content.clearReply;
body.likeSubComment = content.likeSubComment;
body.subreply = content.subreply;
body.loadlikelist = content.loadlikelist;
body.like = content.like;
body.audioPause = content.audioPause; 
body.clickshowmorecomment = content.clickshowmorecomment;
body.clickaudioPause = content.clickaudioPause;

Page(body)