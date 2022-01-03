const mongoose = require('mongoose')
const config = require('config')


module.exports = async()=>{
    mongoose.connect(config.get('db'))
    .then(()=>console.log("successfuly connected to mongodb"))
    .catch((err)=>console.log(err.message))
    }



