const Users=require("../models/user")
const bcrypt=require("bcrypt")
const nodemailer = require("nodemailer");
const sendEmail=  require("../middelware/email");
const crypto=require("crypto")
const jwt =require("jsonwebtoken")
const register=async(req,res)=>{
  try{
const{firstName,lastName,userName,email,password,confirmpassword}=req.body
const userNamecheck=await Users.findOne({userName})
if(userNamecheck){
    return res.status(409).json({status:"fail",msg:"this userName used before"})
}
const emailcheck=await Users.findOne({email})
if(emailcheck){
    return res.status(409).json({status:"fail",msg:"this email used before"})
}
if(password!==confirmpassword){
return res.status(409).json({status:"fail",msg:"password not equle confirmpassword"})
}
const hashpass= await bcrypt.hash(password,10)
const otp =await crypto.randomInt(100000, 999999).toString(); 
const hashotp=await bcrypt.hash(otp,10)
const newuser=new Users({
  firstName,lastName,userName,email,password:hashpass,role:"User", 
  otp:hashotp,
  isVerified:false,
  expiredAt:Date.now()+5*60*1000
})
await newuser.save()
await sendEmail({
to: newuser.email,
subject: "Verify Your Account",
html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2>Welcome, ${userName} 👋</h2>
    <p>Use the verification code below to activate your account on <strong>ELZAEM</strong>.</p>
    <div style="
      background-color: #f4f4f4;
      padding: 15px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 5px;
      border-radius: 8px;
      margin: 20px 0;
    ">
      ${otp}
    </div>

    <p>This code will expire in <strong>5 minutes</strong>.</p>

    <p>If you didn't request this code, you can safely ignore this email.</p>

    <hr style="margin: 20px 0;" />

    <p>Thank you for choosing ELZAEM.</p>
  </div>
`
});
return res.status(200).json({status:"success",msg:"user register successfully",data:{firstName,lastName,userName,email,role}})
  } catch (error) {
    next(error);
  }
}

const login=async(req,res)=>{
  try{
const{email,password}=req.body
const emailcheck=await Users.findOne({email}).select("+password")
if(!emailcheck){
    return res.status(400).json({status:"fail",msg:"password or email is wrong "})
}
const passwordcheck=await bcrypt.compare(password,emailcheck.password)
if(!passwordcheck){
    return res.status(400).json({status:"fail",msg:"password or email is wrong "})
}
if(emailcheck.isVerified==false){
    return res.status(400).json({status:"fail",msg:"this email not Verified to login "})
}
const accesstoken = jwt.sign({id:emailcheck.id,role:emailcheck.role},process.env.Access_SECRET_KEY,{expiresIn:"30m"})
const refreshtoken = jwt.sign({id:emailcheck.id,role:emailcheck.role},process.env.Refresh_SECRET_KEY,{expiresIn:"7d"})

res.status(200).json({status:"success",msg:"welcome"+" "+emailcheck.userName,data:{refreshtoken:refreshtoken,accesstoken:accesstoken}})
  } catch (error) {
    next(error);
}}

module.exports={register,login}