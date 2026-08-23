const mongoose=require("mongoose")
const { type } = require("node:os")
const UserSchema=mongoose.Schema({
firstName:{
type:String,
required:true
},
lastName:{
type:String,
required:true
},
userName:{
type:String,
required:true
},
email:{
type:String,
required:true
},
password:{
type:String,
select:false,
required:true
},
confirmpassword:{
type:String,
required:true
},
isVerified:{
type:Boolean,
default:false
},
otp:{
type:String
},
expiredAt:{
type:Date
},
role:{
type:String,
default:"User",
required:true
}
})
module.exports=new mongoose.model('users',UserSchema)