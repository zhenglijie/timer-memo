// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag:false,
        loginState:"未登录",
        loginAvatar:"/images/nologin.png",
        loginLabel:"点击去登录",
        isLogin:"false",
    },
    Userlogin:function() {
      var that = this;
      if (!that.data.loginFlag) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            wx.showLoading({
              title: '登陆中',
              duration: 200
           })
            that.setData({
              loginAvatar: res.userInfo.avatarUrl,
              loginState: res.userInfo.nickName,
              loginLabel: "已登录",
              loginFlag:true,
              isLogin:true
              //hasUserInfo: true
            })
            console.log(res.userInfo)
          }
        })
      }
    },
    checkPersonAccInfor:function() {
      var that = this;
    },
    TapRecommendToFriends:function() {
      console.log("test");
      var that = this;
      if (that.data.loginFlag) {
        console.log("share");
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage'],
        })
      } else {
        wx.showToast({
          title: '请先登录！',
        })
      }
    },
    checkPersonAccInfor:function() {
      var that = this
      if (!that.data.loginFlag) { //如果没有登录
        wx.showModal({
          title:"温馨提示",
          content:"请先登录哦",
          cancelText:"取消",
          cancelColor:"#696969",
          confirmColor:"#FF0000"
        })
      } else {
        wx.navigateTo({
          url: '/pages/personAccount/personAccount',
          success:function(res) {
            res.eventChannel.emit("accptDataFromOpenerPage", {data: that.data.loginFlag})
          }
        }) 
      }
    },
    introFunction:function() {
      wx.navigateTo({
        url: '/pages/introFunction/introFunction',
      })
      /*
      wx.cloud.getTempFileURL ({
        fileList:["cloud://cloud1-7gkk8dgvf52d4703.636c-cloud1-7gkk8dgvf52d4703-1308562009/“时光memo”使用帮助.pdf"],
        success:res=>{
          console.log(res.fileList)
        },
        fail:console.errorx,
      })*/
    },
    userAgreement:function() {
      wx.navigateTo({
        url: '/pages/userAgreement/userAgreement',
      })
    },
    aboutMinprogram:function() {
      wx.navigateTo({
        url: '/pages/aboutMinprogram/aboutMinprogram',
      })
    },
    help:function() {
      wx.navigateTo({
        url: '/pages/help/help',
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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