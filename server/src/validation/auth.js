const Joi = require("joi")
const registerSchema=Joi.object({
    firstName:Joi.string().required()
    ,lastName:Joi.string().required()
    ,userName:Joi.string().required()
    ,email: Joi.string().email().required()
    ,password: Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base":
      "Password must contain uppercase, lowercase and number",
    "string.empty": "Password is required"
  })
,
 confirmPassword: Joi.string().required()
})
const loginSchema=Joi.object({
email: Joi.string().email().required()
,password: Joi.string()
  .min(8)
  .max(30).required()
})


module.exports={loginSchema,registerSchema}