const { authModel } = require('../models/auth.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')


module.exports.getUsers = async (req, res, next) => {
    try{
        if(req.params.id) return res.send(await authModel.find({_id:req.params.id}))
        res.send(await authModel.find({}));
    }
    catch(err){
        next(err)
    }
}

module.exports.login = async (req, res, next) => {
    try{
    const user = await authModel.find({ email: req.body.email })
    if (!user[0]) return res.send({ message: "User Doesn't Exist", status: 404 });
    if (!await bcrypt.compare(req.body.password, user[0].password)) return res.send({ message: "Password Missmatched", status: 401 })
    const token  = await jwt.sign({ email: user[0].email ,_id:user[0]._id}, config.get('jwtSecrate'))
    res.cookie('token',token)
    return res.send({ status: 200, token: token })
    }
    catch(err){
        next(err)
    }
}


module.exports.register = async (req, res, next) => {
    try {
        const userget = await authModel.find({phone:req.body.phone})
        console.log(userget)
        if(userget.length!=0) return res.send(userget[0])
        const user = authModel(req.body)
        
        return res.send(await user.save())

    }
    catch (err) {
        next(err)
    }
}

module.exports.updatemessage = async (req, res, next) => {
    try {
        const userget = await authModel.updateOne({_id:req.params.id},{$set:{
            messages:req.body.messages
        }})
        res.send(userget)
    

    }
    catch (err) {
        console.log(err.message)
    }
}


module.exports.verifyToken = async (payload,req, res, next) => {
    try {
        return res.send(payload)

    }
    catch (err) {
        next(err)
    }
}