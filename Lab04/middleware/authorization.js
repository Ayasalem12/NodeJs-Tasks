const jwt =require('jsonwebtoken')

exports.auth=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({status:"fail",message:'you must login first!'})
    }
    try{
        let decoded = jwt.verify(authorization,process.env.SECRET_KEY)
        console.log(decoded)
        next()
    }catch(err){
        return res.status(401).json({status:"fail",message:'you must login first uncorrect!'})
    }
}