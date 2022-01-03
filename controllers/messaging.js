const c = require('config')
const { Messaging } = require('../models/messaging.model')






module.exports.getchatroom = async (req, res, next) => {
    try {
        const chatroom = await Messaging.find({ chatroomid: req.params.id })
        if (chatroom.length == 0) {
            const message = new Messaging({
                chatroomid: req.params.id,
            })
            return res.send(await message.save())
        }
        return res.send(chatroom[0])

    } catch (err) {
        next(err)
    }
}

module.exports.addMessage = async (req, res, next) => {
    try {
        const userget = await Messaging.updateOne({ chatroomid: req.params.id }, {
            $push: {
                messages: req.body
            }
        })
        res.send(userget)

    } catch (err) {
        next(err)
    }
}

module.exports.userlist = async (payload, req, res, next) => {
    try {
        const userlist = []
        const list = await Messaging.find({ $or: [{ recieverid: payload._id }, { senderid: payload._id }] })
        for (let item of list) {
            if (item.senderemail === payload.email && !userlist.includes(item.recieveremail)) {
                userlist.push(item.recieveremail)
            }
            if (item.recieveremail === payload.email && !userlist.includes(item.senderemail)) {
                userlist.push(item.senderemail)
            }
        }
        res.send(userlist)

    } catch (err) {
        next(err)
    }
}