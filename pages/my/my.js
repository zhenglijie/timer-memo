// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag:false,
        loginState:"未登录",
        loginAvatar:"/images/nologin.png",
        loginLabel:"点击去登录"
    },
    Userlogin:function() {
      var that = this;
      if (!that.data.loginFlag) {
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            that.setData({
              loginAvatar: res.userInfo.avatarUrl,
              loginState: res.userInfo.nickName,
              loginLabel: "已登录",
              loginFlag:true
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
      wx.navigateTo({
        url: '/pages/personAccount/personAccount',
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})