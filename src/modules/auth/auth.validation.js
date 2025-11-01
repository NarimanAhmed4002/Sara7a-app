import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
export const registerSchema = joi.object({
        fullName:generalFields.name.required(),
        email:generalFields.email,
        password:generalFields.password.required().regex(/^[a-zA-Z0-9]{8,30}$/),
        phoneNumber:generalFields.phoneNumber,
        dob:generalFields.dob
    }).or("email", "phoneNumber");

export const loginSchema = joi.object({
    email:generalFields.email,
    phoneNumber:generalFields.phoneNumber,
    password:generalFields.password.required()
}).or("email", "phoneNumber");

export const resetPassword = joi.object({
    email:generalFields.email.required(),
    otp:generalFields.otp.required(),
    newPassword:generalFields.password.required(),
    rePassword:generalFields.confirmPassword("newPassword").required()
})

export const refreshTokenSchema = {
    headers:generalFields.headers
}