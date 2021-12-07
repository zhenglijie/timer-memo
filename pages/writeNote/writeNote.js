// pages/writeNote/writeNote.js
var util = require('../../utils/util.js');

wx.cloud.init()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"标题",
        content:"",
        Time:"今天 晚上9:47",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var time = util.formatTime(new Date());
        console.log(time);
        var that = this;
        /*that.setData({
            Time:time
        })*/
        //console.log(options.query)
        const eventChannel = that.getOpenerEventChannel()
        var Data = [];
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            //console.log(data)
            Data = data
        })
        console.log(Data)
        that.setData({
            title:"hhh",
            content:"jh",
            Time:time
        })
    },
    getTitle:function(e) {
        this.setData({
            title:e.detail.value
        })
    },
    getContent:function(e) {
        this.setData({
            content:e.detail.value
        })
    },
    submitNote:function() {
        var that = this
        console.log(that.data.title)
        console.log(that.data.content)
        db.collection('notes').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              title: that.data.title,
              content: that.data.content,
              Time:that.data.Time
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})