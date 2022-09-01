const app = getApp()
Page({
  data: {
    minHour: 0,
    maxHour: 24,
    minDate: new Date(1990,1,1).getTime(),
    maxDate: new Date(2099, 12, 31).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    currentChoose: ''
  },
  openPicker() {
    this.setData({ show: true })
  },
  onConfirm(e) {
    this.setData({ show: false, currentChoose: this.formatDate(new Date(e.detail)) })
  },
  onClose() {
    this.setData({ show: false })
  },
  onCancel() {
    this.setData({ show: false })
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
    taskStartTime += " " + date.getHours() + ":" + date.getMinutes()
    this.setData({
      taskStartTime: taskStartTime,
    })
    return taskStartTime;
  },
})