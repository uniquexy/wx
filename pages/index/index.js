//index.js
import WxValidate from '../../utils/WxValidate.js'
import dateTimePicker from '../../utils/dateTimePicker.js'
//获取应用实例
const app = getApp()
Page({
  data: {
    dateTimeArray: null,
    dateTime: null,
    startYear: 2019,
    endYear: 2030,
    userName: '',
    userTell: '',
    userCard: '',
    houseType:'',
    room:'',
    array: ['一室', '两室', '三室', '单间'],
    objectArray: [
      {
        id: 0,
        name: '一室'
      },
      {
        id: 1,
        name: '两室'
      },
      {
        id: 2,
        name: '三室'
      },
      {
        id: 3,
        name: '单间'
      },
      {
        id: 4,
        name: '请选择房类'
      }
    ],
    index: 4,
    hx_index: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    var that = this;
    wx.request({
      url: "http://localhost:8080/lock/GetHouseByType.action?method=getHouseByType&houseType=" + e.detail.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) { //请求成功
        console.log(res.data.body);//在调试器里打印网络请求到的json数据
        that.setData({
          roomArray: res.data.body
        })
      },
      fail: function (res) { // 请求失败
      }
    })

  },
  bindPickerChangeType: function (e) {
    console.log('picker发送', e.detail.value)
    this.setData({
      hx_index: e.detail.value
    })

  },
  // 设置用户名
  userNameInput: function (e) {
    let userName = e.detail.value
    if(userName != ''){
      let userName =  e.detail.value
      
    }else{
      wx.showToast({

        title: '用户名不能为空',
        content:'用户名不能为空，请输入'
        //image: './../../../../images/fail.png'

      })
      return false
    }
    this.setData({
      userName: e.detail.value
    })
  },
  //电话
  userTellInput: function (e) {

    let userTell = e.detail.value

    if (userTell.length === 11) {

      let checkedNum = this.checkPhoneNum(userTell)

    } else {
      wx.showToast({

        title: '手机号不正确',

        //image: './../../../../images/fail.png'

      })
      return false
    }
  },
  checkPhoneNum: function (userTell) {

    let str = /^1\d{10}$/

    if (str.test(userTell)) {

      return true

    } else {

      wx.showToast({

        title: '手机号不正确',

        //image: './../../../../images/fail.png'

      })
      return false
    }
  },
  // 设置身份证号
  userCardInput: function (e) {
    this.setData({
      userCard: e.detail.value
    })
  },
  // 设置房屋类型
  houseTypeInput: function (e) {
    if(e.detail.value==""){
      houseType:"一室"
    }else{


    this.setData({
      houseType: e.detail.value
    })
    
    }
  },
  // 设置房间
  roomInput: function (e) {
    this.setData({
      room: e.detail.value
    })
  },
  changeDateTime1(e) {
    this.setData({ 
      dateTime1: e.detail.value 
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, 
    dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value
    });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr
    });
  },
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime2: obj.dateTime,
      dateTimeArray2: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
    });
    
    //验证方法
    this.initValidate();
  },
  /***验证表单字段 */
  initValidate: function () {
    const rules = {
      userName: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      userTell: {
        required: true,
        tel: true
      }
    }
    const messages = {
      userName: {
        required: '请填写用户名称',
        maxlength: '用户名称不超过10个字！'
      },
      userTell: {
        required: '请填写联系电话',
        tel: '请填写正确的联系电话'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  /***调用验证函数***/
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    //console.log(e.detail.value)
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    //向后台发送时数据 wx.request...
    wx.request({
      url: 'http://localhost:8080/lock/userApplicationInfo.action?method=userApplication',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: params,
      success: function (res) {
        console.log("返回数据为：" + res.data.msg);
        var msg = res.data.msg;
        if (msg == 0){
          wx.showModal({
            title: '提示',
            content: '申请成功！',
            success: function (res) {
              wx.navigateTo({
                 url: '/pages/index/index'
              })
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }else if(msg == 1){
          wx.showModal({
            title: '提示',
            content: '申请失败！',
         
          })
        } else if (msg == 2) {
          wx.showModal({
            title: '提示',
            content: '已出租！',

          })
        }
      },
      fail: function (res) {

      }
    }),
      this.setData({
        userName: '',
        userTell: '',
        userCard: '',
        houseType:''
      })
  },
  /***报错 **/
  showModal(error) {
    wx.showModal({
      content: error.msg
    })
  },
})
