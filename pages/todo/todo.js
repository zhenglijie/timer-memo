// pages/todo/todo.js

var util = require('../../utils/util.js');

wx.cloud.init()
const db = wx.cloud.database()
const todos = db.collection('todos')
//const todo = db.collection('todos').doc('c462c81061a8ac5e000e6a4b48176d50')

//console.log(todo)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        TodoNumber:1,
        allTodo:[
            {
                importance:"!",
                title:"做大作业",
                checked:false,
                time:"下午3:13",
            },
            {
                importance:"!",
                title:"玩游戏",
                checked:false,
                time:"下午6.16",
            },
            {
                importance:"!",
                title:"吃饭",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"睡觉",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"喝可乐",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"喝奶茶",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"吃炸串",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"哎哈哈",
                checked:false,
                time:"下午7.15",
            },
            {
                importance:"!",
                title:"嗯哈哈哈哈啊",
                checked:false,
                time:"下午7.15",
            },
        ]
    },
    addToDo:function() {
        var time = util.formatTime(new Date());
        console.log(time);
        db.collection('todos').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
              description: "learn cloud database",
              due: new Date("2018-09-01"),
              tags: [
                "cloud",
                "database"
              ],
              // 为待办事项添加一个地理位置（113°E，23°N）
              location: new db.Geo.Point(113, 23),
              done: false
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.query)
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