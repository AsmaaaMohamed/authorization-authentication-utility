const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const mongoose=require("mongoose")
const errorHandler = require("./middelware/errorHandler");
const app=express()
app.use(express.json())


mongoose.connect(process.env.DATA_BASE).then(()=>{
   console.log("database connected successfully") 
})

const authroutes= require('./routes/auth')
app.use('/api/auth',authroutes) 




app.use(errorHandler);
app.listen(process.env.PORT,()=>{
    console.log("port run successfully")
})
