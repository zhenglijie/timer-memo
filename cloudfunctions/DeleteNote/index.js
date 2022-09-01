// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const id = event.id, openid = event.openid;
    try {
       return await db.collection("notes").where({
            _id: event.id,
            _openid: event.openid
        }).remove()
    } catch(e) {
        console.log(e)
    }
}