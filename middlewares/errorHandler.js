module.exports = async(err,req ,res,next)=>{
        if(err) res.send({message:err.message,status:401})
}