const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken')

const verifytoken=async(req,res,next)=>{
const auth = req.headers.authorization
if(!auth){
    return res.json({status:"fail",msg:"authorization is required"})
}
const token=auth.split(' ')[1]
try {
const decode =jwt.verify(token,process.env.secretkey)
req.user=decode
return next()
}
catch(error){
return res.json({status:"error",msg:"token is wrong or expired login again"})
}
}
module.exports={verifytoken}
