import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updatePasswordSchema = { 
    body:Joi.object().keys({
        oldPassword: generalFields.password.required(),
        newPassword: generalFields.password.required(),
        confirmPassword: generalFields.confirmPassword("newPassword").required(),
    }),
    headers:generalFields.headers
};
