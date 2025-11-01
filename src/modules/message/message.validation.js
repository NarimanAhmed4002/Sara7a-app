 import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const sendMessageSchema = joi.object({
    content:joi.string().min(3).max(5000),
    receiver:generalFields.objectId.required(),
    sender:generalFields.objectId,
}).required();

export const getMessageSchema = {
    params: joi.object().keys({
    id:generalFields.objectId.required()
    }).required(),
    headers: generalFields.headers
}

export const getAllMessagesSchema = {
    headers: generalFields.headers,
    query: joi.object().keys({
        page: joi.number().min(1).messages({
            "number.base":"Page must be a number.",
            "number.min":"Page must be at least 1.",
            "string.base":"Page must be a number."
        }),
        limit: joi.number().min(1).messages({
            "number.base":"Limit must be a number.",
            "number.min":"Limit must be at least 1.",
            "string.base":"Limit must be a number."
    })
})
}