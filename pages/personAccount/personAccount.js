// pages/personAccount/personAccount.js
// index.js
// 获取应用实例
wx.cloud.init()
const db = wx.cloud.database()

function Person(sex,birthplace,birthday)
{
  this.sex=sex;
  this.birthplace=birthplace;
  this.birthday=birthday;
}

Page({
  data: {
    flag:true,
    gender:["男","女","不限"],
    myinfo:null,
    isLogin:false,
    FillGender: false,
    FillNativePlace: false,
    FillDateOfBirth: false,
    FillTle: false,
    FillEmail:false,
    SEX:"未填写",
    BirthPlace:"未填写",
    Birthday: "未填写",
    isFillSubmit: false,
    Openid:"",
    Tle: "",
    Email: "",
    RegistrationTime: "",
  },
  pickerSex:function(e){
    var that=this;
    this.sex=this.data.gender[e.detail.value]
    var ssex = this.sex
    console.log("test")
    if (that.data.isFillSubmit) { //如果用户已经填写过了 那么就是修改了
      db.collection("personData").where({
        _openid:that.data.Openid
      })
      .update({
        data: {
          personSex: ssex,
          FillGender: true
        }  
      })
      .then(res => {
        console.log("更新后", ssex)
        that.setData({
          SEX: ssex,
          FillGender: true,
          isFillSubmit: true
        })
      })
    } else { //如果用户没有填写
      db.collection("personData").add({
        data:{
          personSex: ssex,
          personRegion: "",
          personDate:"",
          FillGender:true,
          FillNativePlace:false,
          FillDateOfBirth:false,
          personTle: "",
          personEmail:"",
          personRegistration: ""
        },
        success:function(res) {
          console.log(res)
          that.setData({
            FillGender:true,
            SEX:ssex,
            isFillSubmit: true
          })
        }
      })
    }
  },
  pickerRegion:function(e){
    var that=this;
    this.birthplace=e.detail.value;
    let address = '';
    //var BirThPlace = this.birthplace
    e.detail.value.forEach(element =>{
      address += " "+element
    });
    console.log(address)
    if (that.data.isFillSubmit) { //如果用户已经填写过了 那么就是修改了
      db.collection("personData").where({
        _openid:that.data.Openid
      })
      .update({
        data: {
          personRegion: address,
          FillNativePlace: true
        }  
      })
      .then(res=>{
        console.log("更新后", address)
        that.setData({
          BirthPlace: address,
          FillNativePlace: true,
          isFillSubmit: true
        })
      })
    } else { //如果用户没有填写
      db.collection("personData").add({
        data:{
          personSex: "",
          personRegion: address,
          personDate:"",
          FillGender:false,
          FillNativePlace:true,
          FillDateOfBirth:false,
          personTle: "",
          personEmail:"",
          personRegistration: ""
        },
        success:function(res) {
          console.log(res)
          that.setData({
            BirthPlace: address,
            FillNativePlace: true,
            isFillSubmit: true
          })
        }
      })
    }
  },
  pickerDate:function(e){
    var that=this;
    this.birthday=e.detail.value
    var BirThDay = this.birthday
    if (that.data.isFillSubmit) { //如果用户已经填写过了 那么就是修改了
      db.collection("personData").where({
        _openid:that.data.Openid
      })
      .update({
        data: {
          personDate: BirThDay,
          FillDateOfBirth: true
        }  
      })
      .then(res=>{
        console.log("更新后", BirThDay)
        that.setData({
          Birthday: BirThDay,
          FillDateOfBirth: true,
          isFillSubmit: true
        })
      })
    } else { //如果用户没有填写
      db.collection("personData").add({
        data:{
          personSex: "",
          personRegion: "",
          personDate: BirThDay,
          FillGender:false,
          FillNativePlace:false,
          FillDateOfBirth:true,
          personTle: "",
          personEmail:"",
          personRegistration: ""
        },
        success:function(res) {
          console.log(res)
          that.setData({
            Birthday: BirThDay,
            FillDateOfBirth: true,
            isFillSubmit: true
          })
        }
      })
    }
  },
  showMessage:function(e){
    var p = new Person(this.sex,this.birthplace,this.birthday)
    this.setData({
      flag:false,
      person:p
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载信息中',
      duration: 500
    })
    var that = this
    //var stu = wx.getStorageSync('student');
    //this.setData({ myinfo: stu });
    // console.log(this.data.myinfo);
    const eventChannel = that.getOpenerEventChannel()
    eventChannel.on("accptDataFromOpenerPage", (res) => {
      console.log(res.data)
      that.setData({
        isLogin:res.data
      })
    })
    wx.cloud.callFunction({
      name:"getOpenId",
      success:function(res) {
        var openid = res.result.userInfo.openId
        console.log(openid)
        that.setData({
          Openid:openid
        })
        db.collection("personData").where({
          _openid: openid
        })
        .get({
          success:function(res) {
            console.log(res)
            if (res.data.length == 0) { //如果查询失败！
              console.log("查询失败！")
              that.setData({
                isFillSubmit:false
              })
            } else { //如果查询成功！
              console.log("查询成功！")
              console.log(res.data[0].FillGender)
              console.log(res.data[0].personSex)
              that.setData({
                isFillSubmit:true,
                FillGender:res.data[0].FillGender,
                FillNativePlace: res.data[0].FillNativePlace,
                FillDateOfBirth: res.data[0].FillDateOfBirth,
                SEX:res.data[0].FillGender == false ? "未填写" : res.data[0].personSex,
                BirthPlace:res.data[0].FillNativePlace == false ? "未填写" : res.data[0].personRegion,
                Birthday:res.data[0].FillDateOfBirth == false ? "未填写" : res.data[0].personDate,
                RegistrationTime:res.data[0].personRegistration,
                FillTle: res.data[0].FillpersonTle,
                Tle:res.data[0].personTle,
                FillEmail: res.data[0].FillpersonEmail,
                Email: res.data[0].personEmail
              })
            }
          },
          fail:function(res) {
            console.log("未找到该集合！")
          }
        })
      }, 
      fail: function(res) {
        console.log("未查询到")
      }
    })
  /*
    that.setData({
      SEX: "男"
    })*/
  },
  exit:function(e){
    wx.showModal({
      title: '提示',
      content: '是否确认退出',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.removeStorageSync('student');
          //页面跳转
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  resetpwd:function(e){
    var no=this.data.myinfo.no;
    wx.navigateTo({
      url: '../password/password?no=' + no,
    })
  },
  FillYourMobile:function(e) {
    var that = this
    wx.showModal({
      title: '资料填写',
      editable: true,
      placeholderText: "在这里输入您的手机号",
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var Tlephone = res.content
          if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(res.content))) {
            wx.showToast({
            title: '输入格式有误',
            duration: 2000,
            icon:'error'
            });
          } else {
            if (that.data.isFillSubmit) { //如果用户已经填写过了 那么就是修改了
              db.collection("personData").where({
                _openid:that.data.Openid
              })
              .update({
                data: {
                  personTle: Tlephone,
                  FillpersonTle: true
                }  
              })
              .then(res=>{
                console.log("更新后", Tlephone)
                that.setData({
                  Tle: Tlephone,
                  FillTle: true,
                  isFillSubmit: true
                })
              })
            } else { //如果用户没有填写
              db.collection("personData").add({
                data:{
                  personSex: "",
                  personRegion: "",
                  personDate: "",
                  FillGender:false,
                  FillNativePlace:false,
                  FillDateOfBirth:false,
                  FillpersonTle:true,
                  personTle: Tlephone,
                  personEmail:"",
                  personRegistration: ""
                },
                success:function(res) {
                  console.log(res)
                  that.setData({
                    FillTle: true,
                    Tle: Tlephone,
                    isFillSubmit: true
                  })
                }
              })
            }
            /*
            that.setData({
              FillTle: true,
              Tle: res.content
            })*/
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  FillEmail:function(e) {
    var that = this
    wx.showModal({
      title: '资料填写',
      editable: true,
      placeholderText: "在这里输入您的电子邮箱",
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var Email = res.content
          if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(Email))) {
            wx.showToast({
            title: '输入格式有误',
            duration: 2000,
            icon:'error'
            });
          } else {
            if (that.data.isFillSubmit) { //如果用户已经填写过了 那么就是修改了
              db.collection("personData").where({
                _openid:that.data.Openid
              })
              .update({
                data: {
                  personEmail: Email,
                  FillpersonEmail: true
                }  
              })
              .then(res=>{
                console.log("更新后", Email)
                that.setData({
                  Email: Email,
                  FillEmail: true,
                  isFillSubmit: true
                })
              })
            } else { //如果用户没有填写
              db.collection("personData").add({
                data:{
                  personSex: "",
                  personRegion: "",
                  personDate: "",
                  FillGender:false,
                  FillNativePlace:false,
                  FillDateOfBirth:false,
                  FillpersonTle:false,
                  FillpersonEmail: true,
                  personTle: "",
                  personEmail:Email,
                  personRegistration: ""
                },
                success:function(res) {
                  console.log(res)
                  that.setData({
                    FillEmail: true,
                    Email: Email,
                    isFillSubmit: true
                  })
                }
              })
            }
            /*
            that.setData({
              FillTle: true,
              Tle: res.content
            })*/
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})