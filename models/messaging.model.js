const mongoose = require('mongoose');

module.exports.Messaging = mongoose.model('messages',new mongoose.Schema({
    chatroomid:{
        type:String,
        unique:true
    },
    messages:{
        type:Array,
        default:[]
    }
    

}))