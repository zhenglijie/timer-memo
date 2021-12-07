// index.js
// 获取应用实例
const app = getApp()

wx.cloud.init()
const db = wx.cloud.database()
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
    showNoteNumbers:0
  },
  searchSubmit:function() {
    console.log();
  },
  addNote:function() {
    wx.navigateTo({
      url: '/pages/writeNote/writeNote',
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
    console.log(item)
    wx.navigateTo({
      url: '/pages/writeNote/writeNote',
      success:function(res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", {data: {title, content}})  
      }
    })
  },
  // 事件处理函数
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log("获取:" + res.result.userInfo.openId)
        userOpenId = res.result.userInfo.openId
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
        }).get({
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
        duration: 1000
      })
    }
    console.log(x)
    let old_data = that.data.notes
    db.collection("notes").skip(x).where({
      _openid:this.data.openId
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
