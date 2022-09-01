// index.js
// 获取应用实例
var util = require('../../utils/util.js');

const app = getApp()

wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command
var userOpenId
const MAX_LIMIT = 20

Page({
  data: {
    allNote: [
      {
      },
    ],
    showUploadTip: false,
    haveGetOpenId: false,
    envId: '',
    userOpenId: '',
    notes:[],
    notes_nums:0,
    showNoteNumbers:0,
    HaveSearch:[],
    IsHaveSearchContent:false
  },
  getSearchInput:function(e) {
    console.log(e.detail.value)
    var that = this
    if (e.detail.value == "") {
      that.setData({
        IsHaveSearchContent: false
      })
    }
  },
  searchSubmit:function(e) {
    console.log("按回车:",e.detail.value);
    var search = e.detail.value
    console.log(search)
    var that = this
    that.setData({
      IsHaveSearchContent:e.detail.value == "" ? false : true
    })
    let AllContent = []
    db.collection("notes").where(_.or ([{
      title:db.RegExp({
        regexp: ".*" + search,
        options: "i"
      })
    },
    {
      content:db.RegExp({
        regexp: ".*" + search,
        options: "i"
      })
    }
    ])).get({
      success:res => {
        that.setData({
          HaveSearch:res.data
        })
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  addNote:function() {
    var isModify = false //非修改
    wx.navigateTo({
      url: '/pages/writeNote/writeNote',
      success: function(res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", {data: {isModify}})
      }
      /*
      success:function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: userOpenId })
      }*/
    })
  },
  edit:function(e) {
    var that = this
    var item = e.currentTarget.dataset.item
    var title = item.title
    var content = item.content
    var id = item._id
    var openId = item._openid
    var isModify = true
    console.log(item)
    wx.navigateTo({
      url: '/pages/writeNote/writeNote',
      success:function(res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", {data: {isModify, id, openId, title, content}})  
      }
    })
  },
  // 事件处理函数
  onLoad: function (options) {
    db.collection("notes").where({
      title: db.RegExp({
        regexp:"sd",
        options:"i"
      }),
      content: db.RegExp({
        regexp:"爱你啊",
        options: "i"
      })
    })
    .get({
      success:function(res) {
        console.log("模糊搜索Test：",res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var time = util.formatTime(new Date());
    console.log("初次渲染完成：",time);
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log("获取:" + res.result.userInfo.openId)
        userOpenId = res.result.userInfo.openId,
        db.collection("personData").where({
          _openid:userOpenId
        })
        .get({
          success:function(res) {
            wx.hideLoading({
              success: (res) => {},
            })
            console.log(res)
            if (res.data.length == 0) {
              console.log("未注册")
              db.collection("personData").add({
                data:{
                  personSex: "",
                  personRegion: "",
                  personDate: "",
                  FillGender:false,
                  FillNativePlace:false,
                  FillDateOfBirth:false,
                  personTle: "",
                  FillpersonTle:false,
                  personEmail:"",
                  FillpersonEmail:false,
                  personRegistration: time,
                  FillpersonRegistration:true
                },
                success:function(res) {
                  console.log(res)
                }
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      notes_nums:0
    })
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log("获取:" + res.result.userInfo.openId)
        //userOpenId = res.result.userInfo.openId
        db.collection('notes').where({
          _openid: userOpenId,
        })
        .count()
        .then(res => {
          console.log("总笔记数：" + res.total)
          that.setData({
            showNoteNumbers: res.total,
            openId:userOpenId
          })
        }),
        db.collection("notes").where({
          _openid:userOpenId
        })
        .orderBy("Time", "desc")
        .get({
          success:function(res) {
            console.log(res.data)
            that.setData({
              notes:res.data
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh({
      success: (res) => {
        db.collection("notes").where({
          _openid:that.data.userOpenId
        })
        .orderBy("Time", "desc").get({
          success:function(res) {
            that.setData({
              notes:res.data              
            })
          }
        })
      },
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    let x = that.data.notes_nums + 20
    console.log(that.data.showNoteNumbers)
    if (x < that.data.showNoteNumbers) {
      wx.showLoading({
        title: '刷新中！',
        duration: 500
      })
    }
    console.log(x)
    let old_data = that.data.notes
    db.collection("notes").skip(x).where({
      _openid:that.data.openId
    })
    .orderBy("Time", "desc")
    .get()
    .then(res => {
      res.data.forEach((item, i) => {
        res.data[i].content = res.data[i].content.split('*hy*').join('\n');
      })
      
      that.setData({
        notes: old_data.concat(res.data),
        notes_nums: x
      })
      console.log(res.data)
    })
    .catch(err => {
      console.error(err)
    })
    console.log('circle 下一页');
  },  
})
