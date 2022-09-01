// pages/writeNote/writeNote.js
var util = require('../../utils/util.js');

wx.cloud.init()
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"",
        content:"",
        Time:"今天 晚上9:47",
        IsModify:false, //如果是修改那么为true 如果是写默认为false
        notesID:"",
        OpenId:"",
        disable:true,
        transmitData:{},
        ischeck:true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var checkTime = "2021/12/22 22:40";
        var time = util.formatTime(new Date());
        console.log(time);
        var that = this;
        that.setData({
            ischeck:time < checkTime ? true : false
        })
        //console.log(options.query)
        const eventChannel = that.getOpenerEventChannel()
        var Data
        eventChannel.on('acceptDataFromOpenerPage', (res) => {
            //console.log(data)
            //console.log(data.IsModify)
            //console.log(data.content)
            Data = res.data
            //console.log(res.data)
            console.log(res.data.content)

            if(res.data.isModify) { //如果是修改
                that.setData({
                    title:Data.title,
                    content:Data.content,
                    Time:time,
                    OpenId:Data.openId,
                    notesID:Data.id,
                    IsModify:(Data.isModify == true ? true : false),
                    disable:false
                })
            } else { //如果是新写
                that.setData({
                    Time:time,
                    disable:true
                })
            }

            that.setData({
                transmitData:res.data
            })
        })
       // console.log("Data:", Data)
        //console.log("传递的数据：", that.data.transmitData)
       // console.log(Data.data.isModify)
       /*if(Data.isModify) { //如果是修改
            that.setData({
                title:Data.title,
                content:Data.content,
                Time:time,
                OpenId:Data.openId,
                notesID:Data.id,
                IsModify:(Data.isModify == true ? true : false),
                disable:false
            })
        } else { //如果是新写
            that.setData({
                Time:time,
                disable:true
            })
        }*/
    },
    getTitle:function(e) {
        var that = this
        that.setData({
            title:e.detail.value
        })
    },
    getContent:function(e) {
        var that = this
        that.setData({
            content:e.detail.value
        })
    },
    submitNote:function() { //如果是提交笔记
        var that = this
        if (that.data.title == "" && that.data.content == "") return;
        console.log(that.data.IsModify)
        that.setData({
            disable:false
        })
        if (that.data.IsModify == false) { //如果是false
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
        } else {
            console.log(that.data.OpenId)
            console.log(that.data.content)
            db.collection("notes").where({
                _openid: that.data.OpenId,
                _id: that.data.notesID
            }).update({
                data:{
                    title: that.data.title,
                    content:that.data.content,
                    Time:that.data.Time
                }
            })
        }
        wx.navigateBack({
          delta: 0,
        })
    },
    DeleteNote:function() {
        var that = this;
        /*that.setData({
            Time:time
        })*/
        //console.log(options.query)
        /*
        const eventChannel = that.getOpenerEventChannel()
        var Data = [];
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            //console.log(data)
            Data = data
        })*/
        //console.log(that.data.transmitData)
        wx.cloud.callFunction({
            name:"DeleteNote",
            data: {
                openid: that.data.OpenId,
                id: that.data.notesID
            }, 
            complete: res => {
                console.log('callFunction test result: ', res)
                wx.navigateBack({
                  delta: 1,
                })
            }
        })  
        /*
        db.collection("notes").where({
            _id: that.data.notesID,
            _openid: that.data.OpenId
        }).remove()*/
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
})