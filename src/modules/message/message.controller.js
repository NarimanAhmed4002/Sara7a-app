import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { getMessageSchema, sendMessageSchema } from "./message.validation.js";
import { getMessage, sendMessage } from "./message.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { fileUpload } from "../../utils/multer/multer.local.js";
const router = Router()
// sarah.com/message/2345654321234567890
// anonymous sender
router.post("/:receiver", 
    fileUpload().array("attachments", 2), 
    isValid(sendMessageSchema),
    sendMessage)

// known sender
router.post("/:receiver/sender", 
    isAuthenticated,
    fileUpload().array("attachments", 2), 
    isValid(sendMessageSchema),
    sendMessage
)

// get specific message by id
router.get("/:id", isAuthenticated, isValid(getMessageSchema),getMessage)
export default router 