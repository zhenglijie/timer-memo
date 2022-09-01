// pages/todo/todo.js

var util = require('../../utils/util.js');

wx.cloud.init()
const db = wx.cloud.database()
//const todo = db.collection('todos').doc('c462c81061a8ac5e000e6a4b48176d50')

//console.log(todo)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        OpenId:"",
        TodoNumber:0,
        TodoContent: "",
        userInputContent:"",
        IschooseImportant: false,
        IschooseVoice: false,
        IschooseClock:false,
        IschooseLocation:false,
        haveInput: false,
        Show: false, 
        allTodo:[],
        checkShow:false,
        Isdone:false,
        windowHeight: 0,//记录界面高度
        
        containerHeight: 0,//记录未固定整体滚动界面的高度
        
        containerBottomHeight: 0,//记录未固定整体滚动界面距离底部高度
        
        keyboardHeight: 282,//键盘高度
        
        isIphone: false,//是否为苹果手机，因苹果手机效果与Android有冲突，所以需要特殊处理

        dialogOpenFlag:false,

        currentSystemTime:"",

        minHour: 0,
        maxHour: 24,
        minDate: new Date(1990,1,1).getTime(),
        maxDate: new Date(2099, 12, 31).getTime(),
        currentDate: new Date().getTime(),
        Isshow: false,
        currentChoose: '',
        haveappear: false
    },
    addToDo:function() {
        let that = this;
        that.setData({
            dialogOpenFlag:true,
            Show:true
        })
        var time = util.formatTime(new Date());
        console.log("todo", time);
    },
    heightChange:function(e) {
        var that = this
        console.log(e.detail.height)
        if (!that.data.haveappear) { //如果没有出现过时间选择
            if (e.detail.height == 0) {
                that.setData({
                    Show:false
                })
            }
        } else {
            that.setData({
                haveappear: false
            })
        }
        /*
        wx.onKeyboardHeightChange(res => {
            if (res.height == 0) {
                that.setData({
                    Show:false
                })
            }
            console.log("键盘高度发生变化", res.height)
        })*/
       },
    ChooseVoice:function() {
        var that = this
        var c = that.data.IschooseVoice
        that.setData({
            IschooseVoice: c == false ? true : false
        })
    },
    ChooseClock:function() {
        var that = this
        var c = that.data.IschooseClock
        that.setData({
            IschooseClock: c == false ? true : false
        })
        wx.navigateTo({
          url: '/pages/chooseTime/chooseTime',
        })
    },
    ChooseLocation:function() {
        var that = this
        var c = that.data.IschooseLocation
        that.setData({
            IschooseLocation: c == false ? true : false
        })
    },
    ChooseImportant:function() {
        var that = this
        var c = that.data.IschooseImportant
        that.setData({
            IschooseImportant: c == false ? true : false
        })
    },
    getTodoInput:function(e) {
        console.log("待办内容是：", e.detail.value)
        this.setData({
            userInputContent:e.detail.value,
            haveInput: e.detail.value == "" ? false : true
        })
    },
    deleteTodo:function(e) {
        var item = e.currentTarget.dataset.item;
        var that = this
        console.log(item)
        
        var time = util.formatTime(new Date());
        time = time.replaceAll('/', '-')
        console.log(time)

        var allTodos = that.data.allTodo
        for (let i = 0; i < allTodos.length; i++) {
            var todos = allTodos[i];
            var id = todos._id
            console.log(todos.Isdone ,"+", id)
            db.collection("todos").where({
                _id:id
            }).update({
                data: {
                    Isdone: todos.Isdone,
                    Islate: (time > todos.time ? true : false)
                },
                success:function(res) {
                    console.log("现在时间：" + time, "待办时间:" + todos.time)
                    console.log(res)
                }
            })
        }
        
        wx.showLoading({
            title: '删除中',
            duration: 500
          })
        db.collection("todos").where({
            _openid:item._openid,
            _id:item._id
        }).remove({
            success:function(res) {
                console.log(res)
                db.collection("todos").where({
                    _openid:item._openid
                }).get({
                    success:function(res) {
                        console.log(res)
                        that.setData({
                            allTodo:res.data,
                        })
                    }
                }),
                db.collection("todos").where({
                    _openid:item._openid
                }).count()
                .then(res => {
                    console.log(res)
                    that.setData({
                        TodoNumber:res.total
                    })
                })
            }
        })
    },
    IsFinshTodos:function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        var val = e.detail.value[0], that = this
        console.log(val)
        var alltodos = that.data.allTodo
    },
    checkTodos:function(e) { //说明点击了按钮，那么不触发键盘
        var that = this
        that.setData({
            checkShow:true
        })
        let id = e.currentTarget.dataset.id;
        console.log("当前checkBox事件：",id);
        var alltodos = that.data.allTodo
        for (let i = 0; i < alltodos.length; i++) {
            //console.log(i)
            //console.log(alltodos[i])
            if (alltodos[i]._id == id) {
                alltodos[i].Isdone = (alltodos[i].Isdone == true ? false : true)
                alltodos[i].pri = (alltodos[i].Isdone ? 9999 : 1)
                break
            }
        }
        console.log(alltodos)
        that.setData({
            allTodo:alltodos,
            //checkShow:false
            //Show: false
        })
    },
    Save:function() {
        var that = this
        console.log("TestSave")
        that.setData({
            Show:false
        })

        var time = util.formatTime(new Date());
        time = time.replaceAll('/', '-')
        console.log(time)

        var allTodos = that.data.allTodo
        for (let i = 0; i < allTodos.length; i++) {
            var todos = allTodos[i];
            var id = todos._id
            console.log(todos.Isdone ,"+", id)
            db.collection("todos").where({
                _id:id
            }).update({
                data: {
                    Isdone: todos.Isdone,
                    Islate: (time > todos.time ? true : false)
                },
                success:function(res) {
                    console.log("现在时间：" + time, "待办时间:" + todos.time)
                    console.log(res)
                }
            })
        }

        db.collection("todos").add({
            data: {
                content: that.data.userInputContent,
                Ischooseimportant: that.data.IschooseImportant,
                IschooseClock: that.data.IschooseClock,
                Isdone: false,
                IschooseLocation: that.data.IschooseLocation,
                location:"",
                pri:1,
                time:that.data.currentChoose,
                Islate:false
            },
            success:function(res) {
                wx.cloud.callFunction({
                    name: 'getOpenId',
                    complete: res => {
                      console.log("获取:" + res.result.userInfo.openId)
                      var userOpenId = res.result.userInfo.openId
                      db.collection('todos').where({
                        _openid: userOpenId,
                      })
                      .count()
                      .then(res => {
                        console.log("总笔记数：" + res.total)
                        that.setData({
                          TodoNumber: res.total,
                        })
                      }),
                      db.collection("todos").where({
                        _openid:userOpenId
                      })
                      .get({
                        success:function(res) {
                          console.log(res.data)
                          that.setData({
                            allTodo:res.data,
                            currentChoose:"",
                            userInputContent:"",
                            haveInput: false
                          })
                        }
                      })
                    }
                  })
                console.log(res)
            }
        })
    },
    ModifyTodo: function() {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        var time = util.formatTime(new Date());
        time = time.replaceAll('/', '-')
        console.log(time)
        /*
        if (time > "2021/12/12 17:38") {
            console.log("geq")
        } else {
            console.log("leq")
        }
        */
        wx.showLoading({
            title: '加载中',
            duration: 500
          })
        wx.getSystemInfo({
          success: function(res){
              that.setData({
                windowHeight:res.windowHeight
              })
              that.setData({
                isIphone:res.model.indexOf("iphone") >= 0 || res.model.indexOf("iPhone") >= 0
              })
          },
        }),
        wx.cloud.callFunction({
            name:"getOpenId",
            complete: res=> {
                console.log(res.result.userInfo.openId)
                that.setData({
                    OpenId:res.result.userInfo.openId
                })
                db.collection("todos").where({
                    _openid:res.result.userInfo.openId
                })
                .orderBy("pri", "asc")
                .get({
                    success:function(res) {
                        console.log("Tset")
                        console.log("todos + ", that.data.OpenId)
                        console.log("获取", res.data)
                        that.setData({
                            allTodo:res.data,
                            currentSystemTime:time
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name: 'getOpenId',
            complete: res => {
              console.log("获取:" + res.result.userInfo.openId)
              var userOpenId = res.result.userInfo.openId
              db.collection('todos').where({
                _openid: userOpenId,
              })
              .count()
              .then(res => {
                console.log("总笔记数：" + res.total)
                that.setData({
                  TodoNumber: res.total,
                })
              }),
              db.collection("todos").where({
                _openid:userOpenId
              })
              .orderBy("pri", "asc")
              .get({
                success:function(res) {
                  console.log(res.data)
                  that.setData({
                    allTodo:res.data
                  })
                  wx.hideLoading({
                    success: (res) => {},
                  })
                }
              })
            }
          })
        // let that = this
        // setTimeout(() => {
        //     //界面初始化渲染需要初始化获取整体界面的高度以及距离信息
        //     that.refreshContainerHeight()
        // }, 800);
    },

    /**
    
    * 刷新整体界面高度、距离等信息，如列表有上划加载数据，需要在数据加载过后调用此方法进行高度以及间距的刷新
    
    */
    
    // refreshContainerHeight: function() {
    //     let that = this
    //     let query = wx.createSelectorQuery();
    //     query.select('.contain').boundingClientRect()
    //     query.exec((res) => {
    //     //container为整体界面的class的样式名称
    //         that.setData({
    //             containerHeight:res[0].height
    //         })
    //         that.setData({
    //             containerBottomHeight:res[0].bottom
    //         })
    //         console.log("未固定整体滚动界面距离底部高度"+res[0].bottom)
    //     })
    // },
    closeDialog:function(){
        let that = this
        if(that.data.windowHeight){
            that.setData({
                dialogOpenFlag:false,
            })
        }
    },


    /**
    
    * 评论框焦点获取监听
    
    */

   consol:function(){
        console.log("点击功能")
   },
   setButtomZero:function(){
        let that = this;
        that.setData({
            keyboardHeight:0,
        })
   },
    
    inputCommentsFocus: function(e) {
        let that = this
        wx.onKeyboardHeightChange(res => {
            that.setData({
                keyboardHeight:res.height
            })
            console.log(res.height)
        })
        // let that = this
        // if (!that.data.isIphone) {
        //     let keyboardHeight = e.detail.height
        //     let windowHeight = that.data.windowHeight
        //     let containerHeight = that.data.containerHeight
        //     let containerBottomHeight = that.data.containerBottomHeight
        //     //整体内容高度大于屏幕高度，才动态计算输入框移动的位置；
        //     if (containerHeight > windowHeight) {
        //         if ((containerBottomHeight - windowHeight) > keyboardHeight) {
        //             //距离底部高度与屏幕高度的差值大于键盘高度，则评论布局上移键盘高度；
        //             that.setData({
        //                 keyboardHeight: e.detail.height
        //             })
        //         } else {
        //             let newHeight = containerBottomHeight - windowHeight
        //             console.log("设置高度"+newHeight)
        //             that.setData({
        //                 keyboardHeight: newHeight
        //             })
        //         }
        //     } else {
        //         that.setData({
        //             keyboardHeight: 0
        //         })
        //     }
        // } else {

        //     that.setData({
        //         keyboardHeight: 0
        //     })
        // }
    
    },

    /**
    
    * 评论框焦点失去监听
    
    */
    inputCommentsBlur: function(e) {
        let that = this
        that.setData({
            keyboardHeight: 0
        })
        that.setData({
            dialogOpenFlag:false
        })
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
        var time = util.formatTime(new Date());
        time = time.replaceAll('/', '-')
        console.log(time)

        var that = this
        var allTodos = that.data.allTodo
        for (let i = 0; i < allTodos.length; i++) {
            var todos = allTodos[i];
            var id = todos._id
            console.log(todos.Isdone ,"+", id)
            db.collection("todos").where({
                _id:id
            }).update({
                data: {
                    Isdone: todos.Isdone,
                    Islate: (time > todos.time ? true : false)
                },
                success:function(res) {
                    console.log("现在时间：" + time, "待办时间:" + todos.time)
                    console.log(res)
                }
            })
        }
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
        var time = util.formatTime(new Date());
        time = time.replaceAll('/', '-')
        console.log(time)

        var that = this
        var allTodos = that.data.allTodo
        for (let i = 0; i < allTodos.length; i++) {
            var todos = allTodos[i];
            var id = todos._id
            console.log(todos.Isdone ,"+", id)
            db.collection("todos").where({
                _id:id
            }).update({
                data: {
                    Isdone: todos.Isdone,
                    Islate: (time > todos.time ? true : false)
                },
                success:function(res) {
                    console.log("现在时间：" + time, "待办时间:" + todos.time)
                    console.log(res)
                    db.collection("todos").where({
                        _openid:that.data.OpenId
                    }).get({
                        success:function(res) {
                            var resdata = res.data
                            wx.stopPullDownRefresh({
                              success: (res) => {
                                that.setData({
                                    allTodo:resdata
                                })
                              },
                            })
                        },
                    })
                }
            })
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

  openPicker() {
    this.setData({ 
        Isshow: true,
        haveappear: true
    })
  },
  onConfirm(e) {
    this.setData({ 
        Isshow: false, 
        currentChoose: this.formatDate(new Date(e.detail)) 
    })
    console.log(this.data.currentChoose)
  },
  onClose() {
    this.setData({ Isshow: false })
  },
  onCancel() {
    this.setData({ Isshow: false })
  },
  formatDate(date) {
    let taskStartTime
    if (date.getMonth() < 9) {
      taskStartTime = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-"
    } else {
      taskStartTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
    }
    if (date.getDate() < 10) {
      taskStartTime += "0" + date.getDate()
    } else {
      taskStartTime += date.getDate()
    }
    taskStartTime += " "
    if (date.getHours() < 10) {
        taskStartTime += "0" + date.getHours()
    } else {
        taskStartTime += date.getHours()
    }
    if (date.getMinutes() < 10) {
        taskStartTime += ":" + "0" + date.getMinutes()
    } else {
        taskStartTime += ":" + date.getMinutes()
    }
    //taskStartTime += " " + date.getHours() + ":" + date.getMinutes()
    this.setData({
      taskStartTime: taskStartTime,
    })
    return taskStartTime;
  },
})