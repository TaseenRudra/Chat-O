const mongoose = require('mongoose')




module.exports.authModel = mongoose.model('auth',new mongoose.Schema({
    name:{
        type:String,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    isActive:{
        type:Boolean
    },
    lastSeen:{
        type:Date,
        default:Date.now
    }
}))