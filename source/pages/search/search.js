// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { ProductApi } from '../../apis/product.api';
import { InstApi } from '../../apis/inst.api';

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      inputShowed: true,
      inputVal: ""
    });
  }
  onMyShow() {
    var that = this;
      var instapi = new InstApi();
      instapi.searchkeyword({},(ret)=>{
        that.Base.setMyData({ history: ret.history, hotest: ret.hotest});
      });
      
  }

  showInput() {
    this.Base.setMyData({
      inputShowed: true
    });
  }
  hideInput() {
    this.Base.setMyData({
      inputVal: "",
      inputShowed: false, searchresult: []
    });
  }
  clearInput() {
    this.Base.setMyData({
      inputVal: "", searchresult:[]
    });
    
  }
  inputTyping(e) {
    this.Base.setMyData({
      inputVal: e.detail.value
    });
  }
  search(){
    var inputVal = this.Base.getMyData().inputVal;
    var api = new ProductApi();
    api.search({keyword:inputVal},(searchresult)=>{
      this.Base.setMyData({ searchresult});
    });
  }
  searchKeyword(e){
    var val=e.currentTarget.id;
    this.Base.setMyData({
      inputVal: val, inputShowed: true
    });
    this.search();
  }
  clearrecord(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否确定清空我的搜索记录？',
      success(e){
        if(e.confirm){
          that.Base.setMyData({ history: [] });

          var instapi = new InstApi();
          instapi.clearkeyword({}, (ret) => {

          });
        }
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.showInput = content.showInput;
body.hideInput = content.hideInput;
body.clearInput = content.clearInput; 
body.inputTyping = content.inputTyping; 
body.search = content.search; 
body.searchKeyword = content.searchKeyword;
body.clearrecord = content.clearrecord;
Page(body)