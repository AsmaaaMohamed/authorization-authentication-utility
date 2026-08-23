const express=require("express")
const Router =express.Router()
const authcontroller=require("../controllers/auth")
const validate=require("../middelware/validation")
const validation=require("../validation/auth")
Router.post("/register",validate(validation.registerSchema),authcontroller.register)
Router.post("/login",validate(validation.loginSchema),authcontroller.login)

module.exports= Router