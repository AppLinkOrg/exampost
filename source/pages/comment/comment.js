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
    this.Base.setMyData({ options});
  }
  onMyShow() {
    var that = this;
  }
  confirm(e){
    var comment=e.detail.value.comment;
    if(comment.trim()==""){
      this.Base.info("评论不能为空");
      return;
    }
    console.log(comment);
    var api = new PostApi();
    api.comment({ post_id: this.Base.options.id, comment: comment, formid: e.detail.formId, reply_member_id: this.Base.options.reply_member_id, reply_comment_id: this.Base.options.reply_comment_id }, (ret) => {

      AppBase.NEEDRELOADTIMES = true;
      this.backPage();
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.confirm = content.confirm;
Page(body)